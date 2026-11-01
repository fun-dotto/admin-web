import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { longText } from "./fixtures";
import { ResourceCard } from "./ResourceCard";

const meta = {
	title: "Admin/ResourceCard",
	component: ResourceCard,
	tags: ["autodocs"],
	args: { slug: "announcements", label: "お知らせ" },
	decorators: [(Story) => <div className="w-80">{Story()}</div>],
} satisfies Meta<typeof ResourceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescription: Story = {
	args: { description: "admin.v1.AnnouncementService" },
};

export const LongText: Story = {
	args: { label: longText, description: longText },
};
