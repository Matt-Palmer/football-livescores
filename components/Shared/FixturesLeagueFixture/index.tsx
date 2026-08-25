import React from "react";
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

import FixtureParticipant from "./FixtureParticipant";
import LiveIndicator from "@/components/Shared/LiveIndicator";

type Props = {
  fixture: Fixture;
  isActive?: boolean;
};

function FixturesLeagueFixture({ fixture, isActive }: Props) {
  const { starting_at_timestamp, id } = fixture;
  const { isFavourite, toggleFavourite } = useFavouritesContext();
  const { openFixture } = useSelectedFixtureContext();
  const favourited = isFavourite(id);

  const displayMatchStatus = () => {
    if (isHalfTime(fixture)) return <LiveIndicator minute={null} label={getStateShortName()} />;

    if (isInplay(fixture)) {
      const currentPeriod = fixture.periods[fixture.periods.length - 1];

      return <LiveIndicator minute={currentPeriod ? currentPeriod.minutes : 0} />;
    }

    if (isComplete(fixture))
      return <span className="text-xs opacity-70">{getStateShortName()}</span>;

    return <span className="text-xs">-</span>;
  };

  const getStateShortName = () => {
    return sportmonksStates.find((state) => state.id === fixture.state_id)
      ?.short_name;
  };

  return (
    <div className="mb-2">
      <div
        className={`flex items-stretch rounded-lg hover:bg-brand-surfaceHover ${
          isActive ? "bg-brand-surfaceHover ring-1 ring-brand-gold/60" : ""
        }`}
      >
        <button
          type="button"
          onClick={() => toggleFavourite(id)}
          aria-pressed={favourited}
          aria-label={
            favourited ? "Remove from favourites" : "Add to favourites"
          }
          className="py-2 px-2 md:px-4 flex items-center"
        >
          {favourited ? (
            <StarIconSolid width={15} height={15} color="#C9A15A" />
          ) : (
            <StarIconOutline width={15} height={15} color="#8FA096" />
          )}
        </button>
        <div className="w-[1px] bg-brand-border"></div>
        <div className="w-[50px] md:w-[70px] flex flex-col justify-center items-center font-light">
          <span className="hidden md:block text-xs text-brand-muted mb-1">
            {formatFixtureDateOrTime(starting_at_timestamp, true)}
          </span>
          <span className="md:hidden text-xs text-brand-muted mb-1">
            {formatFixtureDateOrTime(starting_at_timestamp, false)}
          </span>
          {displayMatchStatus()}
        </div>
        <div className="w-[1px] bg-brand-border"></div>
        <Link
          href={`/Fixture/${id}`}
          onClick={(event) => {
            if (!isPlainLeftClick(event)) return;
            event.preventDefault();
            openFixture(id);
          }}
          className="flex flex-1 overflow-hidden"
        >
          <div className="flex-1">
            <FixtureParticipant fixture={fixture} location={"home"} />
            <FixtureParticipant fixture={fixture} location={"away"} />
          </div>
        </Link>
      </div>
    </div>
  );
}

export default FixturesLeagueFixture;
