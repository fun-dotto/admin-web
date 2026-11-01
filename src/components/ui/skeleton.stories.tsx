import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Skeleton } from "./skeleton";

const meta = {
	title: "UI/Skeleton",
	component: Skeleton,
	tags: ["autodocs"],
	args: { className: "h-5 w-64" },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Circle: Story = { args: { className: "size-12 rounded-full" } };
