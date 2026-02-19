import { getCompanion } from "@/lib/actions/companion.actions";
import { getSubjectColor } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import React from "react";
import CompanionComponent from "@/components/CompanionComponent";

interface CompanionSessionPageProps {
	params: Promise<{ id: string }>;
}

const CompanionSession = async ({ params }: CompanionSessionPageProps) => {
	const { id } = await params;
	const comapnion = await getCompanion(id);
	const { name, subject, topic, title, duration } = comapnion;
	const user = await currentUser();

	if (!user) redirect("/sign-in");
	if (!name) redirect("/companions");

	return (
		<main>
			<h1 className="text-2xl font-bold mb-4">{name}</h1>

			{/*  */}
			<article className="flex rounded-border justify-between p-6 max-md:flex-col">
				<div className="flex items-center gap-2">
					<div
						className="size-18 flex items-center justify-center rounded-lg max-md:hidden"
						style={{
							backgroundColor: getSubjectColor(subject),
						}}
					>
						<Image
							src={`/icons/${subject}.svg`}
							alt={`${subject} icon`}
							width={35}
							height={35}
						/>
					</div>

					<div className="flex flex-col gap-2">
						<div className="flex items-center gap-2">
							<p className="font-bold text-2xl">{name}</p>
							<div className="subject-badge max-sm:hidden">
								{subject}
							</div>
						</div>
						<p className="text-lg">{topic}</p>
					</div>
				</div>
				<div>
					<p className="items-start text-2xl max-md:hidden">
						{duration} min
					</p>
				</div>
			</article>

			{/*  */}
			<CompanionComponent {...comapnion} companionId={id} userName={user?.firstName || "Guest"} userImage={user?.imageUrl || ""} />
		</main>
	);
};

export default CompanionSession;
