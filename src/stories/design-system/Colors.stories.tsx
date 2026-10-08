import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { cn } from "#/lib/utils";

type ColorToken = { name: string; className: string; hex: string };

const colorTokens: ColorToken[] = [
	{ name: "Label/Primary", className: "bg-label-primary", hex: "#252325" },
	{ name: "Label/Secondary", className: "bg-label-secondary", hex: "#6D676D" },
	{ name: "Label/Tertiary", className: "bg-label-tertiary", hex: "#FFFFFF" },
	{
		name: "Background/Primary",
		className: "bg-background-primary",
		hex: "#F5F1F1",
	},
	{
		name: "Background/Secondary",
		className: "bg-background-secondary",
		hex: "#FFFFFF",
	},
	{ name: "Border/Primary", className: "bg-border-primary", hex: "#BCBCBC" },
	{
		name: "Border/Secondary",
		className: "bg-border-secondary",
		hex: "#333131",
	},
	{ name: "Accent/Brand", className: "bg-accent-brand", hex: "#990000" },
	{ name: "Accent/Warning", className: "bg-accent-warning", hex: "#FF9500" },
	{ name: "Accent/Error", className: "bg-accent-error", hex: "#F51F1F" },
];

export type ColorPaletteProps = { tokens: ColorToken[] };

function ColorPalette({ tokens }: ColorPaletteProps) {
	return (
		<ul className="grid grid-cols-2 gap-4 font-noto-sans-jp sm:grid-cols-3 lg:grid-cols-5">
			{tokens.map((token) => (
				<li key={token.name} className="flex flex-col gap-2">
					<div
						className={cn(
							"h-16 rounded-md border border-border-primary",
							token.className,
						)}
					/>
					<span className="text-subtitle-2 text-label-primary">
						{token.name}
					</span>
					<code className="text-caption-1 text-label-secondary">
						{token.className}
					</code>
					<span className="text-caption-1 text-label-secondary">
						{token.hex}
					</span>
				</li>
			))}
		</ul>
	);
}

const meta = {
	title: "Design System/Colors",
	component: ColorPalette,
	args: { tokens: colorTokens },
} satisfies Meta<typeof ColorPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
