import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { longText } from "./fixtures";
import { ResourceDetail } from "./ResourceDetail";

const meta = {
	title: "Admin/ResourceDetail",
	component: ResourceDetail,
	tags: ["autodocs"],
	args: {
		items: [
			{ key: "id", label: "id", value: "id-1" },
			{ key: "title", label: "title", value: "お知らせ" },
			{ key: "url", label: "url", value: "" },
			{ key: "createdAt", label: "created_at", value: "2026/10/8 12:00:00" },
		],
	},
} satisfies Meta<typeof ResourceDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = { args: { loading: true } };

export const ErrorState: Story = { args: { error: "取得に失敗しました" } };

export const Empty: Story = { args: { items: [] } };

export const SingleItem: Story = {
	args: { items: [{ key: "id", label: "id", value: "id-1" }] },
};

export const ManyItems: Story = {
	args: {
		items: Array.from({ length: 30 }, (_, index) => ({
			key: `field${index}`,
			label: `field_${index}`,
			value: `値 ${index}`,
		})),
	},
};

export const LongText: Story = {
	args: {
		items: [
			{
				key: "long",
				label: "very_long_field_name_very_long_field_name",
				value: longText,
			},
			{
				key: "json",
				label: "metadata",
				value: JSON.stringify({ key: longText }, null, 2),
			},
		],
	},
};
