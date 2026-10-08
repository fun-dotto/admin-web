import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { expect, fn, userEvent, within } from "storybook/test";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from "./command";

type CommandStoryArgs = { items: string[]; onSelect?: (value: string) => void };

const meta = {
	title: "UI/Command",
	args: { items: ["りんご", "みかん", "ぶどう"], onSelect: fn() },
	render: ({ items, onSelect }: CommandStoryArgs) => (
		<Command className="w-72 rounded-lg border">
			<CommandInput placeholder="検索" />
			<CommandList>
				<CommandEmpty>見つかりません</CommandEmpty>
				<CommandGroup heading="果物">
					{items.map((item) => (
						<CommandItem key={item} value={item} onSelect={onSelect}>
							{item}
						</CommandItem>
					))}
				</CommandGroup>
				<CommandSeparator />
				<CommandGroup heading="その他">
					<CommandItem>
						設定<CommandShortcut>⌘S</CommandShortcut>
					</CommandItem>
				</CommandGroup>
			</CommandList>
		</Command>
	),
} satisfies Meta<CommandStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.type(canvas.getByPlaceholderText("検索"), "みか");
		await expect(
			canvas.queryByRole("option", { name: "りんご" }),
		).not.toBeInTheDocument();
		await userEvent.click(canvas.getByRole("option", { name: "みかん" }));
		await expect(args.onSelect).toHaveBeenCalledWith("みかん");
	},
};

export const Empty: Story = { args: { items: [] } };

export const ManyItems: Story = {
	args: {
		items: Array.from({ length: 100 }, (_, index) => `項目 ${index + 1}`),
	},
};

export const LongText: Story = {
	args: { items: ["とても長い項目名".repeat(8)] },
};
