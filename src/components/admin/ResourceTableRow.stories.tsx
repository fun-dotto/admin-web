import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { fn } from "storybook/test";
import { Table, TableBody } from "#/components/ui/table";
import { longText } from "./fixtures";
import { ResourceTableRow } from "./ResourceTableRow";

const meta = {
	title: "Admin/ResourceTableRow",
	component: ResourceTableRow,
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<Table>
				<TableBody>{Story()}</TableBody>
			</Table>
		),
	],
	args: {
		columns: [
			{ key: "id", label: "id" },
			{ key: "title", label: "title" },
		],
		row: { id: "id-1", cells: { id: "id-1", title: "お知らせ" } },
		onEdit: fn(),
		onDelete: fn(),
	},
} satisfies Meta<typeof ResourceTableRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EditOnly: Story = { args: { onDelete: undefined } };

export const WithDetailLink: Story = {
	args: { resourceSlug: "announcements" },
};

export const ReadOnly: Story = {
	args: { onEdit: undefined, onDelete: undefined },
};

export const LongText: Story = {
	args: { row: { id: "id-1", cells: { id: "id-1", title: longText } } },
};
