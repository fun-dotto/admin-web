import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "#/components/ui/dialog";
import { ResourceForm, type ResourceFormProps } from "./ResourceForm";

export type ResourceFormDialogProps = Omit<ResourceFormProps, "onCancel"> & {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description?: string;
};

export function ResourceFormDialog({
	open,
	onOpenChange,
	title,
	description,
	...formProps
}: ResourceFormDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>
						{description ?? "各項目を入力してください。"}
					</DialogDescription>
				</DialogHeader>
				<ResourceForm {...formProps} onCancel={() => onOpenChange(false)} />
			</DialogContent>
		</Dialog>
	);
}
