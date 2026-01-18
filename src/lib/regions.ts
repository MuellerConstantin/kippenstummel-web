import de from "../../data/regions/de/cities.json";

export interface Region {
  slug: string;
  name: string;
  country: string;
  countryName: string;
  population: number;
  bbox: {
    bottomLeft: number[];
    topRight: number[];
  };
}

export const REGIONS: Region[] = [...de];

export function getRegion(country: string, slug: string) {
  return REGIONS.find((r) => r.country === country && r.slug === slug);
}
