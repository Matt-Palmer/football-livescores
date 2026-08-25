"use client";

import { useFixturesContext } from "@/hooks/useFixturesContext";
import { useFavouritesContext } from "@/hooks/useFavouritesContext";
import { useSelectedFixtureContext } from "@/hooks/useSelectedFixtureContext";
import { getDayStripLabel } from "@/services/Date";
import { buildLeaguePanels } from "@/components/Fixtures/LeagueDashboard/buildLeaguePanels";
import LeaguePanel from "@/components/Fixtures/LeagueDashboard/LeaguePanel";
import DateStrip from "@/components/Fixtures/DateStrip";

function Sidebar() {
  const { fixtures, selectedDate, isToday, isLoading, error, retry } =
    useFixturesContext();
  const { isFavourite } = useFavouritesContext();
  const { selectedFixtureId } = useSelectedFixtureContext();

  const renderBody = () => {
    if (error) {
      return (
        <div className="text-center py-8 px-3">
          <p className="text-sm mb-2">Couldn&apos;t load fixtures.</p>
          <button
            onClick={retry}
            className="text-xs bg-brand-gold text-black px-4 py-1.5 rounded-full"
          >
            Try again
          </button>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex flex-col gap-2 px-1">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-lg bg-brand-surface animate-pulse h-[120px]"
            ></div>
          ))}
        </div>
      );
    }

    const panels = buildLeaguePanels(fixtures, isFavourite);

    if (panels.length === 0) {
      return (
        <div className="text-center py-8 px-3 text-sm text-brand-muted">
          {isToday
            ? "No fixtures today."
            : `No fixtures on ${getDayStripLabel(selectedDate)}.`}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-3 px-1">
        {panels.map((panel) => (
          <LeaguePanel
            key={panel.key}
            leagueName={panel.leagueName}
            leagueImage={panel.leagueImage}
            fixtures={panel.fixtures}
            activeFixtureId={selectedFixtureId ?? undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="h-full overflow-y-auto px-2 py-3">
      <div className="px-1 mb-2">
        <DateStrip />
      </div>
      {renderBody()}
    </div>
  );
}

export default Sidebar;
