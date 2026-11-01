import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { expect, fn, screen, userEvent } from "storybook/test";
import { longText, sampleFields } from "./fixtures";
import { ResourceFormDialog } from "./ResourceFormDialog";

const meta = {
	title: "Admin/ResourceFormDialog",
	component: ResourceFormDialog,
	tags: ["autodocs"],
	args: {
		open: true,
		onOpenChange: fn(),
		title: "お知らせを作成",
		fields: sampleFields,
		onSubmit: fn(),
	},
} satisfies Meta<typeof ResourceFormDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ args }) => {
		await userEvent.click(
			await screen.findByRole("button", { name: "キャンセル" }),
		);
		await expect(args.onOpenChange).toHaveBeenCalledWith(false);
	},
};

export const Edit: Story = {
	args: {
		title: "お知らせを編集",
		description: "ID: id-1",
		defaultValues: { title: "お知らせ" },
	},
};

export const Submitting: Story = { args: { submitting: true } };

export const ErrorState: Story = { args: { error: "保存に失敗しました" } };

export const LongText: Story = {
	args: { title: longText, description: longText },
};

export const Closed: Story = { args: { open: false } };
