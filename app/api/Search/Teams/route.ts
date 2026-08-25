import { NextResponse } from "next/server";
import { fetchAll, toErrorResponse } from "@/services/Sportmonks";

type TeamSearchResult = {
  id: number;
  name: string;
  image_path: string;
};

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (typeof query !== "string" || query.trim().length < 2) {
      return NextResponse.json([]);
    }

    const teams = await fetchAll<TeamSearchResult>(
      `teams/search/${encodeURIComponent(query.trim())}`
    );

    return NextResponse.json(teams.slice(0, 8));
  } catch (error) {
    return toErrorResponse(error);
  }
}
