import type { Meta } from "@storybook/react";
import React from "react";
import { Form } from "react-aria-components";
import { Button } from "@/components/atoms/Button";
import { TextField } from "@/components/atoms/TextField";

const meta: Meta<typeof TextField> = {
  title: "Atoms/TextField",
  component: TextField,
  parameters: {
    layout: "centered",
  },
  args: {
    label: "Name",
  },
};

export default meta;

export const Default = (args: any) => <TextField {...args} />;

export const WithDescription = (args: any) => <TextField {...args} />;

WithDescription.args = {
  description: "Lorem ipsum dolor sit amet",
};

export const Errored = (args: any) => <TextField {...args} />;

Errored.args = {
  isInvalid: true,
  errorMessage: "Error message",
};

export const Validation = (args: any) => (
  <Form className="flex flex-col items-start gap-2">
    <TextField {...args} />
    <Button type="submit" variant="secondary">
      Submit
    </Button>
  </Form>
);

Validation.args = {
  isRequired: true,
};
