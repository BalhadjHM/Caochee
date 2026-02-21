"use server";

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "../supabase";

export const createCompanion = async (FormData: CreateCompanion) => {
	const { userId: author } = await auth();
	const supabase = createSupabaseClient();

	/* Insert new companion into the database */
	const { data, error } = await supabase
		.from("companions")
		.insert({ author, ...FormData })
		.select("*")
		.single();

	if (error || !data)
		throw new Error(error?.message || "Failed to create companion");

	return data;
};

export const getAllCompanions = async ({
	limit = 10,
	page = 1,
	subject,
	topic,
}: GetAllCompanions) => {
	const supabase = createSupabaseClient();
	let query = supabase.from("companions").select("*");

	/* Search by subject and topic */
	if (subject && topic) {
		query = query
			.ilike("subject", `%${subject}%`)
			.ilike("topic", `%${topic}%`)
			.or(`topic.ilike.%${topic}%, name.ilike.%${topic}%`);
	} else if (subject) {
		query = query.ilike("subject", `%${subject}%`);
	} else if (topic) {
		query = query.or(`topic.ilike.%${topic}%, name.ilike.%${topic}%`);
	}

	/* Pagination */
	query = query.range((page - 1) * limit, page * limit - 1);

	const { data: companions, error } = await query;
	if (error) throw new Error(error.message);

	return companions;
};

export const getCompanion = async (id: string) => {
	const supabase = createSupabaseClient();
	const { data, error } = await supabase
		.from("companions")
		.select("*")
		.eq("id", id)
		.single();

	if (error || !data)
		throw new Error(error?.message || "Failed to get companion");

	return data;
};

export const addToSessionHistory = async (comapanionId: string) => {
	const userId = await auth();
	const supabase = createSupabaseClient();
	const { data, error } = await supabase
		.from("session_history")
		.insert({ user_id: userId, companion_id: comapanionId })
		.select("*")
		.single();

	if (error || !data)
		throw new Error(error?.message || "Failed to add to session history");

	return data;
};

export const getRecentSessions = async (limit = 10) => {
	const supabase = createSupabaseClient();
	const { data, error } = await supabase
		.from("session_history")
		.select(`companions: companion_id (*)`)
		.order("created_at", { ascending: false })
		.limit(limit);

	if (error) throw new Error(error.message);

	return data.map(({ companions }) => companions);
};

export const getUserSessions = async (userId: string, limit = 10) => {
	const supabase = createSupabaseClient();
	const { data, error } = await supabase
		.from("session_history")
		.select(`companions: companion_id (*)`)
		.eq("user_id", userId)
		.order("created_at", { ascending: false })
		.limit(limit);

	if (error) throw new Error(error.message);

	return data.map(({ companions }) => companions);
};

export const getUserCompanions = async (userId: string) => {
	const supabase = createSupabaseClient();
	const { data, error } = await supabase
		.from("companions")
		.select("*")
		.eq("author", userId);

	if (error) throw new Error(error.message);

	return data;
};

export const newCompanionPermissions = async () => {
	const { userId, has } = await auth();
	const supabase = createSupabaseClient();
	if (has({plan: "pro"})) return true;
    
	let limit = 3; // default limit for free users
    
	if (has({ feature: "3_active_companions" })) {
		limit = 3;
	} else if (has({ feature: "10_active_companions" })) {
		limit = 10;
	}

    const { data, error } = await supabase
        .from("companions")
        .select("id", { count: "exact", head: true })
        .eq("author", userId);
    
    if (error) throw new Error(error.message);
    const companionCount = data?.length || 0;

    if (companionCount >= limit) {
        throw new Error(`You have reached your limit of ${limit} active companions. Please delete some companions or upgrade your plan to create more.`);
    } else {
        return true;
    }
};
