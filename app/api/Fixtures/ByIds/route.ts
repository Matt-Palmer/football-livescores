import { NextResponse } from "next/server";
import { fetchAll, toErrorResponse } from "@/services/Sportmonks";
import { Fixture } from "@/typings";

export async function POST(request: Request) {
  try {
    const { ids, timeZone } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json([]);
    }

    const fixtures = await fetchAll<Fixture>(
      `fixtures/multi/${ids.join(",")}`,
      {
        include: "participants;scores;league;group;periods",
        timezone: timeZone,
      }
    );

    return NextResponse.json(fixtures);
  } catch (error) {
    return toErrorResponse(error);
  }
}
