import { NextResponse } from "next/server";
import { fetchOne, toErrorResponse } from "@/services/Sportmonks";
import { Fixture } from "@/typings";

export async function POST(request: Request) {
  try {
    const { id, timeZone } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "id is required." }, { status: 400 });
    }

    const fixture = await fetchOne<Fixture>(`fixtures/${id}`, {
      include:
        "scores;round;stage;group;league;venue;state;lineups;events;timeline;statistics;periods;participants;formations;metadata",
      timezone: timeZone,
    });

    return NextResponse.json(fixture);
  } catch (error) {
    return toErrorResponse(error);
  }
}
