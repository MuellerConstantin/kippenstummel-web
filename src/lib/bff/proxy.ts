import { NextRequest } from "next/server";

const backendUrl = process.env.KIPPENSTUMMEL_API_URL!;

export async function forward(
  req: NextRequest,
  path: string,
  init?: Partial<RequestInit>,
) {
  const targetUrl = new URL(`${backendUrl}/${path}`);

  req.nextUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.append(key, value);
  });

  const headers = new Headers(req.headers);

  headers.delete("accept-encoding");
  headers.set("accept-encoding", "identity");

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
  ].forEach((h) => headers.delete(h));

  const hasBody = req.method !== "GET" && req.method !== "HEAD";

  const res = await fetch(targetUrl, {
    method: req.method,
    headers,
    body: hasBody ? req.body : undefined,
    redirect: "manual",
    // @ts-expect-error: Not available for browser fetch type
    duplex: hasBody ? "half" : undefined,
    cache: "no-store",
    ...init,
  });

  const responseHeaders = new Headers(res.headers);

  responseHeaders.delete("content-encoding");
  responseHeaders.delete("content-length");

  return new Response(res.body, {
    status: res.status,
    headers: responseHeaders,
  });
}
