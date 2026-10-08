import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { expect, userEvent, within } from "storybook/test";
import { Textarea } from "./textarea";

const meta = {
	title: "UI/Textarea",
	component: Textarea,
	tags: ["autodocs"],
	args: { "aria-label": "入力", placeholder: "入力してください" },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const textarea = within(canvasElement).getByRole("textbox");
		await userEvent.type(textarea, "テキスト");
		await expect(textarea).toHaveValue("テキスト");
	},
};

export const Disabled: Story = { args: { disabled: true } };

export const Invalid: Story = { args: { "aria-invalid": true } };

export const LongText: Story = {
	args: { defaultValue: "とても長い文字列".repeat(50) },
};
