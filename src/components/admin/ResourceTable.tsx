import type * as React from "react";
import { Skeleton } from "#/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";
import { cn } from "#/lib/utils";
import {
	ResourceTableRow,
	type ResourceTableRowData,
} from "./ResourceTableRow";

export type ResourceTableColumn = { key: string; label: string };

export type ResourceTableProps = React.ComponentProps<"div"> & {
	columns: ResourceTableColumn[];
	rows: ResourceTableRowData[];
	loading?: boolean;
	error?: string;
	/** 指定しない場合は編集ボタンを表示しない */
	onEdit?: (id: string) => void;
	/** 指定すると各行が詳細画面へのリンクになる */
	resourceSlug?: string;
	onDelete?: (id: string) => void;
};

const skeletonRows = ["a", "b", "c"];

export function ResourceTable({
	columns,
	rows,
	loading,
	error,
	onEdit,
	resourceSlug,
	onDelete,
	className,
	...props
}: ResourceTableProps) {
	const hasActions = Boolean(onEdit || onDelete);
	const colSpan = columns.length + (hasActions ? 1 : 0);

	return (
		<div className={cn("rounded-lg border bg-card", className)} {...props}>
			<Table>
				<TableHeader>
					<TableRow>
						{columns.map((column) => (
							<TableHead key={column.key}>{column.label}</TableHead>
						))}
						{hasActions && <TableHead className="text-right">操作</TableHead>}
					</TableRow>
				</TableHeader>
				<TableBody>
					{loading ? (
						skeletonRows.map((key) => (
							<TableRow key={key}>
								<TableCell colSpan={colSpan}>
									<Skeleton className="h-5 w-full" />
								</TableCell>
							</TableRow>
						))
					) : error ? (
						<TableRow>
							<TableCell
								colSpan={colSpan}
								className="py-8 text-center whitespace-normal text-destructive"
							>
								{error}
							</TableCell>
						</TableRow>
					) : rows.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={colSpan}
								className="py-8 text-center text-muted-foreground"
							>
								データがありません
							</TableCell>
						</TableRow>
					) : (
						rows.map((row) => (
							<ResourceTableRow
								key={row.id}
								columns={columns}
								row={row}
								resourceSlug={resourceSlug}
								onEdit={onEdit}
								onDelete={onDelete}
							/>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}
