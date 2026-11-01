import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { expect, userEvent, within } from "storybook/test";
import { Input } from "./input";

const meta = {
	title: "UI/Input",
	component: Input,
	tags: ["autodocs"],
	args: { "aria-label": "入力", placeholder: "入力してください" },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const input = within(canvasElement).getByRole("textbox");
		await userEvent.type(input, "テキスト");
		await expect(input).toHaveValue("テキスト");
	},
};

export const WithValue: Story = { args: { defaultValue: "入力済み" } };

export const Disabled: Story = { args: { disabled: true } };

export const Invalid: Story = { args: { "aria-invalid": true } };

export const NumberType: Story = { args: { type: "number" } };

export const DateTime: Story = { args: { type: "datetime-local" } };

export const LongText: Story = {
	args: { defaultValue: "とても長い文字列".repeat(20) },
};
