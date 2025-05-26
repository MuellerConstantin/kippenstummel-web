import type { Meta, StoryObj } from "@storybook/react";
import { IdentIcon } from "@/components/atoms/IdentIcon";

const meta: Meta<typeof IdentIcon> = {
  title: "Atoms/IdentIcon",
  component: IdentIcon,
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const Default: StoryObj<typeof IdentIcon> = {
  args: {
    value: "IdentIcon",
    className: "!w-32 !h-32",
  },
};
