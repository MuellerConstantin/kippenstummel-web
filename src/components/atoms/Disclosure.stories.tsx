import type { Meta, StoryFn } from "@storybook/react";
import React from "react";
import {
  Disclosure,
  DisclosureHeader,
  DisclosurePanel,
} from "@/components/atoms/Disclosure";

const meta: Meta<typeof Disclosure> = {
  title: "Atoms/Disclosure",
  component: Disclosure,
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const Default: StoryFn<typeof Disclosure> = (args) => (
  <Disclosure {...args}>
    <DisclosureHeader>Files</DisclosureHeader>
    <DisclosurePanel>Files content</DisclosurePanel>
  </Disclosure>
);
