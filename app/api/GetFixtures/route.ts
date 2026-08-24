import { NextResponse } from "next/server";
import { fetchAll, toErrorResponse } from "@/services/Sportmonks";
import { Fixture } from "@/typings";

export async function POST(request: Request) {
  try {
    const { todaysDate, timeZone } = await request.json();

    if (!todaysDate) {
      return NextResponse.json({ error: "todaysDate is required." }, { status: 400 });
    }

    const fixtures = await fetchAll<Fixture>(`fixtures/date/${todaysDate}`, {
      include: "participants;scores;league;group;periods",
      timezone: timeZone,
    });

    return NextResponse.json(fixtures);
  } catch (error) {
    return toErrorResponse(error);
  }
}
