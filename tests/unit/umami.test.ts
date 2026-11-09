import { describe, expect, it } from "vitest";

import { filterUmamiPayload } from "@/lib/client/umami";

const payload = {
  website: "website-id",
  hostname: "www.kippenstummel.de",
  url: "https://www.kippenstummel.de/de/map",
  title: "Karte",
  referrer: "https://example.org/",
  screen: "1920x1080",
  language: "de-DE",
};

describe("filterUmamiPayload", () => {
  it("drops fields read on the device without consent", () => {
    expect(filterUmamiPayload(payload, false)).toEqual({
      website: "website-id",
      hostname: "www.kippenstummel.de",
      url: "https://www.kippenstummel.de/de/map",
      title: "Karte",
    });
  });

  it("keeps every field with consent", () => {
    expect(filterUmamiPayload(payload, true)).toEqual(payload);
  });
});
