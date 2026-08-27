import { useMemo } from "react";
import useSWR from "swr";
import { AxiosError } from "axios";
import useApi from "@/hooks/useApi";
import { ApiError } from "@/lib/shared/types/error";
import { GeocodedAddress } from "@/lib/shared/types/geocoding";

/**
 * The address of a CVM, formatted for display. Uncached addresses are resolved
 * upstream at one request per second across all visitors, so a request can sit
 * in that queue for a while: the client's default timeout is too tight for it.
 */
const REQUEST_TIMEOUT_MS = 30000;

export function useCvmAddress(cvmId: string | null) {
  const api = useApi();

  const { data, isLoading, error } = useSWR<
    GeocodedAddress,
    AxiosError<ApiError>,
    string | null
  >(
    cvmId ? `/cvms/${cvmId}/address` : null,
    (url) =>
      api.get(url, { timeout: REQUEST_TIMEOUT_MS }).then((res) => res.data),
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000 * 60 * 60 * 24,
    },
  );

  const formatted = useMemo(() => {
    if (!data) {
      return null;
    }

    const { road, city, town, village, hamlet, municipality, postcode } =
      data.address ?? {};

    const locality = city || town || village || hamlet || municipality;

    return [road, postcode, locality].filter(Boolean).join(", ");
  }, [data]);

  return { address: formatted, isLoading, error };
}
