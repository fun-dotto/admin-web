import { Checkbox } from "#/components/ui/checkbox";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { Textarea } from "#/components/ui/textarea";
import type { FieldSpec } from "#/lib/admin/fields";

export type ResourceFormFieldProps = {
	spec: FieldSpec;
	defaultValue?: string | boolean;
	disabled?: boolean;
};

const inputTypes = {
	string: "text",
	number: "number",
	timestamp: "datetime-local",
	date: "date",
} as const;

export function ResourceFormField({
	spec,
	defaultValue,
	disabled,
}: ResourceFormFieldProps) {
	const id = `field-${spec.name}`;

	if (spec.kind === "boolean") {
		return (
			<div className="flex items-center gap-2">
				<Checkbox
					id={id}
					name={spec.name}
					defaultChecked={defaultValue === true}
					disabled={disabled}
				/>
				<Label htmlFor={id}>{spec.label}</Label>
			</div>
		);
	}

	const textValue = typeof defaultValue === "string" ? defaultValue : "";

	return (
		<div className="flex flex-col gap-2">
			<Label htmlFor={id}>
				{spec.label}
				{spec.required && <span className="text-destructive">*</span>}
			</Label>
			{spec.kind === "enum" ? (
				<Select
					name={spec.name}
					defaultValue={textValue || undefined}
					required={spec.required}
					disabled={disabled}
				>
					<SelectTrigger id={id} className="w-full">
						<SelectValue placeholder="選択してください" />
					</SelectTrigger>
					<SelectContent>
						{spec.options?.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			) : spec.kind === "json" ? (
				<Textarea
					id={id}
					name={spec.name}
					defaultValue={textValue}
					placeholder="JSON"
					className="font-mono"
					disabled={disabled}
				/>
			) : (
				<Input
					id={id}
					name={spec.name}
					type={inputTypes[spec.kind]}
					step={spec.kind === "number" ? "any" : undefined}
					defaultValue={textValue}
					required={spec.required && spec.kind !== "number"}
					disabled={disabled}
				/>
			)}
		</div>
	);
}
