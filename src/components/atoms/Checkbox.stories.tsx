import { Checkbox } from "./Checkbox";
import type { Meta } from "@storybook/react";

const meta: Meta<typeof Checkbox> = {
  title: "Atoms/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  argTypes: {},
  args: {
    isDisabled: false,
    children: "Checkbox",
  },
};

export default meta;

export const Default = {
  args: {},
};
