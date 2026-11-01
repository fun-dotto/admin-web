import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "./table";

type TableStoryArgs = { rowCount: number };

const meta = {
	title: "UI/Table",
	tags: ["autodocs"],
	args: { rowCount: 3 },
	render: ({ rowCount }: TableStoryArgs) => (
		<Table>
			<TableCaption>キャプション</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>名前</TableHead>
					<TableHead>値</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{Array.from(
					{ length: rowCount },
					(_, index) => `項目 ${index + 1}`,
				).map((name, index) => (
					<TableRow key={name}>
						<TableCell>{name}</TableCell>
						<TableCell>{index * 100}</TableCell>
					</TableRow>
				))}
			</TableBody>
			<TableFooter>
				<TableRow>
					<TableCell>合計</TableCell>
					<TableCell>{rowCount}</TableCell>
				</TableRow>
			</TableFooter>
		</Table>
	),
} satisfies Meta<TableStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = { args: { rowCount: 0 } };

export const SingleRow: Story = { args: { rowCount: 1 } };

export const ManyRows: Story = { args: { rowCount: 50 } };
