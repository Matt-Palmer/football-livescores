import React from "react";
import Link from "next/link";

import { StarIcon } from "@heroicons/react/24/outline";

import { isComplete, isHalfTime, isInplay } from "@/services/MatchStates";
import { formatFixtureDateOrTime } from "@/services/Date";
import { sportmonksStates } from "@/utils/Sportmonks/States";
import { Fixture } from "@/typings";

import FixtureParticipant from "./FixtureParticipant";

type Props = {
  fixture: Fixture;
};

function FixturesLeagueFixture({ fixture }: Props) {
  const { starting_at_timestamp, id } = fixture;

  const displayMatchStatus = () => {
    if (isHalfTime(fixture))
      return (
        <span className="text-[#ED3E42] text-xs">{getStateShortName()}</span>
      );

    if (isInplay(fixture)) {
      const currentPeriod = fixture.periods[fixture.periods.length - 1];

      return (
        <span className="text-[#ED3E42] text-xs">
          {currentPeriod ? currentPeriod.minutes : 0}
        </span>
      );
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
    <div className="mb-4">
      <div className="flex">
        <span className="py-2 px-2 md:px-4 flex items-center">
          <StarIcon width={15} height={15} color="#ffffff" />
        </span>
        <div className="w-[1px] bg-[#EFEF3E] opacity-40"></div>
        <div className="w-[50px] md:w-[70px] flex flex-col justify-center items-center font-light">
          <span className="hidden md:block text-xs opacity-70 mb-1">
            {formatFixtureDateOrTime(starting_at_timestamp, true)}
          </span>
          <span className="md:hidden text-xs opacity-70 mb-1">
            {formatFixtureDateOrTime(starting_at_timestamp, false)}
          </span>
          {displayMatchStatus()}
        </div>
        <div className="w-[1px] bg-[#EFEF3E] opacity-40"></div>
        <Link href={`/Fixture/${id}`} className="flex flex-1 overflow-hidden">
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
