import { type NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(req, params);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(req, params);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(req, params);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(req, params);
}

export async function PATCH(
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

  const backendUrl = process.env.KIPPENSTUMMEL_API_URL;
  const cleanPath = path?.join("/") || "";
  const targetUrl = new URL(`${backendUrl}/${cleanPath}`);

  /**
   * Prevent exposure of Kippenstummel's internal management API. These
   * endpoints are not meant for public consumption.
   */

  if (cleanPath.startsWith("kmc")) {
    return new Response(
      JSON.stringify({
        code: "BFF_PROXY_BLOCKED",
        timestamp: new Date().toISOString(),
        path: targetUrl.pathname,
        message: "This path is excluded from proxying.",
      }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  req.nextUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.append(key, value);
  });

  const headers = new Headers();

  req.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "content-length") {
      headers.append(key, value);
    }
  });

  const fetchOptions = {
    method: req.method,
    headers,
    body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
  };

  try {
    const upstream = await fetch(targetUrl, fetchOptions);
    const forwardHeaders = new Headers(upstream.headers);

    [
      "connection",
      "keep-alive",
      "transfer-encoding",
      "te",
      "trailer",
      "upgrade",
      "date",
      "x-powered-by",
    ].forEach((header) => forwardHeaders.delete(header));

    return new Response(upstream.body, {
      status: upstream.status,
      headers,
    });
  } catch (error) {
    console.error("Proxy-Error:", error);

    return new Response(
      JSON.stringify({
        code: "BFF_PROXY_ERROR",
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
