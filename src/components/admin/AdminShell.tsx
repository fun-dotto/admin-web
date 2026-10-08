import { Link } from "@tanstack/react-router";
import { cva } from "class-variance-authority";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import * as React from "react";
import { Button } from "#/components/ui/button";
import { cn } from "#/lib/utils";

const asideVariants = cva(
	"flex flex-col border-b text-sidebar-foreground md:sticky md:top-0 md:h-screen md:shrink-0 md:border-r md:border-b-0",
	{
		variants: {
			collapsed: {
				false: "md:w-64",
				true: "md:w-auto",
			},
			environment: {
				none: "bg-sidebar",
				production: "bg-environment-production-subtle",
				staging: "bg-environment-staging-subtle",
				development: "bg-environment-development-subtle",
			},
		},
		defaultVariants: { environment: "none" },
	},
);

export type AdminShellEnvironment = "production" | "staging" | "development";

export type AdminShellProps = React.ComponentProps<"div"> & {
	/** サイドバーに表示するナビゲーション */
	nav: React.ReactNode;
	/** サイドバーのナビゲーション上部に表示する要素（環境切り替えなど） */
	sidebarHeader?: React.ReactNode;
	/** 接続先環境。サイドバーを環境ごとの色で塗り分ける */
	environment?: AdminShellEnvironment;
	/** サイドバーを折りたたんでいるか（controlled） */
	collapsed?: boolean;
	/** サイドバーの初期の折りたたみ状態（uncontrolled） */
	defaultCollapsed?: boolean;
	onCollapsedChange?: (collapsed: boolean) => void;
};

export function AdminShell({
	nav,
	sidebarHeader,
	environment,
	collapsed: collapsedProp,
	defaultCollapsed = false,
	onCollapsedChange,
	children,
	className,
	...props
}: AdminShellProps) {
	const [uncontrolledCollapsed, setUncontrolledCollapsed] =
		React.useState(defaultCollapsed);
	const collapsed = collapsedProp ?? uncontrolledCollapsed;
	const navId = React.useId();

	const toggle = () => {
		const next = !collapsed;
		if (collapsedProp === undefined) setUncontrolledCollapsed(next);
		onCollapsedChange?.(next);
	};

	return (
		<div
			className={cn("flex min-h-screen flex-col md:flex-row", className)}
			{...props}
		>
			<aside
				data-state={collapsed ? "collapsed" : "expanded"}
				data-environment={environment}
				className={asideVariants({ collapsed, environment })}
			>
				<div className="flex items-center justify-between gap-2 px-4 py-4 md:px-2">
					<Link
						to="/"
						className={cn(
							"rounded-md text-title text-primary outline-none focus-visible:ring-[3px] focus-visible:ring-sidebar-ring/50 md:px-2",
							collapsed && "md:hidden",
						)}
					>
						Dotto Admin
					</Link>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						aria-label={
							collapsed ? "サイドバーを開く" : "サイドバーを折りたたむ"
						}
						aria-expanded={!collapsed}
						aria-controls={navId}
						onClick={toggle}
					>
						{collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
					</Button>
				</div>
				<div
					id={navId}
					hidden={collapsed}
					className="flex max-h-64 flex-col gap-4 overflow-y-auto px-2 pb-4 md:max-h-none md:flex-1"
				>
					{sidebarHeader && <div className="px-2">{sidebarHeader}</div>}
					{nav}
				</div>
			</aside>
			<main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
		</div>
	);
}
