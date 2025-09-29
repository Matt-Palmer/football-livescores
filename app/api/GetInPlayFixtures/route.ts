import { NextResponse } from "next/server";

export async function GET() {
  const url = `https://api.sportmonks.com/v3/football/livescores/inplay?api_token=${process.env.SPORTMONKS_API_KEY}&include=participants;scores;league;periods;group;`;

  const options = {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  };

  try {
    const result = await fetch(url, options);

    const { data } = await result.json();

    if (!data) return NextResponse.json([]);

    return NextResponse.json(data);
  } catch (error) {
    console.error("test");
  }
}
