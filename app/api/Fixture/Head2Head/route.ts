import { NextResponse } from "next/server";

var _ = require("lodash");

export async function POST(request: Request) {
  const req = await request.json();

  const url = `https://api.sportmonks.com/v3/football/fixtures/head-to-head/${req.home_team_id}/${req.away_team_id}?api_token=${process.env.SPORTMONKS_API_KEY}&include=participants;scores;league;group;periods;`;

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  };

  try {
    const result = await fetch(url, options);

    const { data } = await result.json();

    if (data) return NextResponse.json(data);

    return NextResponse.json([]);
  } catch (error) {
    console.error(error);
  }
}
