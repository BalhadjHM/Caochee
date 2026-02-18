'use server';

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "../supabase";

export const createCompanion = async (FormData: CreateCompanion) => {
	const { userId: author } = await auth();
	const supabase = createSupabaseClient();
	const { data, error } = await supabase
		.from("companions")
		.insert({ author, ...FormData })
		.select("*")
		.single();

	if (error || !data)
		throw new Error(error?.message || "Failed to create companion");

	return data;
};
