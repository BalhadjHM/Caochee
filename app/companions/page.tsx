import React from "react";
import { getAllCompanions } from "@/lib/actions/companion.actions";
import CompanionCard from "@/components/CompanionCard";
import { getSubjectColor } from "@/lib/utils";
import SearchInput from "@/components/SearchInput";
import SubjectFilter from "@/components/SubjectFilter";

const CompnanionsLibrary = async ({ searchParams }: SearchParams) => {
	const filters = await searchParams;
	const subject = filters?.subject as string | "";
	const topic = filters?.topic as string | "";

	const companions = await getAllCompanions({ subject, topic });

	return (
		<main>
			<section className="flex justify-between gap-4 max-sm:flex-col">
				<h1>Companions Library</h1>
				<div className="flex gap-4">
                    <SearchInput />
                    <SubjectFilter />
                </div>
			</section>
			<section className="companions-grid">
				{companions.map((companion) => (
					<CompanionCard
						key={companion.id}
						color={getSubjectColor(companion.subject)}
						{...companion}
					/>
				))}
			</section>
		</main>
	);
};

export default CompnanionsLibrary;
