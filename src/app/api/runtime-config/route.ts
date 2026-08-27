/**
 * Hands the client the public runtime configuration. The values are read from
 * the environment on every request: they are set when the container starts,
 * long after the build inlined `NEXT_PUBLIC_` variables into the bundle.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  return loadRuntimeEnv();
}

async function loadRuntimeEnv() {
  const publicEnvVariables = Object.fromEntries(
    Object.entries(process.env).filter((entry) =>
      entry[0].startsWith("NEXT_PUBLIC_"),
    ),
  );

  return new Response(JSON.stringify(publicEnvVariables), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}
