"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { getErrorMessage, isAbortError, postJson } from "@/services/Api";
import { Fixture, League } from "@/typings";
import { sportmonksCountries } from "@/utils/Sportmonks/Countries";
import Breadcrumb from "@/components/Shared/Breadcrumb";
import MatchCard from "@/components/Shared/MatchCard";

type TeamResponse = {
  team: { id: number; name: string; image_path: string };
  league: League | null;
  fixtures: Fixture[];
};

type TeamComponentProps = {
  teamId: string;
};

function TeamComponent({ teamId }: TeamComponentProps) {
  const [data, setData] = useState<TeamResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Derived rather than set at the top of the effect — see the League
  // component for why (avoids the set-state-in-effect cascading render).
  const [settledFetchKey, setSettledFetchKey] = useState<string | null>(null);
  const isLoading = settledFetchKey !== teamId;

  useEffect(() => {
    const controller = new AbortController();

    postJson<TeamResponse>("Team", { teamId }, controller.signal)
      .then((response) => {
        setData(response);
        setError(null);
      })
      .catch((cause) => {
        if (isAbortError(cause)) return;

        setError(getErrorMessage(cause));
      })
      .finally(() => {
        if (!controller.signal.aborted) setSettledFetchKey(teamId);
      });

    return () => controller.abort();
  }, [teamId]);

  if (error) {
    return (
      <main className="flex flex-col w-full px-4 mx-auto mb-16">
        <div className="text-center py-12">
          <p className="mb-2">Couldn&apos;t load this team.</p>
          <p className="text-sm text-brand-muted">{error}</p>
        </div>
      </main>
    );
  }

  if (isLoading || !data) {
    return (
      <main className="flex flex-col w-full px-4 mx-auto mb-16">
        <div className="max-w-[700px] m-auto w-full">
          <div className="h-[60px] w-[60px] rounded-full mx-auto mb-6 animate-pulse bg-[#152420]"></div>
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

  const countryName = data.league
    ? sportmonksCountries.find((country) => country.id === data.league!.country_id)
        ?.name ?? ""
    : "";

  return (
    <main className="flex flex-col w-full px-4 md:px-6 mx-auto mb-16">
      <div className="w-full max-w-[1200px] mx-auto">
        {data.league ? (
          <Breadcrumb
            countryId={data.league.country_id}
            countryName={countryName}
            league={{
              id: data.league.id,
              label: data.league.name,
              imagePath: data.league.image_path,
            }}
          />
        ) : null}

        <div className="flex flex-col items-center my-6">
          <div className="relative h-[60px] w-[60px] md:h-[80px] md:w-[80px] mb-2">
            <Image
              src={data.team.image_path || "/default-team-logo.svg"}
              fill={true}
              alt={`${data.team.name} logo`}
              style={{ objectFit: "cover" }}
              sizes="80px"
            />
          </div>
          <h1 className="text-lg md:text-xl">{data.team.name}</h1>
        </div>

        {data.fixtures.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {data.fixtures.map((fixture) => (
              <MatchCard key={fixture.id} fixture={fixture} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-brand-muted">
            No fixtures found for this team.
          </div>
        )}
      </div>
    </main>
  );
}

export default TeamComponent;
