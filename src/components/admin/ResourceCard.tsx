import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export type ResourceCardProps = {
	slug: string;
	label: string;
	description?: string;
};

export function ResourceCard({ slug, label, description }: ResourceCardProps) {
	return (
		<Link
			to="/$resource"
			params={{ resource: slug }}
			className="flex items-center justify-between gap-2 rounded-lg border bg-card p-4 text-card-foreground outline-none hover:border-primary focus-visible:ring-[3px] focus-visible:ring-ring/50"
		>
			<span className="flex min-w-0 flex-col gap-1">
				<span className="truncate text-subtitle-1">{label}</span>
				{description && (
					<span className="truncate text-caption-1 text-muted-foreground">
						{description}
					</span>
				)}
			</span>
			<ChevronRight className="size-4 shrink-0 text-muted-foreground" />
		</Link>
	);
}
