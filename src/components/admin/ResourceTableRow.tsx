import { Link } from "@tanstack/react-router";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "#/components/ui/button";
import { TableCell, TableRow } from "#/components/ui/table";
import type { ResourceTableColumn } from "./ResourceTable";

export type ResourceTableRowData = {
	id: string;
	cells: Record<string, string>;
};

export type ResourceTableRowProps = {
	columns: ResourceTableColumn[];
	row: ResourceTableRowData;
	/** 指定すると行全体が詳細画面 (/$resource/$id) へのリンクになる */
	resourceSlug?: string;
	onEdit?: (id: string) => void;
	onDelete?: (id: string) => void;
};

export function ResourceTableRow({
	columns,
	row,
	resourceSlug,
	onEdit,
	onDelete,
}: ResourceTableRowProps) {
	return (
		<TableRow className="relative">
			{columns.map((column, index) => (
				<TableCell
					key={column.key}
					className="max-w-xs truncate"
					title={row.cells[column.key]}
				>
					{/* 行全体をクリック可能にするため、先頭列のリンクを stretched link にする */}
					{resourceSlug && index === 0 ? (
						<Link
							to="/$resource/$id"
							params={{ resource: resourceSlug, id: row.id }}
							className="outline-none after:absolute after:inset-0 hover:underline focus-visible:after:ring-[3px] focus-visible:after:ring-ring/50 focus-visible:after:ring-inset"
						>
							{row.cells[column.key]}
						</Link>
					) : (
						row.cells[column.key]
					)}
				</TableCell>
			))}
			{(onEdit || onDelete) && (
				<TableCell className="text-right">
					<div className="relative z-10 flex justify-end gap-1">
						{onEdit && (
							<Button
								variant="ghost"
								size="icon-sm"
								aria-label={`${row.id} を編集`}
								onClick={() => onEdit(row.id)}
							>
								<Pencil />
							</Button>
						)}
						{onDelete && (
							<Button
								variant="ghost"
								size="icon-sm"
								aria-label={`${row.id} を削除`}
								className="text-destructive"
								onClick={() => onDelete(row.id)}
							>
								<Trash2 />
							</Button>
						)}
					</div>
				</TableCell>
			)}
		</TableRow>
	);
}
