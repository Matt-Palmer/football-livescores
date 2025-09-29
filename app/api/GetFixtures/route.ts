import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const req = await request.json();

  // const url = `https://api.sportmonks.com/v3/football/fixtures/date/2023-09-30?api_token=${process.env.SPORTMONKS_API_KEY}&include=participants;scores;league;group;periods;`;
  const url = `https://api.sportmonks.com/v3/football/fixtures/date/${req.todaysDate}?api_token=${process.env.SPORTMONKS_API_KEY}&include=participants;scores;league;group;periods;`;

  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    cache: "no-store",
  };

  const response = await fetchFixtures(url, options, []);

  if (response) return NextResponse.json(response);

  return NextResponse.json([]);
}

const fetchFixtures: any = async (
  url: string,
  options: RequestInit,
  prevResponse: any
) => {
  try {
    const result = await fetch(url, options);

    const { data, pagination } = await result.json();

    const response = [...prevResponse, ...data];

    if (pagination.has_more) {
      const page = pagination.current_page + 1;

      return await fetchFixtures(url + "&page=" + page, options, response);
    }

    return response;
  } catch (error) {
    console.error("test");
  }
};
