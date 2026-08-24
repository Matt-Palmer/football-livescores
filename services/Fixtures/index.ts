import { postJson } from "@/services/Api";
import { getTodaysDate } from "@/services/Date";
import { isInplay } from "@/services/MatchStates";
import { Fixture } from "@/typings";

/** Today's fixtures, in the viewer's timezone. Throws ApiError on failure. */
export const getFixtures = async (signal?: AbortSignal): Promise<Fixture[]> => {
  const fixtures = await postJson<Fixture[]>(
    "GetFixtures",
    { todaysDate: getTodaysDate() },
    signal
  );

  return Array.isArray(fixtures) ? fixtures : [];
};

export const areFixturesInPlay = (fixtures: Fixture[]): boolean => {
  return fixtures.some(isInplay);
};

/**
 * Merges a freshly polled list into the list already on screen.
 *
 * Keyed by id, so a fixture missing from the update keeps its current values
 * instead of being dropped, and a fixture that is new to the update is added
 * rather than silently discarded. The previous version wrote to
 * `newState[-1]` whenever the poll returned a fixture the UI had not seen,
 * which appended a junk entry under a numeric "-1" key.
 */
export const updateFixtures = (
  updated: Fixture[],
  current: Fixture[]
): Fixture[] => {
  const merged = new Map(current.map((fixture) => [fixture.id, fixture]));

  updated.forEach((fixture) => merged.set(fixture.id, fixture));

  return Array.from(merged.values());
};
