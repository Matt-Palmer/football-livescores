"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getErrorMessage, isAbortError, postJson } from "@/services/Api";
import { Fixture } from "@/typings";
import { sportmonksCountries } from "@/utils/Sportmonks/Countries";
import FixturesLeagueFixture from "@/components/Shared/FixturesLeagueFixture";
import LogoBadge from "@/components/Shared/LogoBadge";

type CountryLeague = {
  id: number;
  name: string;
  image_path: string;
  fixtures: Fixture[];
};

type CountryComponentProps = {
  countryId: string;
};

function CountryComponent({ countryId }: CountryComponentProps) {
  const [leagues, setLeagues] = useState<CountryLeague[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Derived rather than set at the top of the effect — see the League
  // component for why (avoids the set-state-in-effect cascading render).
  const [settledFetchKey, setSettledFetchKey] = useState<string | null>(null);
  const isLoading = settledFetchKey !== countryId;

  useEffect(() => {
    const controller = new AbortController();

    postJson<CountryLeague[]>(
      "Country/Leagues",
      { countryId },
      controller.signal
    )
      .then((response) => {
        setLeagues(Array.isArray(response) ? response : []);
        setError(null);
      })
      .catch((cause) => {
        if (isAbortError(cause)) return;

        setError(getErrorMessage(cause));
      })
      .finally(() => {
        if (!controller.signal.aborted) setSettledFetchKey(countryId);
      });

    return () => controller.abort();
  }, [countryId]);

  const countryName =
    sportmonksCountries.find((country) => `${country.id}` === countryId)
      ?.name ?? "";

  return (
    <main className="flex flex-col w-full px-4 mx-auto mb-16">
      <div className="w-full max-w-[700px] mx-auto">
        <h1 className="text-xl md:text-2xl mb-6">{countryName}</h1>

        {error ? (
          <div className="text-center py-12">
            <p className="mb-2">Couldn&apos;t load leagues for this country.</p>
            <p className="text-sm text-[rgba(255,255,255,0.6)]">{error}</p>
          </div>
        ) : isLoading ? (
          <div>
            <div className="h-[20px] w-1/3 mb-4 animate-pulse bg-[#3f576c]"></div>
            {Array.from({ length: 6 }).map((item, index) => (
              <div
                key={index}
                className="bg-[#3f576c] animate-pulse h-[48px] md:h-[52px] w-full mb-1"
              ></div>
            ))}
          </div>
        ) : leagues.length > 0 ? (
          leagues.map((league) => (
            <div key={league.id} className="mb-8">
              <Link
                href={`/League/${league.id}`}
                className="flex items-center gap-4 mb-2 hover:text-[#EFEF3E]"
              >
                <LogoBadge
                  src={league.image_path}
                  alt="Competition logo"
                  className="h-[25px] w-[25px]"
                  sizes="25px"
                />
                <h2 className="md:text-lg">{league.name}</h2>
              </Link>

              {league.fixtures.map((fixture) => (
                <FixturesLeagueFixture key={fixture.id} fixture={fixture} />
              ))}
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-[rgba(255,255,255,0.6)]">
            No leagues with upcoming fixtures right now.
          </div>
        )}
      </div>
    </main>
  );
}

export default CountryComponent;
