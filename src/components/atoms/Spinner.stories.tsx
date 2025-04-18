import type { Meta } from "@storybook/react";
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

export const Default = (args: any) => <Spinner />;

Default.args = {};

export const Small = (args: any) => <Spinner size={12} />;

Small.args = {};

export const Large = (args: any) => <Spinner size={36} />;

Large.args = {};
