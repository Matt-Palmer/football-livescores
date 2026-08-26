"use client";

import { useFixturesContext } from "@/hooks/useFixturesContext";
import { useFavouritesContext } from "@/hooks/useFavouritesContext";
import { getDayStripLabel } from "@/services/Date";

import LeaguePanel from "./LeaguePanel";
import { buildLeaguePanels } from "./buildLeaguePanels";

function LeagueDashboard() {
  const { fixtures, selectedDate, isToday, isLoading, error, retry } =
    useFixturesContext();
  const { isFavourite } = useFavouritesContext();

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="mb-2">
          Couldn&apos;t load {isToday ? "today's" : "this day's"} fixtures.
        </p>
        <p className="text-sm text-brand-muted mb-6">{error}</p>
        <button
          onClick={retry}
          className="bg-brand-gold text-black px-6 py-2 rounded-full"
        >
          Try again
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index}>
            <div className="h-[22px] w-[160px] mb-3 rounded bg-brand-surface animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, cardIndex) => (
                <div
                  key={cardIndex}
                  className="rounded-lg bg-brand-surface animate-pulse h-[140px]"
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const panels = buildLeaguePanels(fixtures, isFavourite);

  if (panels.length === 0) {
    return (
      <div className="text-center py-12 text-brand-muted">
        {isToday
          ? "No fixtures today."
          : `No fixtures on ${getDayStripLabel(selectedDate)}.`}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {panels.map((panel) => (
        <LeaguePanel
          key={panel.key}
          leagueName={panel.leagueName}
          leagueImage={panel.leagueImage}
          fixtures={panel.fixtures}
        />
      ))}
    </div>
  );
}

export default LeagueDashboard;
