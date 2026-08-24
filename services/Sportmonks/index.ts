import "server-only";
import { NextResponse } from "next/server";

const BASE_URL = "https://api.sportmonks.com/v3/football";

/**
 * An upstream Sportmonks failure, carrying the status we should hand back to
 * the browser. Never contains the request URL: that URL has the API token in
 * its query string, and this message ends up in logs and HTTP responses.
 */
export class SportmonksError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "SportmonksError";
    this.status = status;
  }
}

/**
 * Reads the API token, failing loudly if it is absent.
 *
 * This used to be interpolated straight into the request URL, so a missing key
 * produced `api_token=undefined`, a 401 from Sportmonks, a swallowed error and
 * an empty page. The app looked broken rather than unconfigured.
 */
const getApiToken = (): string => {
  const token = process.env.SPORTMONKS_API_KEY;

  if (!token) {
    throw new SportmonksError(
      "SPORTMONKS_API_KEY is not set. Add it to .env.local and restart the dev server.",
      500
    );
  }

  return token;
};

type QueryParams = Record<string, string | number | undefined>;

const buildUrl = (path: string, params: QueryParams = {}): string => {
  const url = new URL(`${BASE_URL}/${path}`);

  url.searchParams.set("api_token", getApiToken());

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }

  return url.toString();
};

/** Maps an upstream status onto something honest for the client. */
const describeFailure = (status: number): SportmonksError => {
  if (status === 401 || status === 403) {
    return new SportmonksError(
      "Sportmonks rejected the API token. Check SPORTMONKS_API_KEY, and that your plan covers this data.",
      502
    );
  }

  if (status === 429) {
    return new SportmonksError(
      "Sportmonks rate limit reached. Try again shortly.",
      429
    );
  }

  return new SportmonksError(
    `Sportmonks request failed with status ${status}.`,
    502
  );
};

type SportmonksResponse<T> = {
  data: T;
  pagination?: { has_more: boolean; current_page: number };
};

/**
 * Performs one request. Throws SportmonksError on any non-OK response so
 * callers cannot accidentally treat a failure as an empty result.
 */
const request = async <T>(
  path: string,
  params: QueryParams,
  init: RequestInit
): Promise<SportmonksResponse<T>> => {
  // Built outside the try: a missing API token throws a SportmonksError with
  // its own message, and must not be caught and relabelled as a network
  // failure by the handler below.
  const url = buildUrl(path, params);

  let response: Response;

  try {
    response = await fetch(url, {
      ...init,
      headers: { Accept: "application/json", ...init.headers },
    });
  } catch (cause) {
    // Network-level failure: DNS, TLS, timeout. No status to report.
    throw new SportmonksError("Could not reach Sportmonks.", 504);
  }

  if (!response.ok) throw describeFailure(response.status);

  return (await response.json()) as SportmonksResponse<T>;
};

/** Fetches a single resource. */
export const fetchOne = async <T>(
  path: string,
  params: QueryParams = {}
): Promise<T> => {
  const { data } = await request<T>(path, params, { cache: "no-store" });

  return data;
};

/**
 * Fetches every page of a paginated collection.
 *
 * Iterative rather than recursive: the previous implementation appended
 * "&page=N" to a URL that already carried the last page number, so the query
 * string grew on every hop.
 */
export const fetchAll = async <T>(
  path: string,
  params: QueryParams = {},
  maxPages = 20
): Promise<T[]> => {
  const results: T[] = [];
  let page = 1;

  while (page <= maxPages) {
    const { data, pagination } = await request<T[]>(
      path,
      { ...params, page },
      { cache: "no-store" }
    );

    if (Array.isArray(data)) results.push(...data);

    if (!pagination?.has_more) break;

    page += 1;
  }

  return results;
};

/** Turns any thrown value into a JSON error response with a sane status. */
export const toErrorResponse = (error: unknown): NextResponse => {
  const isKnown = error instanceof SportmonksError;
  const status = isKnown ? error.status : 500;
  const message = isKnown ? error.message : "Unexpected server error.";

  console.error("[sportmonks]", message, isKnown ? "" : error);

  return NextResponse.json({ error: message }, { status });
};
