import { GeoCoordinates } from "@/lib/shared/types/geo";
import { GeocodedAddress } from "@/lib/shared/types/geocoding";
import { useCallback, useMemo } from "react";
import useSWR from "swr";
import axios from "axios";

export function useGeocodedAddresses(coordinates: GeoCoordinates[] | null) {
  const fetchGeocodedAddress = useCallback(async (key: GeoCoordinates) => {
    const url = "/api/geocoding/reverse";

    return await axios.get<GeocodedAddress>(url, {
      params: {
        lat: key.latitude,
        lon: key.longitude,
        format: "json",
      },
      headers: {
        Accept: "application/json",
      },
    });
  }, []);

  const { data: geocodedAddresses } = useSWR<
    (GeocodedAddress | null)[],
    unknown,
    ["geocodedAddresses", GeoCoordinates[]] | null
  >(
    coordinates
      ? [
          "geocodedAddresses",
          coordinates.map((coord) => ({
            latitude: coord.latitude,
            longitude: coord.longitude,
          })) || [],
        ]
      : null,
    (key) =>
      Promise.allSettled(
        key[1].map((coords) => fetchGeocodedAddress(coords)),
      ).then((responses) =>
        responses.map((res) =>
          res.status === "fulfilled" ? res.value.data : null,
        ),
      ),
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000 * 60 * 60 * 24, // 24h
    },
  );

  const formattedAddresses = useMemo(() => {
    return geocodedAddresses?.map((addr) => {
      if (!addr) return null;

      const { road, city, town, village, hamlet, municipality, postcode } =
        addr.address ?? {};

      const locality = city || town || village || hamlet || municipality;

      return [road, postcode, locality].filter(Boolean).join(", ");
    });
  }, [geocodedAddresses]);

  return formattedAddresses;
}
