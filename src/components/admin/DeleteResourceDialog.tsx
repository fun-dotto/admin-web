import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "#/components/ui/alert-dialog";
import { Button } from "#/components/ui/button";

export type DeleteResourceDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** 削除対象の表示名 (ID など) */
	target: string;
	deleting?: boolean;
	error?: string;
	onConfirm: () => void;
};

export function DeleteResourceDialog({
	open,
	onOpenChange,
	target,
	deleting,
	error,
	onConfirm,
}: DeleteResourceDialogProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>削除しますか？</AlertDialogTitle>
					<AlertDialogDescription className="break-all">
						{target} を削除します。この操作は取り消せません。
					</AlertDialogDescription>
				</AlertDialogHeader>
				{error && (
					<p role="alert" className="text-body text-destructive break-words">
						{error}
					</p>
				)}
				<AlertDialogFooter>
					<AlertDialogCancel disabled={deleting}>キャンセル</AlertDialogCancel>
					{/* AlertDialogAction は押下時に自動で閉じるため、完了まで開いたままにできる Button を使う */}
					<Button variant="destructive" disabled={deleting} onClick={onConfirm}>
						{deleting ? "削除中…" : "削除"}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
