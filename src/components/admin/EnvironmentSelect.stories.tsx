import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { expect, fn, screen, userEvent, waitFor, within } from "storybook/test";
import { EnvironmentSelect } from "./EnvironmentSelect";

const options = [
	{ id: "production", label: "Production" },
	{ id: "staging", label: "Staging" },
	{ id: "development", label: "Development" },
];

const meta = {
	title: "Admin/EnvironmentSelect",
	component: EnvironmentSelect,
	tags: ["autodocs"],
	args: {
		options,
		defaultValue: "development",
		onValueChange: fn(),
	},
	decorators: [
		(Story) => (
			<div className="w-60">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof EnvironmentSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Production: Story = { args: { defaultValue: "production" } };

export const Unselected: Story = { args: { defaultValue: undefined } };

export const Loading: Story = { args: { loading: true } };

export const Disabled: Story = { args: { disabled: true } };

export const Empty: Story = { args: { options: [], defaultValue: undefined } };

export const SingleOption: Story = {
	args: { options: [options[2]], defaultValue: "development" },
};

export const LongLabel: Story = {
	args: {
		options: [
			...options,
			{ id: "long", label: "とても長い名前の検証用ステージング環境（共有）" },
		],
		defaultValue: "long",
	},
};

export const SelectEnvironment: Story = {
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole("combobox", { name: "接続先環境" }));
		await userEvent.click(
			await screen.findByRole("option", { name: "Staging" }),
		);
		await expect(args.onValueChange).toHaveBeenCalledWith("staging");
		await waitFor(() =>
			expect(canvas.getByRole("combobox")).toHaveTextContent("Staging"),
		);
	},
};
