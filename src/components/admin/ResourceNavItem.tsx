import { Link } from "@tanstack/react-router";

export type ResourceNavItemProps = {
	slug: string;
	label: string;
};

export function ResourceNavItem({ slug, label }: ResourceNavItemProps) {
	return (
		<Link
			to="/$resource"
			params={{ resource: slug }}
			className="block truncate rounded-md px-2 py-1.5 text-body outline-none hover:bg-sidebar-accent focus-visible:ring-[3px] focus-visible:ring-sidebar-ring/50 data-[status=active]:bg-sidebar-primary data-[status=active]:text-sidebar-primary-foreground"
		>
			{label}
		</Link>
	);
}
