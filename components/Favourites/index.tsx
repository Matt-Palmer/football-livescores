"use client";

import { useEffect, useState } from "react";

import { getErrorMessage, isAbortError, postJson } from "@/services/Api";
import { Fixture } from "@/typings";
import { useFavouritesContext } from "@/hooks/useFavouritesContext";
import { buildLeaguePanels } from "@/components/Fixtures/LeagueDashboard/buildLeaguePanels";
import LogoBadge from "@/components/Shared/LogoBadge";
import MatchCard from "@/components/Shared/MatchCard";

function FavouritesComponent() {
  const { favouriteIds, isFavourite } = useFavouritesContext();
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Keyed on the sorted id list rather than the array reference: two
  // renders with the same favourites should not refetch just because the
  // array was rebuilt.
  const idsKey = [...favouriteIds].sort((a, b) => a - b).join(",");

  const [settledFetchKey, setSettledFetchKey] = useState<string | null>(null);
  const isLoading = settledFetchKey !== idsKey;

  useEffect(() => {
    // Nothing to fetch, and the empty-favourites message renders ahead of
    // the loading/fixtures branches below regardless of settledFetchKey, so
    // there is no state to synchronise here.
    if (favouriteIds.length === 0) return;

    const controller = new AbortController();

    postJson<Fixture[]>(
      "Fixtures/ByIds",
      { ids: favouriteIds },
      controller.signal
    )
      .then((response) => {
        setFixtures(response);
        setError(null);
      })
      .catch((cause) => {
        if (isAbortError(cause)) return;

        setError(getErrorMessage(cause));
      })
      .finally(() => {
        if (!controller.signal.aborted) setSettledFetchKey(idsKey);
      });

    return () => controller.abort();
  }, [favouriteIds, idsKey]);

  const panels = buildLeaguePanels(fixtures, isFavourite);

  return (
    <main className="px-4 md:px-6 mb-16">
      <div className="w-full max-w-[1200px] mx-auto">
        <h1 className="text-xl md:text-2xl mb-6">Favourites</h1>

        {error ? (
          <div className="text-center py-12">
            <p className="mb-2">Couldn&apos;t load your favourites.</p>
            <p className="text-sm text-brand-muted">{error}</p>
          </div>
        ) : favouriteIds.length === 0 ? (
          <div className="text-center py-12 text-brand-muted">
            No favourites yet. Tap the star on any match to pin it here.
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="rounded-lg bg-brand-surface animate-pulse h-[90px]"
              ></div>
            ))}
          </div>
        ) : panels.length === 0 ? (
          <div className="text-center py-12 text-brand-muted">
            None of your favourited matches could be found.
          </div>
        ) : (
          panels.map((panel) => (
            <div key={panel.key} className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <LogoBadge
                  src={panel.leagueImage}
                  alt="Competition logo"
                  className="h-[22px] w-[22px]"
                  sizes="22px"
                />
                <h2 className="md:text-lg">{panel.leagueName}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {panel.fixtures.map((fixture) => (
                  <MatchCard key={fixture.id} fixture={fixture} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}

export default FavouritesComponent;
