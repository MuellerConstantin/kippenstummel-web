import { describe, expect, it } from "vitest";

import { REGIONS } from "@/lib/shared/regions";

describe("Regions", () => {
  /**
   * The region route resolves by slug alone, so a duplicate silently hides
   * every entry after the first: the city keeps its sitemap URL but can never
   * be reached. Names collide both across countries and within Germany, so
   * neither the country field nor a new data source rules it out.
   */
  it("gives every region a unique slug", () => {
    const byslug = REGIONS.reduce<Record<string, string[]>>((acc, region) => {
      (acc[region.slug] ??= []).push(`${region.country}:${region.name}`);
      return acc;
    }, {});

    const duplicates = Object.entries(byslug).filter(
      ([, regions]) => regions.length > 1,
    );

    expect(duplicates).toEqual([]);
  });
});
