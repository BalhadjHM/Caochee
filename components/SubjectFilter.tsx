"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { subjects } from "@/constants";
import { formUrlQuery, removeKeysFromUrlQuery } from "@jsmastery/utils";

const SubjectFilter = () => {
	const pathName = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();
	const query = searchParams.get("subject") || "";

	const [searchQuery, setSearchQuery] = useState("");

    // Sync the local state with the URL query on initial render and when the URL changes
	useEffect(() => {
        // Debounce the URL updates to avoid excessive pushes while typing
		const delayDebounceFn = setTimeout(() => {
			if (searchQuery) {
				const newUrl = formUrlQuery({
					params: searchParams.toString(),
					key: "subject",
					value: searchQuery,
				});

				router.push(newUrl, { scroll: false });
			} else {
                // If the search query is cleared, remove the subject filter from the URL
				if (pathName === "/companions") {
					const newUrl = removeKeysFromUrlQuery({
						params: searchParams.toString(),
						keysToRemove: ["subject"],
					});

					router.push(newUrl, { scroll: false });
				}
			}
		}, 700);
        // Clear the timeout if the component unmounts or if searchQuery changes before the timeout completes
		return () => clearTimeout(delayDebounceFn);
	}, [query, searchQuery, router, pathName, searchParams]);

	return (
		// Shadcn UI Select component for subject filtering
		<Select value={searchQuery} onValueChange={setSearchQuery}>
			<SelectTrigger className="relative border border-black rounded-lg items-center flex gap-2 px-2 py-1 h-fit">
				<SelectValue placeholder="Filter by Subject" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{subjects.map((subject) => (
						<SelectItem key={subject} value={subject}>
							{subject}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
};

export default SubjectFilter;
