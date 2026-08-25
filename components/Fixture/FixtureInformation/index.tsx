import Image from "next/image";
import Link from "next/link";

import { Fixture, Participant } from "@/typings";
import { sportmonksCountries } from "@/utils/Sportmonks/Countries";
import Breadcrumb from "@/components/Shared/Breadcrumb";
import ScoreDisplay from "./ScoreDisplay";

type FixtureInformationProps = {
  fixture: Fixture;
}

function FixtureInformation({fixture}: FixtureInformationProps) {
  const getCountryName = (): string => {
    const countryObj = sportmonksCountries.find(
      (country) => country.id === fixture.league.country_id
    );

    return countryObj ? countryObj.name : "";
  };

  const getLeagueLabel = (): string => {
    const groupName = fixture.group ? " / " + fixture.group.name : "";
    const roundName = fixture.round ? " / Round " + fixture.round.name : "";

    return fixture.league.name + groupName + roundName;
  };

  const getTeam = (location: string): Participant | undefined => {
    return fixture.participants.find(
      (participant: Participant) => participant.meta.location === location
    );
  };

  const renderTeam = (location: string) => {
    const team = getTeam(location);

    return (
      <Link
        href={`/Team/${team?.id}`}
        className="flex flex-col items-center gap-2 flex-1"
      >
        <div
          className={`relative h-[60px] w-[60px] md:h-[90px] md:w-[90px] lg:h-[120px] lg:w-[120px]`}
        >
          <Image
            src={team?.image_path || "/default-team-logo.svg"}
            fill={true}
            alt={`${location === "home" ? "Home" : "Away"} team logo`}
            style={{ objectFit: "cover" }}
            sizes={`(max-width: 1200px) 120px, 120px`}
          />
        </div>
        <span className="text-sm md:text-base text-center hover:text-[#EFEF3E]">
          {team?.name}
        </span>
      </Link>
    );
  };

  return (
    <div key={fixture.id}>
      <div className="mb-4">
        <Breadcrumb
          countryId={fixture.league.country_id}
          countryName={getCountryName()}
          league={{
            id: fixture.league.id,
            roundId: fixture.round?.id,
            label: getLeagueLabel(),
            imagePath: fixture.league.image_path,
          }}
        />
      </div>
      <div className="flex justify-center items-start">
        {renderTeam("home")}

        <ScoreDisplay fixture={fixture} />

        {renderTeam("away")}
      </div>
    </div>
  );
}

export default FixtureInformation;
