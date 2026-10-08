import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { AdminShell } from "./AdminShell";

const meta = {
	title: "Admin/AdminShell",
	component: AdminShell,
	parameters: { layout: "fullscreen" },
	tags: ["autodocs"],
	args: {
		nav: <p className="px-2 text-body">ナビゲーション</p>,
		children: <p className="text-body">コンテンツ</p>,
	},
} satisfies Meta<typeof AdminShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

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
