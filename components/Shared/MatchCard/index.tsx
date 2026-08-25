"use client";

import Link from "next/link";
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

import { isComplete, isHalfTime, isInplay } from "@/services/MatchStates";
import { formatFixtureDateOrTime } from "@/services/Date";
import { sportmonksStates } from "@/utils/Sportmonks/States";
import { useFavouritesContext } from "@/hooks/useFavouritesContext";
import { useSelectedFixtureContext } from "@/hooks/useSelectedFixtureContext";
import { isPlainLeftClick } from "@/utils/isPlainLeftClick";
import { Fixture } from "@/typings";
import LiveIndicator from "@/components/Shared/LiveIndicator";

import FixtureParticipant from "@/components/Shared/FixturesLeagueFixture/FixtureParticipant";

type Props = {
  fixture: Fixture;
};

function MatchCard({ fixture }: Props) {
  const { starting_at_timestamp, id } = fixture;
  const { isFavourite, toggleFavourite } = useFavouritesContext();
  const { openFixture } = useSelectedFixtureContext();
  const favourited = isFavourite(id);

  const getStateShortName = () =>
    sportmonksStates.find((state) => state.id === fixture.state_id)
      ?.short_name;

  const displayStatus = () => {
    if (isHalfTime(fixture))
      return <LiveIndicator minute={null} label={getStateShortName()} />;

    if (isInplay(fixture)) {
      const currentPeriod = fixture.periods[fixture.periods.length - 1];

      return (
        <LiveIndicator minute={currentPeriod ? currentPeriod.minutes : 0} />
      );
    }

    if (isComplete(fixture))
      return (
        <span className="text-xs text-brand-muted">
          {getStateShortName()}
        </span>
      );

    return (
      <span className="text-xs text-brand-muted">
        {formatFixtureDateOrTime(starting_at_timestamp, true)}
      </span>
    );
  };

  return (
    <div className="relative rounded-lg border border-brand-border bg-brand-surface hover:border-brand-gold/50 hover:bg-brand-surfaceHover transition-colors">
      <Link
        href={`/Fixture/${id}`}
        onClick={(event) => {
          if (!isPlainLeftClick(event)) return;
          event.preventDefault();
          openFixture(id);
        }}
        className="block p-3"
      >
        <div className="flex items-center justify-between mb-2 pr-6">
          {displayStatus()}
        </div>
        <div className="flex flex-col gap-1">
          <FixtureParticipant fixture={fixture} location="home" />
          <FixtureParticipant fixture={fixture} location="away" />
        </div>
      </Link>

      <button
        type="button"
        onClick={() => toggleFavourite(id)}
        aria-pressed={favourited}
        aria-label={favourited ? "Remove from favourites" : "Add to favourites"}
        className="absolute top-3 right-3 p-0.5"
      >
        {favourited ? (
          <StarIconSolid width={15} height={15} color="#C9A15A" />
        ) : (
          <StarIconOutline width={15} height={15} color="#8FA096" />
        )}
      </button>
    </div>
  );
}

export default MatchCard;
