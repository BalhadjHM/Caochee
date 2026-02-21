import React from "react";
import CompanionForm from "@/components/CompanionForm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { newCompanionPermissions } from "@/lib/actions/companion.actions";
import Image from "next/image";
import Link from "next/link";

const NewCompanion = async () => {
	const { userId } = await auth();
	if (!userId) redirect("/sign-in");
	const canCreateCompanion = await newCompanionPermissions();

	return (
		<main className="lg:w-1/3 md:w-2/3 items-center justify-center">
			{canCreateCompanion ? (
				<article className="w-full gap-4 flex flex-col">
					<h1 className="text-2xl font-bold">Companion Builder</h1>
					<CompanionForm />
				</article>
			) : (
				<article className="companion-limit">
					<Image
						src="/images/limit.svg"
						alt="Companion Limit Reached"
						width={360}
						height={230}
					/>
					<div className="cta-badge">Upgrade Your Plan</div>
					<h1 className="text-xl font-bold">
						You&apos;ve Reached Your Companion Limit
					</h1>
					<p className="">
						Upgrade your plan to create more companions and unlock
						advanced features.
					</p>
					<Link
						href="/subscription"
						className="btn-primary w-full justify-center"
					>
						Upgrade My Plan
					</Link>
				</article>
			)}
		</main>
	);
};

export default NewCompanion;
