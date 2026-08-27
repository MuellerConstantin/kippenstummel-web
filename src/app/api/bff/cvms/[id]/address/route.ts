import { type NextRequest } from "next/server";
import { ApiRequestError, fetchFromApi } from "@/lib/server/api/client";
import {
  getCachedAddress,
  setCachedAddress,
} from "@/lib/server/geocoding/cache";
import { toGeocodedAddress } from "@/lib/server/geocoding/nominatim";
import {
  ThrottledQueue,
  ThrottleOverflowError,
} from "@/lib/shared/throttled-queue";
import { Cvm } from "@/lib/shared/types/cvm";

export const runtime = "nodejs";

const REVERSE_URL = "https://nominatim.openstreetmap.org/reverse";
const USER_AGENT = "Kippenstummel/1.0 (info@mueller-constantin.de)";

/**
 * Nominatim's usage policy permits at most one request per second, counted per
 * application rather than per visitor. The queue is therefore deliberately
 * global and shared by everyone: raising the rate, or holding one queue per
 * client, risks getting the whole service blocked upstream.
 *
 * Only requests that actually reach Nominatim pass through here. Cached
 * addresses are answered further down before the queue is involved and are not
 * subject to the limit.
 */
const throttledFetchQueue = new ThrottledQueue<Response>(1000, 100);

function errorResponse(
  path: string,
  status: number,
  code: string,
  message: string,
  headers: Record<string, string> = {},
) {
  return new Response(
    JSON.stringify({
      code,
      timestamp: new Date().toISOString(),
      path,
      message,
    }),
    {
      status,
      headers: { "Content-Type": "application/json", ...headers },
    },
  );
}

/**
 * Resolves the address of a registered CVM. The coordinates are looked up from
 * the machine rather than taken from the caller, which keeps this from being a
 * reverse geocoder for arbitrary positions: the set of resolvable coordinates,
 * and with it the cache, is bounded by the number of registered machines.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const path = `/api/bff/cvms/${id}/address`;

  const ident = req.headers.get("x-ident");

  let cvm: Cvm;

  try {
    cvm = await fetchFromApi<Cvm>(`cvms/${encodeURIComponent(id)}`, {
      ...(ident && { headers: { "x-ident": ident } }),
    });
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) {
      return errorResponse(
        path,
        404,
        "GEOCODING_CVM_NOT_FOUND",
        "No CVM exists for the given id",
      );
    }

    console.error("Geocoding-Cvm-Lookup-Error:", error);

    return errorResponse(
      path,
      502,
      "GEOCODING_CVM_LOOKUP_ERROR",
      "The CVM could not be looked up",
    );
  }

  const coordinates = { latitude: cvm.latitude, longitude: cvm.longitude };

  const cached = await getCachedAddress(coordinates);

  if (cached) {
    return new Response(JSON.stringify(cached), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "X-Cache": "HIT",
      },
    });
  }

  const targetUrl = new URL(REVERSE_URL);

  targetUrl.searchParams.set("format", "json");
  targetUrl.searchParams.set("lat", String(coordinates.latitude));
  targetUrl.searchParams.set("lon", String(coordinates.longitude));

  try {
    const upstream = await throttledFetchQueue.enqueue(() =>
      fetch(targetUrl, {
        method: "GET",
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "application/json",
          "Accept-Encoding": "identity",
        },
        redirect: "manual",
        cache: "no-store",
      }),
    );

    const upstreamBody = await upstream.text();

    if (!upstream.ok) {
      return errorResponse(
        path,
        upstream.status,
        "GEOCODING_UPSTREAM_ERROR",
        "Upstream geocoding service returned an error",
      );
    }

    const address = toGeocodedAddress(upstreamBody);

    if (!address) {
      return errorResponse(
        path,
        404,
        "GEOCODING_NOT_FOUND",
        "No address could be resolved for the given CVM",
      );
    }

    await setCachedAddress(coordinates, address);

    return new Response(JSON.stringify(address), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "X-Cache": "MISS",
      },
    });
  } catch (error) {
    if (error instanceof ThrottleOverflowError) {
      return errorResponse(
        path,
        429,
        "GEOCODING_PROXY_THROTTLED",
        `Too many requests. Retry after ${error.retryAfterSecs}s.`,
        { "Retry-After": String(error.retryAfterSecs) },
      );
    }

    console.error("Geocoding-Error:", error);

    return errorResponse(
      path,
      500,
      "GEOCODING_PROXY_ERROR",
      "Unexpected error while resolving the address",
    );
  }
}
