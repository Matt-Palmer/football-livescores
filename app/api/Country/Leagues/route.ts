import { NextResponse } from "next/server";
import { fetchAll, fetchOne, toErrorResponse } from "@/services/Sportmonks";
import { isComplete, neverKickedOff } from "@/services/MatchStates";
import { Fixture, League } from "@/typings";

type LeagueWithSeason = League & {
  currentseason?: { id: number };
};

type RoundSummary = {
  id: number;
  name: string;
  season_id: number;
  starting_at: string;
  is_current: boolean;
};

type RoundWithFixtures = RoundSummary & {
  fixtures: Fixture[];
};

const FIXTURE_INCLUDE =
  "fixtures.participants;fixtures.scores;fixtures.periods;fixtures.league;fixtures.group";

/**
 * A league's current-round fixtures, plus anything left unplayed from the
 * previous round (postponed/rescheduled stragglers). Empty for a league with
 * no current season/round, or one this API key can't reach — either way
 * there's nothing to show, so the caller just hides it rather than the whole
 * country page failing over one league.
 */
const getLeagueFixtures = async (
  league: League,
  timeZone: string | undefined
): Promise<Fixture[]> => {
  try {
    const leagueWithSeason = await fetchOne<LeagueWithSeason>(
      `leagues/${league.id}`,
      { include: "currentSeason" }
    );

    const seasonId = leagueWithSeason.currentseason?.id;

    if (!seasonId) return [];

    const seasonRounds = await fetchOne<RoundSummary[]>(
      `rounds/seasons/${seasonId}`
    );

    const sortedRounds = [...seasonRounds].sort((a, b) =>
      a.starting_at < b.starting_at ? -1 : a.starting_at > b.starting_at ? 1 : 0
    );
    const currentIndex = sortedRounds.findIndex((round) => round.is_current);

    if (currentIndex === -1) return [];

    const currentRoundId = sortedRounds[currentIndex].id;
    const previousRoundId =
      currentIndex > 0 ? sortedRounds[currentIndex - 1].id : null;

    const roundIds = [currentRoundId, ...(previousRoundId ? [previousRoundId] : [])];

    const rounds = await Promise.all(
      roundIds.map((id) =>
        fetchOne<RoundWithFixtures>(`rounds/${id}`, {
          include: FIXTURE_INCLUDE,
          timezone: timeZone,
        })
      )
    );

    const [currentRound, previousRound] = rounds;

    const stragglers = (previousRound?.fixtures ?? []).filter(
      (fixture) => neverKickedOff(fixture) || !isComplete(fixture)
    );

    return [...stragglers, ...(currentRound.fixtures ?? [])].sort(
      (a, b) => a.starting_at_timestamp - b.starting_at_timestamp
    );
  } catch {
    return [];
  }
};

export async function POST(request: Request) {
  try {
    const { countryId, timeZone } = await request.json();

    if (!countryId) {
      return NextResponse.json({ error: "countryId is required." }, { status: 400 });
    }

    const leagues = await fetchAll<League>(`leagues/countries/${countryId}`, {
      timezone: timeZone,
    });

    const leaguesWithFixtures = await Promise.all(
      leagues.map(async (league) => ({
        id: league.id,
        name: league.name,
        image_path: league.image_path,
        fixtures: await getLeagueFixtures(league, timeZone),
      }))
    );

    return NextResponse.json(
      leaguesWithFixtures.filter((league) => league.fixtures.length > 0)
    );
  } catch (error) {
    return toErrorResponse(error);
  }
}
