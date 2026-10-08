import * as React from "react";
import { Label } from "#/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { cn } from "#/lib/utils";

export type EnvironmentOption = {
	id: string;
	label: string;
};

export type EnvironmentSelectProps = Omit<
	React.ComponentProps<"div">,
	"defaultValue"
> & {
	options: readonly EnvironmentOption[];
	/** 選択中の環境 ID（controlled） */
	value?: string;
	/** 初期の環境 ID（uncontrolled） */
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	/** 切り替え処理中 */
	loading?: boolean;
	disabled?: boolean;
};

export function EnvironmentSelect({
	options,
	value,
	defaultValue,
	onValueChange,
	loading = false,
	disabled = false,
	className,
	...props
}: EnvironmentSelectProps) {
	const triggerId = React.useId();

	return (
		<div className={cn("flex flex-col gap-1", className)} {...props}>
			<Label
				htmlFor={triggerId}
				className="text-caption-1 text-muted-foreground"
			>
				接続先環境
			</Label>
			<Select
				value={value}
				defaultValue={defaultValue}
				onValueChange={onValueChange}
				disabled={disabled || loading}
			>
				<SelectTrigger
					id={triggerId}
					aria-busy={loading}
					className="w-full bg-background"
				>
					<SelectValue placeholder="環境を選択" />
				</SelectTrigger>
				<SelectContent>
					{options.map((option) => (
						<SelectItem key={option.id} value={option.id}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
