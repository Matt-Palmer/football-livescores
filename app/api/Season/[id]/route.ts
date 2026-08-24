import { NextResponse } from "next/server";
import { fetchOne, toErrorResponse } from "@/services/Sportmonks";
import { Standing } from "@/typings";

export async function POST(request: Request) {
  try {
    const { seasonId } = await request.json();

    if (!seasonId) {
      return NextResponse.json({ error: "seasonId is required." }, { status: 400 });
    }

    const standings = await fetchOne<Standing[]>(
      `standings/seasons/${seasonId}`,
      { include: "group;details;participant;rule" }
    );

    return NextResponse.json(standings ?? []);
  } catch (error) {
    return toErrorResponse(error);
  }
}
