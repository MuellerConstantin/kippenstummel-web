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

  const requestHeaders = new Headers(req.headers);
  const requestBody =
    req.method !== "GET" && req.method !== "HEAD"
      ? JSON.stringify(await req.json())
      : undefined;

  const fetchOptions = {
    method: req.method,
    headers: {
      ...requestHeaders,
      ...(req.method !== "GET" &&
        req.method !== "HEAD" &&
        requestBody && {
          "Content-Type": "application/json",
          "Content-Length": requestBody.length.toString(),
        }),
    },
    ...(req.method !== "GET" &&
      req.method !== "HEAD" &&
      requestBody && {
        body: requestBody,
      }),
  };

  try {
    const response = await fetch(targetUrl, fetchOptions);
    const responseHeaders = new Headers(response.headers);
    const responseBody = JSON.stringify(await response.json());

    return new Response(responseBody ? responseBody : undefined, {
      status: response.status,
      headers: {
        ...responseHeaders,
        ...(responseBody && {
          "Content-Type": "application/json",
          "Content-Length": responseBody.length.toString(),
        }),
      },
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
