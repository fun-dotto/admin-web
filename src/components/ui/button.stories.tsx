import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Plus } from "lucide-react";
import { expect, fn, userEvent, within } from "storybook/test";

import { Button } from "./button";

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
    },
    size: {
      control: "select",
      options: ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"],
    },
  },
  args: { children: "Button", onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Destructive: Story = { args: { variant: "destructive" } };

export const Outline: Story = { args: { variant: "outline" } };

export const Secondary: Story = { args: { variant: "secondary" } };

export const Ghost: Story = { args: { variant: "ghost" } };

export const Link: Story = { args: { variant: "link" } };

export const ExtraSmall: Story = { args: { size: "xs" } };

export const Small: Story = { args: { size: "sm" } };

export const Large: Story = { args: { size: "lg" } };

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Plus />
        追加
      </>
    ),
  },
};

export const Icon: Story = {
  args: { size: "icon", "aria-label": "追加", children: <Plus /> },
};

export const IconExtraSmall: Story = {
  args: { size: "icon-xs", "aria-label": "追加", children: <Plus /> },
};

export const IconSmall: Story = {
  args: { size: "icon-sm", "aria-label": "追加", children: <Plus /> },
};

export const IconLarge: Story = {
  args: { size: "icon-lg", "aria-label": "追加", children: <Plus /> },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole("button");
    await expect(button).toBeDisabled();
    await userEvent.click(button, { pointerEventsCheck: 0 });
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const LongLabel: Story = {
  args: {
    children: "とても長いラベルのボタンでテキストが折り返されないことを確認する",
  },
};

export const AsChild: Story = {
  args: { asChild: true, children: <a href="#">リンクとして描画</a> },
};

export const Clickable: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button"));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};
