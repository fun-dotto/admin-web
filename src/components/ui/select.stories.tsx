import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { expect, fn, screen, userEvent, within } from "storybook/test";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./select";

type SelectStoryArgs = React.ComponentProps<typeof Select> & {
	size?: "sm" | "default";
	options?: string[];
};

const meta = {
	title: "UI/Select",
	component: Select,
	tags: ["autodocs"],
	args: { onValueChange: fn(), options: ["りんご", "みかん", "ぶどう"] },
	render: ({ size, options = [], ...args }: SelectStoryArgs) => (
		<Select {...args}>
			<SelectTrigger size={size} aria-label="果物" className="w-48">
				<SelectValue placeholder="選択してください" />
			</SelectTrigger>
			<SelectContent>
				{options.map((option) => (
					<SelectItem key={option} value={option}>
						{option}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	),
} satisfies Meta<SelectStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ args, canvasElement }) => {
		await userEvent.click(within(canvasElement).getByRole("combobox"));
		await userEvent.click(
			await screen.findByRole("option", { name: "みかん" }),
		);
		await expect(args.onValueChange).toHaveBeenCalledWith("みかん");
	},
};

export const Selected: Story = { args: { defaultValue: "ぶどう" } };

export const Small: Story = { args: { size: "sm" } };

export const Disabled: Story = { args: { disabled: true } };

export const Empty: Story = { args: { options: [] } };

export const ManyOptions: Story = {
	args: {
		options: Array.from({ length: 50 }, (_, index) => `選択肢 ${index + 1}`),
	},
};

export const LongOption: Story = {
	args: {
		defaultValue: "とても長い選択肢".repeat(5),
		options: ["とても長い選択肢".repeat(5)],
	},
};
