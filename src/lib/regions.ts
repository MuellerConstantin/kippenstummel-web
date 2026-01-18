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

export function getTopRegionsByPopulation(
  regions: Region[],
  limit = 40,
): Region[] {
  return [...regions]
    .sort((a, b) => b.population - a.population)
    .slice(0, limit);
}

function getLatLng(region: Region) {
  const [lon1, lat1] = region.bbox.bottomLeft;
  const [lon2, lat2] = region.bbox.topRight;
  return {
    lat: (lat1 + lat2) / 2,
    lon: (lon1 + lon2) / 2,
  };
}

function geoBucket(region: Region): string {
  const { lat, lon } = getLatLng(region);

  if (lat > 53) return "north";
  if (lat < 48) return "south";
  if (lon < 10) return "west";
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
