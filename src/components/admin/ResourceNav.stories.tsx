import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { expect, within } from "storybook/test";
import { ResourceNav } from "./ResourceNav";

const meta = {
	title: "Admin/ResourceNav",
	component: ResourceNav,
	tags: ["autodocs"],
	args: {
		groups: [
			{
				label: "お知らせ・通知",
				items: [
					{ slug: "announcements", label: "お知らせ" },
					{ slug: "notifications", label: "通知" },
				],
			},
			{ label: "ユーザー", items: [{ slug: "users", label: "ユーザー" }] },
		],
	},
} satisfies Meta<typeof ResourceNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getAllByRole("link")).toHaveLength(3);
	},
};

export const Empty: Story = { args: { groups: [] } };

export const SingleItem: Story = {
	args: {
		groups: [
			{ label: "ユーザー", items: [{ slug: "users", label: "ユーザー" }] },
		],
	},
};

export const ManyItems: Story = {
	args: {
		groups: [
			{
				label: "多数",
				items: Array.from({ length: 30 }, (_, index) => ({
					slug: `item-${index}`,
					label: `リソース ${index + 1}`,
				})),
			},
		],
	},
};

export const LongLabel: Story = {
	args: {
		groups: [
			{
				label: "とても長いグループ名とても長いグループ名",
				items: [
					{
						slug: "long",
						label:
							"とても長いリソース名とても長いリソース名とても長いリソース名",
					},
				],
			},
		],
	},
	decorators: [(Story) => <div className="w-64">{Story()}</div>],
};
