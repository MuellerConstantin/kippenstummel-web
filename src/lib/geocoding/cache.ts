import { LRUCache } from "lru-cache";
import { getRedisClient } from "@/lib/redis";
import { GeoCoordinates } from "@/lib/types/geo";

/*
 * Addresses at a fixed coordinate barely change, and the key space is bounded
 * by the number of CVMs rather than by request volume. The TTL is therefore
 * less about correctness than about eventually picking up improved OSM data
 * and letting keys of repositioned CVMs expire.
 */
const TTL_MS = 1000 * 60 * 60 * 24 * 365; // 1 year
const REDIS_KEY_PREFIX = "geocoding:";

/**
 * In-process cache, avoids a Redis roundtrip for recently requested
 * coordinates. Kept small on purpose, Redis is the authoritative layer.
 */
const memoryCache = new LRUCache<string, string>({
  max: 1000,
  ttl: TTL_MS,
});

/**
 * Keys are derived from the coordinates instead of the upstream request, so
 * the cache stays usable from anywhere a coordinate needs to be resolved.
 * The language is part of the key because place names are localised, and the
 * coordinates are normalised to shield the key space from differing textual
 * representations of the same point.
 */
function cacheKey(coordinates: GeoCoordinates, language: string): string {
  return `${language}:${coordinates.latitude},${coordinates.longitude}`;
}

/**
 * Returns the cached geocoding document for the given coordinates and
 * language as raw JSON, or `undefined` if it is not cached.
 */
export async function getCachedAddress(
  coordinates: GeoCoordinates,
  language: string,
): Promise<string | undefined> {
  const key = cacheKey(coordinates, language);
  const cached = memoryCache.get(key);

  if (cached) {
    return cached;
  }

  const redis = await getRedisClient();

  if (!redis) {
    return undefined;
  }

  try {
    const address = await redis.get(`${REDIS_KEY_PREFIX}${key}`);

    if (!address) {
      return undefined;
    }

    memoryCache.set(key, address);

    return address;
  } catch (error) {
    console.error("Geocoding-Cache-Read-Error:", error);
    return undefined;
  }
}

export async function setCachedAddress(
  coordinates: GeoCoordinates,
  language: string,
  address: string,
): Promise<void> {
  const key = cacheKey(coordinates, language);

  memoryCache.set(key, address);

  const redis = await getRedisClient();

  if (!redis) {
    return;
  }

  try {
    await redis.set(`${REDIS_KEY_PREFIX}${key}`, address, "PX", TTL_MS);
  } catch (error) {
    console.error("Geocoding-Cache-Write-Error:", error);
  }
}
