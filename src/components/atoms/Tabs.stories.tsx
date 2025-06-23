import type { Meta, StoryFn } from "@storybook/react";
import React from "react";
import { Tab, TabList, TabPanel, Tabs } from "./Tabs";

const meta: Meta<typeof Tabs> = {
  title: "Atoms/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const Default: StoryFn<typeof Tabs> = (args) => (
  <Tabs {...args}>
    <TabList aria-label="History of Ancient Rome">
      <Tab id="s1">Section 1</Tab>
      <Tab id="s2">Section 2</Tab>
      <Tab id="s3">Section 3</Tab>
    </TabList>
    <TabPanel id="s1">Section 1</TabPanel>
    <TabPanel id="s2">Section 2</TabPanel>
    <TabPanel id="s3">Section 3</TabPanel>
  </Tabs>
);
