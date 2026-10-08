import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { expect, fn, userEvent, within } from "storybook/test";
import { Button } from "#/components/ui/button";
import { longText } from "./fixtures";
import { ResourcePageHeader } from "./ResourcePageHeader";

const meta = {
	title: "Admin/ResourcePageHeader",
	component: ResourcePageHeader,
	tags: ["autodocs"],
	args: {
		title: "お知らせ",
		description: "admin.v1.AnnouncementService",
		onCreate: fn(),
	},
} satisfies Meta<typeof ResourcePageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ args, canvasElement }) => {
		await userEvent.click(
			within(canvasElement).getByRole("button", { name: "新規作成" }),
		);
		await expect(args.onCreate).toHaveBeenCalled();
	},
};

export const WithActions: Story = {
	args: {
		onCreate: undefined,
		actions: <Button variant="outline">編集</Button>,
	},
};

export const WithoutCreate: Story = { args: { onCreate: undefined } };

export const WithoutDescription: Story = { args: { description: undefined } };

export const LongText: Story = {
	args: { title: longText, description: longText },
};
