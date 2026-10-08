import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { expect, fn, userEvent, within } from "storybook/test";
import { AdminShell } from "./AdminShell";

const meta = {
	title: "Admin/AdminShell",
	component: AdminShell,
	parameters: { layout: "fullscreen" },
	tags: ["autodocs"],
	args: {
		nav: <p className="px-2 text-body">ナビゲーション</p>,
		children: <p className="text-body">コンテンツ</p>,
		onCollapsedChange: fn(),
	},
} satisfies Meta<typeof AdminShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Collapsed: Story = { args: { defaultCollapsed: true } };

export const ToggleCollapse: Story = {
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(
			canvas.getByRole("button", { name: "サイドバーを折りたたむ" }),
		);
		await expect(args.onCollapsedChange).toHaveBeenCalledWith(true);
		await expect(canvas.queryByText("ナビゲーション")).not.toBeVisible();
		await userEvent.click(
			canvas.getByRole("button", { name: "サイドバーを開く" }),
		);
		await expect(args.onCollapsedChange).toHaveBeenLastCalledWith(false);
		await expect(canvas.getByText("ナビゲーション")).toBeVisible();
	},
};

export const WithSidebarHeader: Story = {
	args: {
		sidebarHeader: <p className="text-caption-1">サイドバーヘッダー</p>,
	},
};

export const Production: Story = { args: { environment: "production" } };

export const Staging: Story = { args: { environment: "staging" } };

export const Development: Story = { args: { environment: "development" } };

export const CollapsedProduction: Story = {
	args: { environment: "production", defaultCollapsed: true },
};

export const EmptyNav: Story = { args: { nav: null } };

export const LongContent: Story = {
	args: {
		children: (
			<div className="flex flex-col gap-4">
				{Array.from({ length: 40 }, (_, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: 静的なダミー
					<p key={index} className="text-body">
						行 {index + 1}
					</p>
				))}
			</div>
		),
	},
};
