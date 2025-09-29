import Image from "next/image";

import { Fixture, Participant } from "@/typings";
import { sportmonksCountries } from "@/utils/Sportmonks/Countries";
import ScoreDisplay from "./ScoreDisplay";
import Logo from "@/components/Shared/Logo/Logo";

type FixtureInformationProps = {
  fixture: Fixture;
}

function FixtureInformation({fixture}: FixtureInformationProps) {
  const getCompetitionSrting = () => {
    const countryObj = sportmonksCountries.find(
      (country) => country.id === fixture.league.country_id
    );

    const countryName = countryObj ? countryObj.name : "";
    const groupName = fixture.group ? " / " + fixture.group.name : "";
    const roundName = fixture.round ? " / Round " + fixture.round.name : "";
    const leagueName = fixture.league.name + groupName + roundName;

    return <span>{`${countryName} / ${leagueName}`}</span>;
  };

  const getTeamLogo = (location: string): string => {
    const team = fixture.participants.find(
      (participant: Participant) => participant.meta.location === location
    );

    if (team) return team.image_path;

    return "default-team-logo.svg";
  };

  return (
    <div key={fixture.id}>
      <div className="mb-4">
        <div className="flex mb-1">
          <div className={`relative h-[20px] w-[20px] md:h-[25px] md:w-[25px]`}>
            <Image
              src={
                fixture.league.image_path
                  ? fixture.league.image_path
                  : "default-team-logo.svg"
              }
              fill={true}
              alt="Competition logo"
              style={{ objectFit: "cover" }}
              sizes={`(max-width: 1200px) 30px, 30px`}
            />
          </div>
          <div className="text-gray-400 text-sm md:text-base ml-2">
            {getCompetitionSrting()}
          </div>
        </div>
        <div>
          <span className="text-sm md:text-base">{fixture.name}</span>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <div className="flex justify-center">
          <div
            className={`relative h-[60px] w-[60px] md:h-[90px] md:w-[90px] lg:h-[120px] lg:w-[120px]`}
          >
            <Image
              src={getTeamLogo("home")}
              fill={true}
              alt="Home team logo"
              style={{ objectFit: "cover" }}
              sizes={`(max-width: 1200px) 120px, 120px`}
            />
          </div>
        </div>

        <ScoreDisplay fixture={fixture} />

        <div className="flex justify-center">
          <div
            className={`relative h-[60px] w-[60px] md:h-[90px] md:w-[90px] lg:h-[120px] lg:w-[120px]`}
          >
            <Image
              src={getTeamLogo("away")}
              fill={true}
              alt="Away team logo"
              style={{ objectFit: "cover" }}
              sizes={`(max-width: 1200px) 120px, 120px`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FixtureInformation;
