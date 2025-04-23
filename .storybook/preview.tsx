import React from "react";
import type { Preview } from "@storybook/react";
import { withThemeByClassName } from "@storybook/addon-themes";
import { NextIntlClientProvider } from "next-intl";
import defaultMessages from "../messages/en.json";

import "@/app/[locale]/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: "",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
    (Story) => (
      <NextIntlClientProvider locale="en" messages={defaultMessages}>
        <Story />
      </NextIntlClientProvider>
    ),
  ],
};

export default preview;
