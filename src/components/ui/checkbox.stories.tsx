import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { expect, fn, userEvent, within } from "storybook/test";
import { Checkbox } from "./checkbox";

const meta = {
	title: "UI/Checkbox",
	component: Checkbox,
	tags: ["autodocs"],
	args: { "aria-label": "チェック", onCheckedChange: fn() },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ args, canvasElement }) => {
		await userEvent.click(within(canvasElement).getByRole("checkbox"));
		await expect(args.onCheckedChange).toHaveBeenCalledWith(true);
	},
};

export const Checked: Story = { args: { defaultChecked: true } };

export const Disabled: Story = { args: { disabled: true } };

export const DisabledChecked: Story = {
	args: { disabled: true, defaultChecked: true },
};
