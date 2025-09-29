import React from "react";
import Link from "next/link";

import { StarIcon } from "@heroicons/react/24/outline";

import { isComplete, isHalfTime, isInplay } from "@/services/MatchStates";
import { sportmonksStates } from "@/utils/Sportmonks/States";
import { Fixture } from "@/typings";

import FixtureParticipant from "./FixtureParticipant";

import moment from "moment";

type Props = {
  fixture: Fixture;
};

function FixturesLeagueFixture({ fixture }: Props) {
  const {starting_at_timestamp, id } = fixture

  const displayMatchStatus = () => {
    if (isHalfTime(fixture))
      return (
        <span className="text-[#ED3E42] text-xs">{getStateShortName()}</span>
      );

    if (isInplay(fixture))
      return (
        <span className="text-[#ED3E42] text-xs">
          {fixture.periods[fixture.periods.length - 1] ? fixture.periods[fixture.periods.length - 1].minutes : 0}
        </span>
      );

    if (isComplete(fixture))
      return <span className="text-xs opacity-70">{getStateShortName()}</span>;

    return <span className="text-xs">-</span>;
  };

  const getStateShortName = () => {
    return sportmonksStates.find((state) => state.id === fixture.state_id)
      ?.short_name;
  };

  const displayDate = (timestamp: number, format: string) => {
    const date = new Date(timestamp * 1000);

    const today = moment(Date.now()).format(format);
    const formattedDate = moment(date).format(format);

    if (today === formattedDate) return moment(date).format("HH:mm");

    return formattedDate;
  };

  const displayShortDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);

    const today = moment(Date.now()).format("DD/MM");
    const formattedDate = moment(date).format("DD/MM");

    if (today === formattedDate) return moment(date).format("HH:mm");

    return formattedDate;
  };

  return (
    <div key={id} className="mb-4">
      <div className="flex">
        <span className="py-2 px-2 md:px-4 flex items-center">
          <StarIcon width={15} height={15} color="#ffffff" />
        </span>
        <div className="w-[1px] bg-[#EFEF3E] opacity-40"></div>
        <div className="w-[50px] md:w-[70px] flex flex-col justify-center items-center font-light">
          <span className="hidden md:block text-xs opacity-70 mb-1">
            {displayDate(starting_at_timestamp, "DD/MM/YY")}
          </span>
          <span className="md:hidden text-xs opacity-70 mb-1">
            {displayDate(starting_at_timestamp, "DD/MM")}
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
