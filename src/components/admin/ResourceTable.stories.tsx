import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { expect, fn, userEvent, within } from "storybook/test";
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
		onEdit: fn(),
		onDelete: fn(),
	},
} satisfies Meta<typeof ResourceTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole("button", { name: "id-1 を編集" }));
		await expect(args.onEdit).toHaveBeenCalledWith("id-1");
		await userEvent.click(canvas.getByRole("button", { name: "id-2 を削除" }));
		await expect(args.onDelete).toHaveBeenCalledWith("id-2");
	},
};

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

export const ReadOnly: Story = {
	args: { onEdit: undefined, onDelete: undefined },
};
