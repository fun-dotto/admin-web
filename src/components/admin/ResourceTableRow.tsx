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
	onEdit?: (id: string) => void;
	onDelete?: (id: string) => void;
};

export function ResourceTableRow({
	columns,
	row,
	onEdit,
	onDelete,
}: ResourceTableRowProps) {
	return (
		<TableRow>
			{columns.map((column) => (
				<TableCell
					key={column.key}
					className="max-w-xs truncate"
					title={row.cells[column.key]}
				>
					{row.cells[column.key]}
				</TableCell>
			))}
			{(onEdit || onDelete) && (
				<TableCell className="text-right">
					<div className="flex justify-end gap-1">
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
