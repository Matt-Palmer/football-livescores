import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const req = await request.json();

  const url = `https://api.sportmonks.com/v3/football/standings/seasons/${req.seasonId}?api_token=${process.env.SPORTMONKS_API_KEY}&include=group;details;participant;rule;`;

  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    cache: "no-store",
  };

  try {
    const result = await fetch(url, options);

    const { data } = await result.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("test");
  }
}
