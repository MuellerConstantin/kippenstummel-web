import type { Meta, StoryFn } from "@storybook/react";
import React from "react";
import { Spinner } from "@/components/atoms/Spinner";

const meta: Meta<typeof Spinner> = {
  title: "Atoms/Spinner",
  component: Spinner,
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const Default: StoryFn<typeof Spinner> = () => <Spinner />;

Default.args = {};

export const Small: StoryFn<typeof Spinner> = () => <Spinner size={12} />;

Small.args = {};

export const Large: StoryFn<typeof Spinner> = () => <Spinner size={36} />;

Large.args = {};
