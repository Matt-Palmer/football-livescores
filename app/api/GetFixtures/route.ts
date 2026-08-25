import { NextResponse } from "next/server";
import { fetchAll, toErrorResponse } from "@/services/Sportmonks";
import { Fixture } from "@/typings";

export async function POST(request: Request) {
  try {
    const { date, timeZone } = await request.json();

    if (!date) {
      return NextResponse.json({ error: "date is required." }, { status: 400 });
    }

    const fixtures = await fetchAll<Fixture>(`fixtures/date/${date}`, {
      include: "participants;scores;league;group;periods",
      timezone: timeZone,
    });

    return NextResponse.json(fixtures);
  } catch (error) {
    return toErrorResponse(error);
  }
}
