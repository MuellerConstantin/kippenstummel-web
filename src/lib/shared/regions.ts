import { GeoCoordinates } from "@/lib/shared/types/geo";
import de from "../../../data/regions/de/cities.json";

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

export function getRegionCenter(region: Region): GeoCoordinates {
  const [lon1, lat1] = region.bbox.bottomLeft;
  const [lon2, lat2] = region.bbox.topRight;

  return {
    latitude: (lat1 + lat2) / 2,
    longitude: (lon1 + lon2) / 2,
  };
}

export function getTopRegionsByPopulation(
  regions: Region[],
  limit = 40,
): Region[] {
  return [...regions]
    .sort((a, b) => b.population - a.population)
    .slice(0, limit);
}

function geoBucket(region: Region): string {
  const { latitude, longitude } = getRegionCenter(region);

  if (latitude > 53) return "north";
  if (latitude < 48) return "south";
  if (longitude < 10) return "west";
  return "east";
}

export function getTopRegionsGeoBalanced(
  regions: Region[],
  perBucket = 8,
): Region[] {
  const buckets = regions.reduce<Record<string, Region[]>>((acc, r) => {
    const key = geoBucket(r);
    acc[key] ??= [];
    acc[key].push(r);
    return acc;
  }, {});

  return Object.values(buckets).flatMap((bucket) =>
    bucket.sort((a, b) => b.population - a.population).slice(0, perBucket),
  );
}
