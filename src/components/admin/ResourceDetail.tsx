import type * as React from "react";
import { Skeleton } from "#/components/ui/skeleton";
import { cn } from "#/lib/utils";

export type ResourceDetailItem = { key: string; label: string; value: string };

export type ResourceDetailProps = React.ComponentProps<"div"> & {
	items: ResourceDetailItem[];
	loading?: boolean;
	error?: string;
};

const skeletonRows = ["a", "b", "c", "d"];

export function ResourceDetail({
	items,
	loading,
	error,
	className,
	...props
}: ResourceDetailProps) {
	return (
		<div
			className={cn("rounded-lg border bg-card p-4 md:p-6", className)}
			{...props}
		>
			{loading ? (
				<div className="flex flex-col gap-3">
					{skeletonRows.map((key) => (
						<Skeleton key={key} className="h-5 w-full" />
					))}
				</div>
			) : error ? (
				<p role="alert" className="text-body text-destructive break-words">
					{error}
				</p>
			) : items.length === 0 ? (
				<p className="text-body text-muted-foreground">項目がありません</p>
			) : (
				<dl className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-[minmax(0,12rem)_1fr]">
					{items.map((item) => (
						<div key={item.key} className="contents">
							<dt className="text-subtitle-2 text-muted-foreground break-all">
								{item.label}
							</dt>
							<dd className="-mt-3 text-body break-all whitespace-pre-wrap md:mt-0">
								{item.value || <span className="text-muted-foreground">—</span>}
							</dd>
						</div>
					))}
				</dl>
			)}
		</div>
	);
}
