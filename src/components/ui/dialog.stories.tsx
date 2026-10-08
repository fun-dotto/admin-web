import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { expect, screen, userEvent, within } from "storybook/test";
import { Button } from "./button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./dialog";

const meta = {
	title: "UI/Dialog",
	component: Dialog,
	tags: ["autodocs"],
	render: (args) => (
		<Dialog {...args}>
			<DialogTrigger asChild>
				<Button>開く</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>タイトル</DialogTitle>
					<DialogDescription>説明文です。</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">閉じる</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	),
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		await userEvent.click(
			within(canvasElement).getByRole("button", { name: "開く" }),
		);
		await expect(await screen.findByRole("dialog")).toBeInTheDocument();
	},
};

export const Open: Story = { args: { defaultOpen: true } };
