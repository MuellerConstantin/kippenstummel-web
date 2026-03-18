import { NextRequest } from "next/server";
import { forward } from "@/lib/bff/proxy";

export async function GET(req: NextRequest) {
  return forward(req, "ident");
}
