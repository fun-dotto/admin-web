import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { expect, fn, screen, userEvent, within } from "storybook/test";
import { longText } from "./fixtures";
import { ResourceReferenceField } from "./ResourceReferenceField";

const options = [
	{ value: "subject-1", label: "情報処理演習", description: "subject-1" },
	{ value: "subject-2", label: "線形代数学", description: "subject-2" },
	{ value: "subject-3", label: "データベース工学", description: "subject-3" },
];

const meta = {
	title: "Admin/ResourceReferenceField",
	component: ResourceReferenceField,
	tags: ["autodocs"],
	args: {
		id: "subject",
		name: "subjectId",
		resourceLabel: "科目",
		options,
		onValueChange: fn(),
	},
	decorators: [(Story) => <div className="w-80">{Story()}</div>],
} satisfies Meta<typeof ResourceReferenceField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ args, canvasElement }) => {
		await userEvent.click(within(canvasElement).getByRole("combobox"));
		await userEvent.type(
			await screen.findByPlaceholderText("科目を名前・ID で検索"),
			"線形",
		);
		await expect(
			screen.queryByRole("option", { name: /情報処理演習/ }),
		).not.toBeInTheDocument();
		await userEvent.click(screen.getByRole("option", { name: /線形代数学/ }));
		await expect(args.onValueChange).toHaveBeenCalledWith("subject-2");
		await expect(within(canvasElement).getByRole("combobox")).toHaveTextContent(
			"線形代数学",
		);
	},
};

export const Selected: Story = { args: { defaultValue: "subject-1" } };

export const Clear: Story = {
	args: { defaultValue: "subject-1" },
	play: async ({ args, canvasElement }) => {
		await userEvent.click(
			within(canvasElement).getByRole("button", { name: "科目の選択を解除" }),
		);
		await expect(args.onValueChange).toHaveBeenCalledWith("");
	},
};

/** 選択肢の読み込み前でも、既存の ID は表示する */
export const UnknownValue: Story = {
	args: { options: [], loading: true, defaultValue: "subject-9" },
};

export const Loading: Story = { args: { options: [], loading: true } };

export const ErrorState: Story = {
	args: { options: [], error: "科目の取得に失敗しました" },
};

export const Empty: Story = { args: { options: [] } };

export const SingleOption: Story = { args: { options: options.slice(0, 1) } };

export const ManyOptions: Story = {
	args: {
		options: Array.from({ length: 200 }, (_, index) => ({
			value: `subject-${index}`,
			label: `科目 ${index}`,
			description: `subject-${index}`,
		})),
	},
};

export const LongText: Story = {
	args: {
		options: [{ value: "long", label: longText, description: longText }],
		defaultValue: "long",
	},
};

export const Disabled: Story = {
	args: { defaultValue: "subject-1", disabled: true },
};
