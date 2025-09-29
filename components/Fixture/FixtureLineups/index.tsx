"use client";

import { useState } from "react";

import { Fixture } from "@/typings";
import FixtureLineupsPitch from "./FixtureLineupsPitch";
import FixtureLineupsToggleBtn from "./FixtureLineupsToggleBtn";
import FixtureLineupsSubstitutes from "./FixtureLineupsSubstitutes";

type FixtureLineupsProps = {
  fixture: Fixture
}

function FixtureLineups({fixture}: FixtureLineupsProps) {
  const [isHomeTeamDisplayed, setIsHomeTeamDisplayed] = useState(true);

  const toggleDisplayedLineup = (value: boolean) => {
    setIsHomeTeamDisplayed(value);
  };

  return (
    <>
      {fixture.lineups && fixture.lineups.length > 0 ? (
        <>
          <div className="flex justify-center gap-4 mb-8">
            <FixtureLineupsToggleBtn
              isHomeTeamDisplayed={isHomeTeamDisplayed}
              toggleDisplayedLineup={() => toggleDisplayedLineup(true)}
              participantLocation="home"
              participants={fixture.participants}
            />
            <FixtureLineupsToggleBtn
              isHomeTeamDisplayed={!isHomeTeamDisplayed}
              toggleDisplayedLineup={() => toggleDisplayedLineup(false)}
              participantLocation="away"
              participants={fixture.participants}
            />
          </div>
          <div className="flex flex-col justify-center items-center lg:items-start lg:flex-row gap-16">
            <FixtureLineupsPitch isHomeTeamDisplayed={isHomeTeamDisplayed} />

            <FixtureLineupsSubstitutes
              isHomeTeamDisplayed={isHomeTeamDisplayed}
            />
          </div>
        </>
      ) : (
        <div>
          <p>Lineups not available</p>
        </div>
      )}
    </>
  );
}

export default FixtureLineups;
