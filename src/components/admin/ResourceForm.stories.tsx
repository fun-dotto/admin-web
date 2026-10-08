import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { expect, fn, screen, userEvent, within } from "storybook/test";
import { sampleFields, sampleReferences } from "./fixtures";
import { ResourceForm } from "./ResourceForm";

const meta = {
	title: "Admin/ResourceForm",
	component: ResourceForm,
	tags: ["autodocs"],
	args: {
		fields: sampleFields,
		references: sampleReferences,
		onSubmit: fn(),
		onCancel: fn(),
	},
	decorators: [(Story) => <div className="max-w-lg">{Story()}</div>],
} satisfies Meta<typeof ResourceForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValues: Story = {
	args: {
		defaultValues: {
			title: "お知らせ",
			url: "https://example.com",
			priority: "1",
			grade: "GRADE_B2",
			availableFrom: "2026-10-08T12:00",
			date: "2026-10-08",
			subjectId: "subject-2",
			isPublished: true,
			metadata: "{}",
		},
	},
};

export const Submit: Story = {
	args: {
		fields: sampleFields.filter(
			(field) => field.kind === "string" || field.kind === "boolean",
		),
	},
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.type(canvas.getByLabelText(/^title/), "タイトル");
		await userEvent.type(canvas.getByLabelText(/^url/), "https://example.com");
		await userEvent.click(canvas.getByRole("checkbox"));
		await userEvent.click(canvas.getByRole("button", { name: "保存" }));
		await expect(args.onSubmit).toHaveBeenCalledWith({
			title: "タイトル",
			url: "https://example.com",
			isPublished: true,
		});
	},
};

export const SelectReference: Story = {
	args: {
		fields: sampleFields.filter((field) => field.kind === "reference"),
	},
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole("combobox"));
		await userEvent.click(
			await screen.findByRole("option", { name: /線形代数学/ }),
		);
		await userEvent.click(canvas.getByRole("button", { name: "保存" }));
		await expect(args.onSubmit).toHaveBeenCalledWith({
			subjectId: "subject-2",
		});
	},
};

export const ReferenceLoading: Story = {
	args: { references: { subjectId: { options: [], loading: true } } },
};

export const Cancel: Story = {
	play: async ({ args, canvasElement }) => {
		await userEvent.click(
			within(canvasElement).getByRole("button", { name: "キャンセル" }),
		);
		await expect(args.onCancel).toHaveBeenCalled();
	},
};

export const Submitting: Story = { args: { submitting: true } };

export const ErrorState: Story = { args: { error: "title は必須です" } };

export const NoFields: Story = { args: { fields: [] } };

export const WithoutCancel: Story = { args: { onCancel: undefined } };
