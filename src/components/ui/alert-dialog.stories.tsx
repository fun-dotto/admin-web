import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { expect, screen, userEvent, within } from "storybook/test";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "./alert-dialog";
import { Button } from "./button";

type AlertDialogStoryArgs = React.ComponentProps<typeof AlertDialog> & {
	size?: "default" | "sm";
};

const meta = {
	title: "UI/AlertDialog",
	component: AlertDialog,
	tags: ["autodocs"],
	render: ({ size, ...args }: AlertDialogStoryArgs) => (
		<AlertDialog {...args}>
			<AlertDialogTrigger asChild>
				<Button variant="destructive">削除</Button>
			</AlertDialogTrigger>
			<AlertDialogContent size={size}>
				<AlertDialogHeader>
					<AlertDialogTitle>削除しますか？</AlertDialogTitle>
					<AlertDialogDescription>
						この操作は取り消せません。
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>キャンセル</AlertDialogCancel>
					<AlertDialogAction>削除する</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	),
} satisfies Meta<AlertDialogStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		await userEvent.click(
			within(canvasElement).getByRole("button", { name: "削除" }),
		);
		await expect(await screen.findByRole("alertdialog")).toBeInTheDocument();
	},
};

export const Open: Story = { args: { defaultOpen: true } };

export const Small: Story = { args: { defaultOpen: true, size: "sm" } };
