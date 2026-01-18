/**
 * This script generates regions from a GeoJSON file, required for region agnostic SEO pages.
 * The required OSM data can be downloaded from https://download.geofabrik.de/.
 *
 * The following steps are required to gather the data:
 * - Download the required OSM data (.osm.pbf) from https://download.geofabrik.de/
 * - Preselect city data using "osmium tags-filter <input>.osm.pbf n/place=city,town -o <output>.osm.pbf"
 * - Convert the data to GeoJSON using "osmium export <input>.osm.pbf -f geojson -o <output>.geojson"
 * - Run this script using "npm run generate:regions -- --input <input>.geojson --country <code> --countryName <name>"
 */

import fs from "fs";
import path from "path";

type GeoJsonFeatureCollection<G, P> = {
  type: "FeatureCollection";
  features: Array<GeoJsonFeature<G, P>>;
};

type GeoJsonFeature<G, P> = {
  type: "Feature";
  geometry: G;
  properties: P;
};

type GeoJsonPoint = {
  type: "Point";
  coordinates: [number, number]; // [lon, lat]
};

type OsmPlaceProperties = {
  name?: string;
  population?: string | number;
  place?: "city" | "town" | "village" | string;

  wikidata?: string;
  wikipedia?: string;
  postal_code?: string;
  ele?: string;

  [key: string]: string | number | undefined;
};

type OsmCityGeoJson = GeoJsonFeatureCollection<
  GeoJsonPoint,
  OsmPlaceProperties
>;

type GeneratedRegion = {
  slug: string;
  name: string;
  country: string;
  countryName: string;
  population: number;
  bbox: {
    bottomLeft: number[];
    topRight: number[];
  };
};

type CliArgs = {
  input: string;
  country: string;
  countryName: string;
  outDir: string;
  minPopulation: number;
};

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);

  const get = (key: string): string | undefined => {
    const index = args.indexOf(`--${key}`);
    return index !== -1 ? args[index + 1] : undefined;
  };

  const input = get("input");
  const country = get("country");
  const countryName = get("countryName");

  if (!input || !country || !countryName) {
    console.error(`
This script generates regions from a GeoJSON file.

Usage:
  --input <geojson-file>        (required)
  --country <code>              (required, e.g. de)
  --countryName <name>          (required, e.g. Deutschland)

Optional:
  --outDir <dir>                (default: data/regions)
  --minPopulation <number>      (default: 10000)
`);
    process.exit(1);
  }

  return {
    input,
    country,
    countryName,
    outDir: get("outDir") ?? "data/regions",
    minPopulation: Number(get("minPopulation") ?? 10_000),
  };
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function radiusToBBox(lon: number, lat: number, radiusMeters: number) {
  const metersPerDegreeLat = 111_320;
  const metersPerDegreeLon = 111_320 * Math.cos((lat * Math.PI) / 180);

  const deltaLat = radiusMeters / metersPerDegreeLat;
  const deltaLon = radiusMeters / metersPerDegreeLon;

  return {
    bottomLeft: [lon - deltaLon, lat - deltaLat],
    topRight: [lon + deltaLon, lat + deltaLat],
  };
}

function parsePopulation(raw: OsmPlaceProperties["population"]): number | null {
  if (raw === undefined || raw === null) return null;

  const value = typeof raw === "string" ? Number(raw) : raw;

  return Number.isFinite(value) ? value : null;
}

function radiusByPopulation(population: number): number {
  if (population >= 1_000_000) return 15_000;
  if (population >= 500_000) return 12_000;
  if (population >= 250_000) return 10_000;
  if (population >= 100_000) return 8_000;
  if (population >= 50_000) return 6_000;
  if (population >= 20_000) return 5_000;

  return 4_000;
}

function isValidCityFeature(
  feature: GeoJsonFeature<GeoJsonPoint, OsmPlaceProperties>,
): feature is GeoJsonFeature<
  GeoJsonPoint,
  Required<Pick<OsmPlaceProperties, "name" | "population">>
> {
  return (
    feature.geometry?.type === "Point" &&
    Array.isArray(feature.geometry.coordinates) &&
    feature.geometry.coordinates.length === 2 &&
    typeof feature.properties?.name === "string" &&
    feature.properties.population !== undefined
  );
}

function run(): void {
  const { input, country, countryName, outDir, minPopulation } = parseArgs();

  const raw = fs.readFileSync(input, "utf8");
  const geojson = JSON.parse(raw) as OsmCityGeoJson;

  if (geojson.type !== "FeatureCollection") {
    throw new Error("Invalid GeoJSON input");
  }

  const regions: GeneratedRegion[] = geojson.features
    .filter(isValidCityFeature)
    .map((feature) => {
      const [lon, lat] = feature.geometry.coordinates;
      const population = parsePopulation(feature.properties.population);

      if (population === null || population < minPopulation) {
        return null;
      }

      const name = feature.properties.name;
      const radiusMeters = radiusByPopulation(population);
      const bbox = radiusToBBox(lon, lat, radiusMeters);

      return {
        slug: slugify(name),
        name,
        country,
        countryName,
        population,
        bbox,
      };
    })
    .filter((r): r is GeneratedRegion => r !== null);

  const countryDir = path.join(outDir, country);
  fs.mkdirSync(countryDir, { recursive: true });

  const outFile = path.join(countryDir, "cities.json");

  fs.writeFileSync(outFile, JSON.stringify(regions, null, 2));

  console.log(`✓ ${regions.length} cities written to ${outFile}`);
}

run();
