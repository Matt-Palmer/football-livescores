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
      <div className="columns-1 md:columns-2 xl:columns-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-lg bg-brand-surface animate-pulse h-[220px] mb-4 break-inside-avoid"
          ></div>
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
    <div className="columns-1 md:columns-2 xl:columns-3 gap-4">
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
