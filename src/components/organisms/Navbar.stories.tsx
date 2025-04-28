import type { Meta, StoryFn } from "@storybook/react";
import React from "react";
import { StoreProvider } from "@/store";
import { Navbar } from "./Navbar";

const meta: Meta<typeof Navbar> = {
  title: "Organisms/Navbar",
  component: Navbar,
  decorators: [(story) => <StoreProvider>{story()}</StoreProvider>],
};

export default meta;

export const Default: StoryFn<typeof Navbar> = () => <Navbar />;

Default.args = {};
