import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Input } from "./input";
import { Label } from "./label";

const meta = {
	title: "UI/Label",
	component: Label,
	tags: ["autodocs"],
	args: { children: "ラベル" },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithInput: Story = {
	render: (args) => (
		<div className="flex flex-col gap-2">
			<Label {...args} htmlFor="label-input" />
			<Input id="label-input" />
		</div>
	),
};

export const LongText: Story = {
	args: { children: "とても長いラベル".repeat(10) },
};
