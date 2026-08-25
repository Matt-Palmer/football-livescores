/*
  All dates in this app are resolved in the *viewer's* timezone.

  Sportmonks returns kickoff times as UTC strings plus a UNIX timestamp, and
  its `fixtures/date/{date}` endpoint decides which matches count as "today"
  using whatever timezone we ask for. If the app and the API disagree about
  where the day boundary falls, a viewer in New York opening the app at 20:00
  local is shown tomorrow's fixture list. So the timezone below is resolved
  once, from the browser, and used for both halves of that decision.
*/

/**
 * The viewer's IANA timezone, e.g. "Europe/London".
 * Falls back to UTC on the server, or if the browser won't tell us.
 */
export const getTimeZone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
};

/**
 * Today's date as YYYY-MM-DD in the viewer's timezone.
 *
 * Deliberately not `toISOString().split("T")[0]` — that is always UTC and is
 * wrong for anyone whose local day boundary differs from UTC's.
 */
export const getTodaysDate = (date: Date = new Date()): string => {
  // en-CA formats as YYYY-MM-DD, which is the shape Sportmonks expects.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: getTimeZone(),
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

/** A fixture's kickoff time as HH:mm in the viewer's timezone. */
export const formatKickOffTime = (timestamp: number): string => {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: getTimeZone(),
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(timestamp * 1000));
};

/** A fixture's date as DD/MM or DD/MM/YY in the viewer's timezone. */
export const formatFixtureDate = (
  timestamp: number,
  withYear: boolean
): string => {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: getTimeZone(),
    day: "2-digit",
    month: "2-digit",
    ...(withYear ? { year: "2-digit" } : {}),
  }).format(new Date(timestamp * 1000));
};

/**
 * Kickoff time if the fixture is today, otherwise its date.
 * Matches how livescore listings read: today's matches show a time, everything
 * else shows a day.
 */
export const formatFixtureDateOrTime = (
  timestamp: number,
  withYear: boolean
): string => {
  const isToday =
    getTodaysDate(new Date(timestamp * 1000)) === getTodaysDate();

  if (isToday) return formatKickOffTime(timestamp);

  return formatFixtureDate(timestamp, withYear);
};

/**
 * True when a fixture's kickoff falls on a later calendar day than today, in
 * the viewer's timezone. String comparison works because both sides are
 * YYYY-MM-DD.
 */
export const isFixtureDateInFuture = (timestamp: number): boolean => {
  return getTodaysDate(new Date(timestamp * 1000)) > getTodaysDate();
};

/**
 * A YYYY-MM-DD date string as a local-midnight `Date`.
 *
 * `new Date("YYYY-MM-DD")` parses as UTC midnight, which is the wrong
 * instant everywhere west of Greenwich. Calendar-only values (no time
 * component) have no timezone of their own, so this treats them as
 * local-midnight instead — matching how `react-day-picker` represents days
 * internally, and safe to round-trip through `getTodaysDate` below.
 */
export const parseCalendarDate = (date: string): Date => {
  const [year, month, day] = date.split("-").map(Number);

  return new Date(year, month - 1, day);
};

/** Shifts a YYYY-MM-DD date string by `days` (negative to go backwards). */
export const addDays = (date: string, days: number): string => {
  const shifted = parseCalendarDate(date);

  shifted.setDate(shifted.getDate() + days);

  return getTodaysDate(shifted);
};

/**
 * "Yesterday" / "Today" / "Tomorrow" for the three nearest days, otherwise a
 * formatted date like "Sat 29 Aug".
 */
export const getDayStripLabel = (date: string): string => {
  const today = getTodaysDate();

  if (date === today) return "Today";
  if (date === addDays(today, -1)) return "Yesterday";
  if (date === addDays(today, 1)) return "Tomorrow";

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: getTimeZone(),
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(parseCalendarDate(date));
};
