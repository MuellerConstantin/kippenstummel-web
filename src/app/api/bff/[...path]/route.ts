import { type NextRequest } from "next/server";
import { forward } from "@/lib/bff/proxy";

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
  const cleanPath = path?.join("/") || "";

  /**
   * Prevent exposure of Kippenstummel's internal management API. These
   * endpoints are not meant for public consumption.
   */
  if (cleanPath.startsWith("kmc")) {
    return new Response(
      JSON.stringify({
        code: "BFF_PROXY_BLOCKED",
        timestamp: new Date().toISOString(),
        path: cleanPath,
        message: "This path is excluded from proxying.",
      }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  return forward(req, cleanPath);
}
