import { Link } from "@tanstack/react-router";
import type * as React from "react";
import { cn } from "#/lib/utils";

export type AdminShellProps = React.ComponentProps<"div"> & {
	/** サイドバーに表示するナビゲーション */
	nav: React.ReactNode;
};

export function AdminShell({
	nav,
	children,
	className,
	...props
}: AdminShellProps) {
	return (
		<div
			className={cn("flex min-h-screen flex-col md:flex-row", className)}
			{...props}
		>
			<aside className="flex flex-col border-b bg-sidebar text-sidebar-foreground md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:border-r md:border-b-0">
				<div className="px-4 py-4">
					<Link
						to="/"
						className="rounded-md text-title text-primary outline-none focus-visible:ring-[3px] focus-visible:ring-sidebar-ring/50"
					>
						Dotto Admin
					</Link>
				</div>
				<div className="max-h-64 overflow-y-auto px-2 pb-4 md:max-h-none md:flex-1">
					{nav}
				</div>
			</aside>
			<main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
		</div>
	);
}
