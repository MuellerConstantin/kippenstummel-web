import type { Meta } from "@storybook/react";
import React from "react";
import { Map } from "./Map";
import { tileLayer } from "leaflet";

const meta: Meta<typeof Map> = {
  title: "Organisms/Map",
};

export default meta;

export const Default = (args: any) => (
  <div className="aspect-video w-1/2">
    <Map {...args} />
  </div>
);

Default.args = {
  tileLayerUrl: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  tileLayerAttribution:
    '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
};
