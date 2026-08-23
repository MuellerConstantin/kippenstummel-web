import { type NextRequest } from "next/server";
import {
  ThrottledQueue,
  ThrottleOverflowError,
} from "@/lib/utils/throttled-queue";
import { getCachedAddress, setCachedAddress } from "@/lib/geocoding/cache";
import { routing } from "@/i18n/routing";
import { GeoCoordinates } from "@/lib/types/geo";

export const runtime = "nodejs";

const REVERSE_URL = "https://nominatim.openstreetmap.org/reverse";
const USER_AGENT = "Kippenstummel/1.0 (info@mueller-constantin.de)";

const throttledFetchQueue = new ThrottledQueue<Response>(1000, 100);

function parseCoordinates(
  searchParams: URLSearchParams,
): GeoCoordinates | null {
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return null;
  }

  const latitude = Number(lat);
  const longitude = Number(lon);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return { latitude, longitude };
}

/**
 * Nominatim localises place names, so the requested language is part of the
 * result. Reducing it to a supported locale keeps the upstream request
 * deterministic and prevents the cache from fragmenting over the many shapes
 * a browser's `Accept-Language` header can take.
 */
function resolveLanguage(req: NextRequest): string {
  const requested = req.headers
    .get("accept-language")
    ?.split(",")[0]
    ?.split("-")[0]
    ?.trim()
    .toLowerCase();

  return routing.locales.find((locale) => locale === requested)
    ? requested!
    : routing.defaultLocale;
}

function errorResponse(
  status: number,
  code: string,
  message: string,
  headers: Record<string, string> = {},
) {
  return new Response(
    JSON.stringify({
      code,
      timestamp: new Date().toISOString(),
      path: "/api/geocoding/reverse",
      message,
    }),
    {
      status,
      headers: { "Content-Type": "application/json", ...headers },
    },
  );
}

export async function GET(req: NextRequest) {
  const coordinates = parseCoordinates(req.nextUrl.searchParams);

  if (!coordinates) {
    return errorResponse(
      400,
      "GEOCODING_INVALID_COORDINATES",
      "Query parameters 'lat' and 'lon' must be valid coordinates",
    );
  }

  const language = resolveLanguage(req);
  const cached = await getCachedAddress(coordinates, language);

  if (cached) {
    return new Response(cached, {
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
          "Accept-Language": language,
          "Accept-Encoding": "identity",
        },
        redirect: "manual",
        cache: "no-store",
      }),
    );

    const body = await upstream.text();

    if (!upstream.ok) {
      return errorResponse(
        upstream.status,
        "GEOCODING_UPSTREAM_ERROR",
        "Upstream geocoding service returned an error",
      );
    }

    await setCachedAddress(coordinates, language, body);

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "X-Cache": "MISS",
      },
    });
  } catch (error) {
    if (error instanceof ThrottleOverflowError) {
      return errorResponse(
        429,
        "GEOCODING_PROXY_THROTTLED",
        `Too many requests. Retry after ${error.retryAfterSecs}s.`,
        { "Retry-After": String(error.retryAfterSecs) },
      );
    }

    console.error("Proxy-Error:", error);

    return errorResponse(
      500,
      "GEOCODING_PROXY_ERROR",
      "Unexpected error while proxying request",
    );
  }
}
