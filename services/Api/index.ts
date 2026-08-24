import { getTimeZone } from "@/services/Date";

/** A failure from one of this app's own /api routes. */
export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * POSTs JSON to an internal API route and returns the parsed body.
 *
 * Throws on any non-OK response rather than returning an empty array, so
 * callers can distinguish "the request failed" from "there is no data" — the
 * two used to be indistinguishable, which is what made a missing API key
 * present as a blank page.
 *
 * The viewer's timezone rides along on every request so the server resolves
 * day boundaries and kickoff times the same way the UI displays them.
 */
export const postJson = async <T>(
  route: string,
  body: Record<string, unknown>,
  signal?: AbortSignal
): Promise<T> => {
  const response = await fetch(`/api/${route}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, timeZone: getTimeZone() }),
    signal,
  });

  if (!response.ok) {
    const message = await response
      .json()
      .then((payload) => payload?.error)
      .catch(() => null);

    throw new ApiError(
      message ?? `Request to /api/${route} failed.`,
      response.status
    );
  }

  return (await response.json()) as T;
};

/** True when a rejection is just an in-flight request being cancelled. */
export const isAbortError = (error: unknown): boolean => {
  return error instanceof DOMException && error.name === "AbortError";
};

/** A message safe and useful to show a viewer. */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) return error.message;

  return "Something went wrong loading this data.";
};
