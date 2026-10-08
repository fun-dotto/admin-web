import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { expect, screen, userEvent, within } from "storybook/test";
import { Button } from "./button";
import {
	Popover,
	PopoverContent,
	PopoverDescription,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger,
} from "./popover";

const meta = {
	title: "UI/Popover",
	component: Popover,
	tags: ["autodocs"],
	render: (args) => (
		<Popover {...args}>
			<PopoverTrigger asChild>
				<Button variant="outline">開く</Button>
			</PopoverTrigger>
			<PopoverContent>
				<PopoverHeader>
					<PopoverTitle>タイトル</PopoverTitle>
					<PopoverDescription>説明文です。</PopoverDescription>
				</PopoverHeader>
			</PopoverContent>
		</Popover>
	),
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		await userEvent.click(
			within(canvasElement).getByRole("button", { name: "開く" }),
		);
		await expect(await screen.findByText("説明文です。")).toBeInTheDocument();
	},
};

export const Open: Story = { args: { defaultOpen: true } };
