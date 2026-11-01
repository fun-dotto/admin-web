import { Plus } from "lucide-react";
import type * as React from "react";
import { Button } from "#/components/ui/button";
import { cn } from "#/lib/utils";

export type ResourcePageHeaderProps = React.ComponentProps<"header"> & {
	title: string;
	description?: string;
	/** 指定しない場合は新規作成ボタンを表示しない */
	onCreate?: () => void;
	/** 右側に表示する任意の操作 */
	actions?: React.ReactNode;
};

export function ResourcePageHeader({
	title,
	description,
	onCreate,
	actions,
	className,
	...props
}: ResourcePageHeaderProps) {
	return (
		<header
			className={cn(
				"flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
				className,
			)}
			{...props}
		>
			<div className="flex min-w-0 flex-col gap-1">
				<h1 className="text-large-title break-words">{title}</h1>
				{description && (
					<p className="text-body text-muted-foreground break-words">
						{description}
					</p>
				)}
			</div>
			{actions && (
				<div className="flex gap-2 self-start sm:self-auto">{actions}</div>
			)}
			{onCreate && (
				<Button onClick={onCreate} className="self-start sm:self-auto">
					<Plus />
					新規作成
				</Button>
			)}
		</header>
	);
}
