import { NextResponse } from "next/server";
import { fetchOne, toErrorResponse } from "@/services/Sportmonks";
import { Fixture, League } from "@/typings";

type TeamWithActiveSeasons = {
  id: number;
  name: string;
  image_path: string;
  activeseasons?: { id: number; league_id: number }[];
};

// The schedules endpoint nests fixtures under stage -> round, and allows no
// further includes, so `league`/`group`/`round` never come back on the
// fixture objects — only the shared row components (which don't touch those
// fields) are used to render this page.
type ScheduleStage = {
  rounds: { fixtures: (Fixture & { periods?: Fixture["periods"] })[] }[];
};

const flattenFixtures = (stages: ScheduleStage[]): Fixture[] => {
  const fixtures: Fixture[] = [];

  for (const stage of stages) {
    for (const round of stage.rounds ?? []) {
      for (const fixture of round.fixtures ?? []) {
        // The schedules endpoint sends `periods: null` instead of `[]`; every
        // consumer of Fixture.periods assumes an array.
        fixtures.push({ ...fixture, periods: fixture.periods ?? [] });
      }
    }
  }

  return fixtures;
};

export async function POST(request: Request) {
  try {
    const { teamId, timeZone } = await request.json();

    if (!teamId) {
      return NextResponse.json({ error: "teamId is required." }, { status: 400 });
    }

    const team = await fetchOne<TeamWithActiveSeasons>(`teams/${teamId}`, {
      include: "activeseasons",
      timezone: timeZone,
    });

    const activeSeasons = team.activeseasons ?? [];

    const seasonFixtures = await Promise.all(
      activeSeasons.map((season) =>
        fetchOne<ScheduleStage[]>(
          `schedules/seasons/${season.id}/teams/${teamId}`
        ).catch(() => [])
      )
    );

    const fixtures = seasonFixtures
      .flatMap(flattenFixtures)
      .sort((a, b) => a.starting_at_timestamp - b.starting_at_timestamp);

    const league = activeSeasons.length
      ? await fetchOne<League>(`leagues/${activeSeasons[0].league_id}`, {
          timezone: timeZone,
        }).catch(() => null)
      : null;

    return NextResponse.json({
      team: { id: team.id, name: team.name, image_path: team.image_path },
      league,
      fixtures,
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
