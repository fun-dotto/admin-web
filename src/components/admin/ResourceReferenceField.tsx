import { Check, ChevronsUpDown, X } from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "#/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "#/components/ui/popover";
import { cn } from "#/lib/utils";

export type ReferenceOption = {
	/** 参照先の ID。フォームにはこの値が送られる */
	value: string;
	/** 名前など人が識別できる表示名 */
	label: string;
	/** 補足表示 (ID など) */
	description?: string;
};

export type ReferenceOptionsState = {
	options: ReferenceOption[];
	loading?: boolean;
	error?: string;
};

export type ResourceReferenceFieldProps = ReferenceOptionsState & {
	id?: string;
	/** hidden input の name。FormData で値を取得できるようにする */
	name?: string;
	/** 参照先リソースの表示名 (例: 科目) */
	resourceLabel: string;
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	disabled?: boolean;
	className?: string;
};

export function ResourceReferenceField({
	id,
	name,
	resourceLabel,
	options,
	loading,
	error,
	value: controlledValue,
	defaultValue = "",
	onValueChange,
	disabled,
	className,
}: ResourceReferenceFieldProps) {
	const [open, setOpen] = useState(false);
	const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
	const value = controlledValue ?? uncontrolledValue;
	const selected = options.find((option) => option.value === value);

	const changeValue = (next: string) => {
		setUncontrolledValue(next);
		onValueChange?.(next);
	};

	return (
		<div className={cn("flex flex-col gap-1", className)}>
			<input type="hidden" name={name} value={value} />
			<div className="flex gap-1">
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							id={id}
							type="button"
							variant="outline"
							role="combobox"
							aria-expanded={open}
							disabled={disabled}
							className="min-w-0 flex-1 justify-between font-normal"
						>
							<span
								className={cn("truncate", !value && "text-muted-foreground")}
							>
								{selected?.label ?? (value || `${resourceLabel}を検索して選択`)}
							</span>
							<ChevronsUpDown className="opacity-50" />
						</Button>
					</PopoverTrigger>
					<PopoverContent
						className="w-(--radix-popover-trigger-width) min-w-64 p-0"
						align="start"
					>
						<Command>
							<CommandInput placeholder={`${resourceLabel}を名前・ID で検索`} />
							<CommandList>
								{loading ? (
									<p className="py-6 text-center text-body text-muted-foreground">
										読み込み中…
									</p>
								) : error ? (
									<p
										role="alert"
										className="px-2 py-6 text-center text-body text-destructive break-words"
									>
										{error}
									</p>
								) : (
									<>
										<CommandEmpty>見つかりません</CommandEmpty>
										<CommandGroup>
											{options.map((option) => (
												<CommandItem
													key={option.value}
													value={option.value}
													keywords={[option.label]}
													onSelect={() => {
														changeValue(option.value);
														setOpen(false);
													}}
												>
													<Check
														className={cn(
															option.value === value
																? "opacity-100"
																: "opacity-0",
														)}
													/>
													<span className="flex min-w-0 flex-col">
														<span className="truncate">{option.label}</span>
														{option.description && (
															<span className="truncate text-caption-1 text-muted-foreground">
																{option.description}
															</span>
														)}
													</span>
												</CommandItem>
											))}
										</CommandGroup>
									</>
								)}
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>
				{value && (
					<Button
						type="button"
						variant="ghost"
						size="icon"
						aria-label={`${resourceLabel}の選択を解除`}
						disabled={disabled}
						onClick={() => changeValue("")}
					>
						<X />
					</Button>
				)}
			</div>
			{selected?.description && (
				<p className="truncate text-caption-1 text-muted-foreground">
					ID: {selected.description}
				</p>
			)}
		</div>
	);
}
