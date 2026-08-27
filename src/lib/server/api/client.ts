import "server-only";

export class ApiRequestError extends Error {
  readonly status: number;
  readonly body: string;

  constructor(path: string, status: number, statusText: string, body: string) {
    super(`Request to '${path}' failed: ${statusText} (${status}) ${body}`);
    this.name = "ApiRequestError";
    this.status = status;
    this.body = body;
  }
}

function baseUrl(): string {
  const url = process.env.KIPPENSTUMMEL_API_URL;

  if (!url) {
    throw new Error("KIPPENSTUMMEL_API_URL is not configured");
  }

  return url.replace(/\/+$/, "");
}

export function apiUrl(path: string, searchParams?: URLSearchParams): URL {
  const url = new URL(`${baseUrl()}/${path.replace(/^\/+/, "")}`);

  searchParams?.forEach((value, key) => url.searchParams.append(key, value));

  return url;
}

/**
 * Calls the Kippenstummel API directly from the server and returns the parsed
 * JSON body. Server side rendering must not detour through the BFF proxy: that
 * exists to keep the API out of the browser, a concern the server does not
 * have.
 */
export async function fetchFromApi<T>(
  path: string,
  options: RequestInit & { searchParams?: URLSearchParams } = {},
): Promise<T> {
  const { searchParams, headers, ...init } = options;

  const res = await fetch(apiUrl(path, searchParams), {
    cache: "no-store",
    ...init,
    headers: { Accept: "application/json", ...headers },
  });

  if (!res.ok) {
    throw new ApiRequestError(
      path,
      res.status,
      res.statusText,
      await res.text(),
    );
  }

  return (await res.json()) as T;
}
