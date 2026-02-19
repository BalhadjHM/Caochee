import CompanionCard from "@/components/CompanionCard";
import CompanionList from "@/components/CompanionList";
import CTA from "@/components/CTA";
import { Button } from "@/components/ui/button";
import { recentSessions } from "@/constants";
import { getSubjectColor } from "@/lib/utils";
import React from "react";

const Page = () => {
	return (
		<main>
			<h1 className="text-2xl underline">Popular Compnions</h1>

			<section className="home-section">
				<CompanionCard
					id="1"
					name="Mark the math wizard"
					topic="Integrals and derivatives"
					subject="Mathematics"
					duration={60}
					color={getSubjectColor('maths')}
				/>
				<CompanionCard
					id="2"
					name="Sarah the science expert"
					topic="Chemical reactions"
					subject="Science"
					duration={45}
					color={getSubjectColor('science')}
				/>
				<CompanionCard
					id="3"
					name="Alex the history nerd"
					topic="Ancient civilizations"
					subject="History"
					duration={30}
					color={getSubjectColor('history')}
				/>
			</section>

			<section className="home-section">
				<CompanionList
                    title="Recently completed Sessions"
                    companions={recentSessions}
                    className="w-2/3 max-lg:w-full"
                />
				<CTA />
			</section>
		</main>
	);
};

export default Page;
