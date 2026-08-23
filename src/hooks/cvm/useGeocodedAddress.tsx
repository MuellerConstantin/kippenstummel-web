import { GeoCoordinates } from "@/lib/types/geo";
import { GeocodedAddress } from "@/lib/types/geocoding";
import { useMemo } from "react";
import useSWR from "swr";
import axios from "axios";

async function fetchGeocodedAddress(
  coords: GeoCoordinates,
): Promise<GeocodedAddress> {
  const { data } = await axios.get<GeocodedAddress>("/api/geocoding/reverse", {
    params: {
      lat: coords.latitude,
      lon: coords.longitude,
      format: "json",
    },
    headers: { Accept: "application/json" },
  });
  return data;
}

export function useGeocodedAddress(coords: GeoCoordinates | null) {
  const { data, isLoading, error } = useSWR(
    coords ? ["geocodedAddress", coords.latitude, coords.longitude] : null,
    () => fetchGeocodedAddress(coords!),
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
