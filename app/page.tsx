import CompanionCard from "@/components/CompanionCard";
import CompanionList from "@/components/CompanionList";
import CTA from "@/components/CTA";
import { Button } from "@/components/ui/button";
import { recentSessions } from "@/constants";
import {
	getAllCompanions,
	getRecentSessions,
} from "@/lib/actions/companion.actions";
import { getSubjectColor } from "@/lib/utils";
import React from "react";

const Page = async () => {
	const companions = await getAllCompanions({ limit: 3 });
	const recentSessionsCompanions = await getRecentSessions(3);

	return (
		<main>
			<h1 className="text-2xl underline">Popular Compnions</h1>

			<section className="home-section">
				{companions.map((companion) => (
					<CompanionCard
						key={companion.id}
						{...companion}
						color={getSubjectColor(companion.subject)}
					/>
				))}
			</section>

			<section className="home-section">
				<CompanionList
					title="Recently completed Sessions"
					companions={recentSessionsCompanions}
					className="w-2/3 max-lg:w-full"
				/>
				<CTA />
			</section>
		</main>
	);
};

export default Page;
