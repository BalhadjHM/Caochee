"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NavItems = () => {
	const pathName = usePathname();

	const navItems = [
		{ label: "Home", href: "/" },
		{ label: "Companions", href: "/companions" },
		{ label: "My Journey", href: "/my-journey" },
	];
	return (
		<nav className="flex items-center gap-4">
			{navItems.map(({ label, href }) => (
				<Link
					key={label}
					href={href}
					className={
						pathName === href ? "text-primary font-bold" : ""
					}
				>
					{label}
				</Link>
			))}
		</nav>
	);
};

export default NavItems;
