import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { ResourceNavItem } from "./ResourceNavItem";

const meta = {
	title: "Admin/ResourceNavItem",
	component: ResourceNavItem,
	tags: ["autodocs"],
	args: { slug: "announcements", label: "お知らせ" },
	decorators: [(Story) => <div className="w-64">{Story()}</div>],
} satisfies Meta<typeof ResourceNavItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongLabel: Story = {
	args: {
		label: "とても長いリソース名とても長いリソース名とても長いリソース名",
	},
};
