import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { sampleFields } from "./fixtures";
import { ResourceFormField } from "./ResourceFormField";

const field = (name: string) => {
	const spec = sampleFields.find((candidate) => candidate.name === name);
	if (!spec) throw new Error(name);
	return spec;
};

const meta = {
	title: "Admin/ResourceFormField",
	component: ResourceFormField,
	tags: ["autodocs"],
	args: { spec: field("title") },
	decorators: [(Story) => <div className="w-80">{Story()}</div>],
} satisfies Meta<typeof ResourceFormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StringField: Story = {};

export const StringFieldWithValue: Story = {
	args: { defaultValue: "お知らせのタイトル" },
};

export const NumberField: Story = {
	args: { spec: field("priority"), defaultValue: "1" },
};

export const EnumField: Story = {
	args: { spec: field("grade"), defaultValue: "GRADE_B1" },
};

export const TimestampField: Story = {
	args: { spec: field("availableFrom"), defaultValue: "2026-10-08T12:00" },
};

export const DateField: Story = {
	args: { spec: field("date"), defaultValue: "2026-10-08" },
};

export const BooleanField: Story = {
	args: { spec: field("isPublished"), defaultValue: true },
};

export const JsonField: Story = {
	args: { spec: field("metadata"), defaultValue: '{\n  "key": "value"\n}' },
};

export const Disabled: Story = {
	args: { defaultValue: "編集不可", disabled: true },
};

export const LongLabel: Story = {
	args: {
		spec: {
			...field("title"),
			label: "とても長いラベルとても長いラベルとても長いラベル",
		},
	},
};
