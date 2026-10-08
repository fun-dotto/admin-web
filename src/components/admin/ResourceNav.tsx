import type * as React from "react";
import { cn } from "#/lib/utils";
import { ResourceNavItem } from "./ResourceNavItem";

export type ResourceNavGroup = {
	label: string;
	items: { slug: string; label: string }[];
};

export type ResourceNavProps = React.ComponentProps<"nav"> & {
	groups: ResourceNavGroup[];
};

export function ResourceNav({ groups, className, ...props }: ResourceNavProps) {
	return (
		<nav
			aria-label="リソース"
			className={cn("flex flex-col gap-4", className)}
			{...props}
		>
			{groups.map((group) => (
				<section key={group.label} className="flex flex-col gap-1">
					<h2 className="px-2 text-caption-1 text-muted-foreground">
						{group.label}
					</h2>
					<ul className="flex flex-col gap-0.5">
						{group.items.map((item) => (
							<li key={item.slug}>
								<ResourceNavItem slug={item.slug} label={item.label} />
							</li>
						))}
					</ul>
				</section>
			))}
		</nav>
	);
}
