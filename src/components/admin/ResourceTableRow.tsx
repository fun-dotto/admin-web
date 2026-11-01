import { Link } from "@tanstack/react-router";
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
};

export function ResourceTableRow({
	columns,
	row,
	resourceSlug,
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
		</TableRow>
	);
}
