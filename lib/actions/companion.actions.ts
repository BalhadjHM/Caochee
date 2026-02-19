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

    if (error || !data) throw new Error(error?.message || "Failed to get companion");

    return data;
}
