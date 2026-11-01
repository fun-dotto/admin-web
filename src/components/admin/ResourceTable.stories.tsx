import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { expect, within } from "storybook/test";
import { longText } from "./fixtures";
import { ResourceTable } from "./ResourceTable";

const columns = [
	{ key: "id", label: "id" },
	{ key: "title", label: "title" },
	{ key: "createdAt", label: "created_at" },
];

const makeRow = (index: number) => ({
	id: `id-${index}`,
	cells: {
		id: `id-${index}`,
		title: `お知らせ ${index}`,
		createdAt: "2026/10/8 12:00:00",
	},
});

const meta = {
	title: "Admin/ResourceTable",
	component: ResourceTable,
	tags: ["autodocs"],
	args: {
		columns,
		rows: [makeRow(1), makeRow(2), makeRow(3)],
	},
} satisfies Meta<typeof ResourceTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = { args: { loading: true } };

export const ErrorState: Story = {
	args: { error: "サーバーに接続できませんでした" },
};

export const Empty: Story = {
	args: { rows: [] },
	play: async ({ canvasElement }) => {
		await expect(
			within(canvasElement).getByText("データがありません"),
		).toBeInTheDocument();
	},
};

export const SingleRow: Story = { args: { rows: [makeRow(1)] } };

export const ManyRows: Story = {
	args: { rows: Array.from({ length: 50 }, (_, index) => makeRow(index)) },
};

export const LongText: Story = {
	args: {
		rows: [
			{
				id: "long",
				cells: { id: "long", title: longText, createdAt: longText },
			},
		],
	},
};

export const WithDetailLink: Story = {
	args: { resourceSlug: "announcements" },
	play: async ({ canvasElement }) => {
		await expect(
			within(canvasElement).getByRole("link", { name: "id-1" }),
		).toBeInTheDocument();
	},
};
