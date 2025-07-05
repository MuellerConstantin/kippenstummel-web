import React from "react";
import { Form } from "react-aria-components";
import { Button } from "./Button";
import { Radio, RadioGroup } from "./RadioGroup";
import { Meta, StoryFn } from "@storybook/react";

const meta: Meta<typeof RadioGroup> = {
  title: "Atoms/RadioGroup",
  component: RadioGroup,
  parameters: {
    layout: "centered",
  },
  argTypes: {},
  args: {
    label: "Favorite sport",
    isDisabled: false,
    isRequired: false,
    description: "",
    orientation: "vertical",
    children: (
      <>
        <Radio value="soccer">Soccer</Radio>
        <Radio value="baseball">Baseball</Radio>
        <Radio value="basketball">Basketball</Radio>
      </>
    ),
  },
};

export default meta;

export const Default = {
  args: {},
};

export const Validation: StoryFn<typeof RadioGroup> = (args) => (
  <Form className="flex flex-col items-start gap-2">
    <RadioGroup {...args} />
    <Button type="submit" variant="secondary">
      Submit
    </Button>
  </Form>
);

Validation.args = {
  isRequired: true,
};
