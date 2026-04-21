import { GeoCoordinates } from "@/lib/types/geo";
import { useMemo } from "react";
import useSWR from "swr";
import axios from "axios";

type OsmAddress = {
  place_id: number;
  licence: string;
  osm_type: "node" | "way" | "relation";
  osm_id: number;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  address: {
    amenity?: string;
    road?: string;
    neighbourhood?: string;
    suburb?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    ISO3166_2_lvl4?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
  };
  boundingbox: [
    string, // south latitude
    string, // north latitude
    string, // west longitude
    string, // east longitude
  ];
};

async function fetchOsmAddress(coords: GeoCoordinates): Promise<OsmAddress> {
  const { data } = await axios.get<OsmAddress>("/api/geocoding/reverse", {
    params: {
      lat: coords.latitude,
      lon: coords.longitude,
      format: "json",
    },
    headers: { Accept: "application/json" },
  });
  return data;
}

export function useOsmAddress(coords: GeoCoordinates | null) {
  const { data, isLoading, error } = useSWR(
    coords ? ["osmAddress", coords.latitude, coords.longitude] : null,
    () => fetchOsmAddress(coords!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000 * 60 * 60 * 24,
    },
  );

  const formatted = useMemo(() => {
    if (!data) {
      return null;
    }

    const { road, city, town, village, postcode } = data.address ?? {};
    return [road, postcode, city || town || village].filter(Boolean).join(", ");
  }, [data]);

  return { address: formatted, isLoading, error };
}
