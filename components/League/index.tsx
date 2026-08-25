"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getErrorMessage, isAbortError, postJson } from "@/services/Api";
import { Fixture } from "@/typings";
import { sportmonksCountries } from "@/utils/Sportmonks/Countries";
import Breadcrumb from "@/components/Shared/Breadcrumb";
import MatchCard from "@/components/Shared/MatchCard";
import LogoBadge from "@/components/Shared/LogoBadge";

type LeagueRoundResponse = {
  league: { id: number; name: string; image_path: string; country_id: number };
  round: { id: number; name: string };
  fixtures: Fixture[];
  previousRoundId: number | null;
  nextRoundId: number | null;
};

type LeagueComponentProps = {
  leagueId: string;
  roundId?: string;
};

function RoundNavLink({
  roundId,
  leagueId,
  direction,
}: {
  roundId: number | null;
  leagueId: string;
  direction: "previous" | "next";
}) {
  const label = direction === "previous" ? "‹" : "›";

  if (!roundId) {
    return <span className="px-3 py-1 text-xl opacity-30">{label}</span>;
  }

  return (
    <Link
      href={`/League/${leagueId}/Round/${roundId}`}
      className="px-3 py-1 text-xl hover:text-[#C9A15A]"
      aria-label={`Go to ${direction} round`}
    >
      {label}
    </Link>
  );
}

function LeagueComponent({ leagueId, roundId }: LeagueComponentProps) {
  const [data, setData] = useState<LeagueRoundResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Derived rather than set at the top of the effect: calling setState
  // synchronously in an effect body forces an extra render pass and trips
  // set-state-in-effect. Comparing keys instead means a leagueId/roundId
  // change flips isLoading true on the same render that changed it.
  const [settledFetchKey, setSettledFetchKey] = useState<string | null>(null);
  const fetchKey = `${leagueId}:${roundId ?? ""}`;
  const isLoading = settledFetchKey !== fetchKey;

  useEffect(() => {
    const controller = new AbortController();

    postJson<LeagueRoundResponse>(
      "League/Round",
      { leagueId, roundId },
      controller.signal
    )
      .then((response) => {
        setData(response);
        setError(null);
      })
      .catch((cause) => {
        if (isAbortError(cause)) return;

        setError(getErrorMessage(cause));
      })
      .finally(() => {
        if (!controller.signal.aborted) setSettledFetchKey(fetchKey);
      });

    return () => controller.abort();
  }, [leagueId, roundId, fetchKey]);

  const getCountryName = (countryId: number): string => {
    return sportmonksCountries.find((country) => country.id === countryId)
      ?.name ?? "";
  };

  if (error) {
    return (
      <main className="flex flex-col w-full px-4 mx-auto mb-16">
        <div className="text-center py-12">
          <p className="mb-2">Couldn&apos;t load this league.</p>
          <p className="text-sm text-brand-muted">{error}</p>
        </div>
      </main>
    );
  }

  if (isLoading || !data) {
    return (
      <main className="flex flex-col w-full px-4 mx-auto mb-16">
        <div className="max-w-[700px] m-auto w-full">
          <div className="h-[20px] w-1/3 mb-6 animate-pulse bg-[#152420]"></div>
          {Array.from({ length: 8 }).map((item, index) => (
            <div
              key={index}
              className="bg-[#152420] animate-pulse h-[48px] md:h-[52px] w-full mb-1"
            ></div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col w-full px-4 md:px-6 mx-auto mb-16">
      <div className="w-full max-w-[1200px] mx-auto">
        <Breadcrumb
          countryId={data.league.country_id}
          countryName={getCountryName(data.league.country_id)}
        />

        <div className="flex items-center justify-between my-6">
          <RoundNavLink
            roundId={data.previousRoundId}
            leagueId={leagueId}
            direction="previous"
          />

          <h1 className="flex items-center gap-2 text-lg md:text-xl text-center">
            <LogoBadge
              src={data.league.image_path}
              alt="Competition logo"
              className="h-[24px] w-[24px]"
              sizes="24px"
            />
            {data.league.name} / Round {data.round.name}
          </h1>

          <RoundNavLink
            roundId={data.nextRoundId}
            leagueId={leagueId}
            direction="next"
          />
        </div>

        {data.fixtures.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.fixtures.map((fixture) => (
              <MatchCard key={fixture.id} fixture={fixture} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-brand-muted">
            No fixtures in this round.
          </div>
        )}
      </div>
    </main>
  );
}

export default LeagueComponent;
