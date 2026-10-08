import type * as React from "react";
import { Button } from "#/components/ui/button";
import type { FieldSpec, FormValues } from "#/lib/admin/fields";
import { cn } from "#/lib/utils";
import { ResourceFormField } from "./ResourceFormField";
import type { ReferenceOptionsState } from "./ResourceReferenceField";

export type ResourceFormProps = Omit<
	React.ComponentProps<"form">,
	"onSubmit" | "defaultValue"
> & {
	fields: FieldSpec[];
	defaultValues?: FormValues;
	submitLabel?: string;
	submitting?: boolean;
	error?: string;
	/** 参照フィールドの選択肢 (フィールド名ごと) */
	references?: Record<string, ReferenceOptionsState>;
	onSubmit: (values: FormValues) => void;
	onCancel?: () => void;
};

function readFormValues(
	form: HTMLFormElement,
	fields: FieldSpec[],
): FormValues {
	const data = new FormData(form);
	const values: FormValues = {};
	for (const field of fields) {
		const value = data.get(field.name);
		values[field.name] =
			field.kind === "boolean"
				? value !== null
				: typeof value === "string"
					? value
					: "";
	}
	return values;
}

export function ResourceForm({
	fields,
	defaultValues = {},
	submitLabel = "保存",
	submitting,
	error,
	references,
	onSubmit,
	onCancel,
	className,
	...props
}: ResourceFormProps) {
	return (
		<form
			className={cn("flex flex-col gap-4", className)}
			onSubmit={(event) => {
				event.preventDefault();
				onSubmit(readFormValues(event.currentTarget, fields));
			}}
			{...props}
		>
			{fields.length === 0 && (
				<p className="text-body text-muted-foreground">入力項目はありません</p>
			)}
			{fields.map((field) => (
				<ResourceFormField
					key={field.name}
					spec={field}
					defaultValue={defaultValues[field.name]}
					disabled={submitting}
					reference={references?.[field.name]}
				/>
			))}
			{error && (
				<p role="alert" className="text-body text-destructive break-words">
					{error}
				</p>
			)}
			<div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
				{onCancel && (
					<Button
						type="button"
						variant="outline"
						onClick={onCancel}
						disabled={submitting}
					>
						キャンセル
					</Button>
				)}
				<Button type="submit" disabled={submitting}>
					{submitting ? "保存中…" : submitLabel}
				</Button>
			</div>
		</form>
	);
}
