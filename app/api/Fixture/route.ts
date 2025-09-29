import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const req = await request.json();

  const url: string = `https://api.sportmonks.com/v3/football/fixtures/${req.id}?api_token=${process.env.SPORTMONKS_API_KEY}&include=scores;round;stage;group;league;venue;state;lineups;events;timeline;statistics;periods;participants;formations;metadata;`;

  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    cache: "no-store",
  };

  try {
    const result: Response = await fetch(url, options);

    const { data } = await result.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.error();
  }
}
