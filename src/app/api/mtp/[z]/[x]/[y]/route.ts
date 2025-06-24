import { type NextRequest } from "next/server";
import Redis from "ioredis";
import { LRUCache } from "lru-cache";

const redisCache = new Redis(process.env.TILE_REDIS_CACHE_URL!);

const lruCache = new LRUCache<string, Buffer>({
  max: process.env.TILE_LRU_CACHE_MAX
    ? Number(process.env.TILE_LRU_CACHE_MAX)
    : 500,
  ttl: process.env.TILE_LRU_CACHE_TTL
    ? Number(process.env.TILE_LRU_CACHE_TTL)
    : 1000 * 60 * 5,
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ z: string; x: string; y: string }> },
) {
  return proxyRequest(req, params);
}

async function proxyRequest(
  req: NextRequest,
  params: Promise<{ z: string; x: string; y: string }>,
) {
  const { z, x, y } = await params;

  if (!req.url.endsWith(".png")) {
    return new Response(null, { status: 404 });
  }

  const stripedY = y.replace(".png", "");
  const tileKey = `tile:${z}/${x}/${stripedY}`;

  // Level 1 cache
  const lruTile = lruCache.get(tileKey);

  if (lruTile) {
    return new Response(lruTile, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  // Level 2 cache
  const redisTile = await redisCache.getBuffer(tileKey);

  if (redisTile) {
    // Fire-and-forget cache update
    (async function () {
      lruCache.set(tileKey, redisTile);
    })();

    return new Response(redisTile, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  const tileUrl = `${process.env.TILE_BASE_URL}/${z}/${x}/${stripedY}.png`;
  const tileResponse = await fetch(tileUrl, {
    headers: process.env.TILE_USER_AGENT
      ? {
          userAgent: process.env.TILE_USER_AGENT,
        }
      : undefined,
  });

  if (!tileResponse.ok) {
    return new Response(null, { status: tileResponse.status });
  }

  const tileBuffer = await tileResponse.arrayBuffer();

  // Fire-and-forget cache update
  (async function () {
    lruCache.set(tileKey, Buffer.from(tileBuffer));
    redisCache.setex(
      tileKey,
      process.env.TILE_REDIS_CACHE_TTL!,
      Buffer.from(tileBuffer),
    );
  })();

  return new Response(tileBuffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
