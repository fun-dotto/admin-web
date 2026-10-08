import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { expect, fn, userEvent, within } from "storybook/test";
import { ResourcePagination } from "./ResourcePagination";

const meta = {
	title: "Admin/ResourcePagination",
	component: ResourcePagination,
	tags: ["autodocs"],
	args: {
		page: 2,
		hasPrevious: true,
		hasNext: true,
		onPrevious: fn(),
		onNext: fn(),
	},
} satisfies Meta<typeof ResourcePagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole("button", { name: "次へ" }));
		await expect(args.onNext).toHaveBeenCalled();
		await userEvent.click(canvas.getByRole("button", { name: "前へ" }));
		await expect(args.onPrevious).toHaveBeenCalled();
	},
};

export const FirstPage: Story = { args: { page: 1, hasPrevious: false } };

export const LastPage: Story = { args: { hasNext: false } };

export const SinglePage: Story = {
	args: { page: 1, hasPrevious: false, hasNext: false },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole("button", { name: "前へ" })).toBeDisabled();
		await expect(canvas.getByRole("button", { name: "次へ" })).toBeDisabled();
	},
};
