import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { expect, fn, screen, userEvent } from "storybook/test";
import { DeleteResourceDialog } from "./DeleteResourceDialog";
import { longText } from "./fixtures";

const meta = {
	title: "Admin/DeleteResourceDialog",
	component: DeleteResourceDialog,
	tags: ["autodocs"],
	args: { open: true, onOpenChange: fn(), target: "id-1", onConfirm: fn() },
} satisfies Meta<typeof DeleteResourceDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ args }) => {
		await userEvent.click(await screen.findByRole("button", { name: "削除" }));
		await expect(args.onConfirm).toHaveBeenCalled();
	},
};

export const Deleting: Story = { args: { deleting: true } };

export const ErrorState: Story = { args: { error: "削除に失敗しました" } };

export const LongTarget: Story = { args: { target: longText } };

export const Closed: Story = { args: { open: false } };
