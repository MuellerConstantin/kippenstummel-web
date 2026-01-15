import { type NextRequest } from "next/server";

const BASE_URL = "https://nominatim.openstreetmap.org";
const USER_AGENT = "Kippenstummel/1.0 (info@mueller-constantin.de)";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(req, params);
}

export async function HEAD(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(req, params);
}

async function proxyRequest(
  req: NextRequest,
  params: Promise<{ path: string[] }>,
) {
  const { path } = await params;

  const backendUrl = BASE_URL;
  const cleanPath = path?.join("/") || "";
  const targetUrl = new URL(`${backendUrl}/${cleanPath}`);

  req.nextUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.append(key, value);
  });

  const requestHeaders = new Headers(req.headers);

  requestHeaders.delete("accept-encoding");
  requestHeaders.set("accept-encoding", "identity");
  requestHeaders.set("user-agent", USER_AGENT);

  [
    "host",
    "connection",
    "keep-alive",
    "proxy-authenticate",
    "proxy-authorization",
    "te",
    "trailers",
    "transfer-encoding",
    "upgrade",
  ].forEach((header) => requestHeaders.delete(header));

  const couldHaveBody = req.method !== "GET" && req.method !== "HEAD";

  const fetchOptions: RequestInit = {
    method: req.method,
    headers: requestHeaders,
    body: couldHaveBody ? req.body : undefined,
    redirect: "manual",
    // @ts-expect-error: Not available for browser fetch type
    duplex: couldHaveBody ? "half" : undefined,
    cache: "no-store",
  };

  try {
    const upstream = await fetch(targetUrl, fetchOptions);
    const upstreamHeaders = new Headers(upstream.headers);

    upstreamHeaders.delete("content-encoding");
    upstreamHeaders.delete("content-length");

    [
      "connection",
      "keep-alive",
      "transfer-encoding",
      "upgrade",
      "proxy-authenticate",
      "proxy-authorization",
      "te",
      "trailers",
    ].forEach((header) => upstreamHeaders.delete(header));

    return new Response(upstream.body, {
      status: upstream.status,
      headers: upstreamHeaders,
    });
  } catch (error) {
    console.error("Proxy-Error:", error);

    return new Response(
      JSON.stringify({
        code: "GEOCODING_PROXY_ERROR",
        timestamp: new Date().toISOString(),
        path: targetUrl.pathname,
        message: "Unexpected error while proxying request",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
