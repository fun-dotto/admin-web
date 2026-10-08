import type { Meta, StoryObj } from "@storybook/tanstack-react";

type TextStyle = { name: string; className: string; spec: string };

const textStyles: TextStyle[] = [
	{
		name: "Large Title",
		className: "text-large-title",
		spec: "22px / Regular",
	},
	{ name: "Title", className: "text-title", spec: "20px / Medium" },
	{ name: "Subtitle 1", className: "text-subtitle-1", spec: "16px / Medium" },
	{ name: "Subtitle 2", className: "text-subtitle-2", spec: "14px / Medium" },
	{ name: "Body", className: "text-body", spec: "14px / Regular" },
	{ name: "Caption 1", className: "text-caption-1", spec: "12px / Regular" },
	{ name: "Caption 2", className: "text-caption-2", spec: "10px / Regular" },
];

export type TypographyProps = { text: string; styles: TextStyle[] };

function Typography({ text, styles }: TypographyProps) {
	return (
		<ul className="flex flex-col gap-6 font-noto-sans-jp text-label-primary">
			{styles.map((style) => (
				<li
					key={style.name}
					className="flex flex-col gap-1 border-b border-border-primary pb-4"
				>
					<span className="text-caption-1 text-label-secondary">
						{style.name} · <code>{style.className}</code> · {style.spec}
					</span>
					<p className={style.className}>{text}</p>
				</li>
			))}
		</ul>
	);
}

const meta = {
	title: "Design System/Typography",
	component: Typography,
	args: {
		text: "dotto 管理画面 The quick brown fox 0123456789",
		styles: textStyles,
	},
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongText: Story = {
	args: {
		text: "長い文字列の折り返し確認用テキストです。".repeat(8),
	},
};
