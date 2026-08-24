import { NextResponse } from "next/server";
import { fetchOne, toErrorResponse } from "@/services/Sportmonks";
import { Fixture } from "@/typings";

export async function POST(request: Request) {
  try {
    const { home_team_id, away_team_id, timeZone } = await request.json();

    if (!home_team_id || !away_team_id) {
      return NextResponse.json(
        { error: "home_team_id and away_team_id are required." },
        { status: 400 }
      );
    }

    const fixtures = await fetchOne<Fixture[]>(
      `fixtures/head-to-head/${home_team_id}/${away_team_id}`,
      {
        include: "participants;scores;league;group;periods",
        timezone: timeZone,
      }
    );

    return NextResponse.json(fixtures ?? []);
  } catch (error) {
    return toErrorResponse(error);
  }
}
