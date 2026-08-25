import { NextResponse } from "next/server";
import { fetchOne, SportmonksError, toErrorResponse } from "@/services/Sportmonks";
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

/** The round to show: the requested one, or the season's current round. */
const resolveRoundId = async (
  leagueId: string,
  roundId: string | undefined
): Promise<number> => {
  if (roundId) return Number(roundId);

  const league = await fetchOne<LeagueWithSeason>(`leagues/${leagueId}`, {
    include: "currentSeason",
  });

  const seasonId = league.currentseason?.id;

  if (!seasonId) {
    throw new SportmonksError("This league has no current season.", 404);
  }

  const rounds = await fetchOne<RoundSummary[]>(`rounds/seasons/${seasonId}`);
  const currentRound = rounds.find((round) => round.is_current);

  if (!currentRound) {
    throw new SportmonksError("This league has no current round.", 404);
  }

  return currentRound.id;
};

export async function POST(request: Request) {
  try {
    const { leagueId, roundId, timeZone } = await request.json();

    if (!leagueId) {
      return NextResponse.json({ error: "leagueId is required." }, { status: 400 });
    }

    const [league, resolvedRoundId] = await Promise.all([
      fetchOne<League>(`leagues/${leagueId}`, { timezone: timeZone }),
      resolveRoundId(leagueId, roundId),
    ]);

    const round = await fetchOne<RoundWithFixtures>(`rounds/${resolvedRoundId}`, {
      include: FIXTURE_INCLUDE,
      timezone: timeZone,
    });

    // Adjacent rounds, in kickoff order, for the prev/next controls.
    const seasonRounds = await fetchOne<RoundSummary[]>(
      `rounds/seasons/${round.season_id}`
    );

    const sortedRounds = [...seasonRounds].sort((a, b) =>
      a.starting_at < b.starting_at ? -1 : a.starting_at > b.starting_at ? 1 : 0
    );
    const roundIndex = sortedRounds.findIndex((r) => r.id === round.id);

    return NextResponse.json({
      league: {
        id: league.id,
        name: league.name,
        image_path: league.image_path,
        country_id: league.country_id,
      },
      round: { id: round.id, name: round.name },
      fixtures: (round.fixtures ?? []).sort(
        (a, b) => a.starting_at_timestamp - b.starting_at_timestamp
      ),
      previousRoundId:
        roundIndex > 0 ? sortedRounds[roundIndex - 1].id : null,
      nextRoundId:
        roundIndex >= 0 && roundIndex < sortedRounds.length - 1
          ? sortedRounds[roundIndex + 1].id
          : null,
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
