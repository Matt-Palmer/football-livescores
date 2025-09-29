'use client';

import _ from "lodash";

import { getParticipant } from "@/services/Participants";
import SubstituteIndicator from "./SubstituteIndicator";
import { useFixtureContext } from "@/hooks/useFixtureContext";

type Props = {
  isHomeTeamDisplayed: boolean;
};

function Substitutes({ isHomeTeamDisplayed }: Props) {
  const {fixture} = useFixtureContext();

  const metadata = fixture ? fixture.metadata : [];
  const lineups = fixture ? fixture.lineups : [];
  const participants = fixture ? fixture.participants : [];

  const getSubstitutes = (participantLocation: string) => {
    const participant = getParticipant(participants, participantLocation);

    const teamLineup = lineups.filter(
      (lineup) => lineup.team_id === participant?.id
    );

    return teamLineup.filter((lineup) => lineup.formation_position === null);
  };

  const homeSubstitutes = getSubstitutes("home");
  const awaySubstitutes = getSubstitutes("away");

  const homeColour = metadata.find((meta) => meta.type_id === 161);
  const awayColour = metadata.find((meta) => meta.type_id === 162);

  return (
    <div className="w-full max-w-[500px] lg:w-[300px] flex flex-col">
      <p className="mb-4 text-xl">Substitutes</p>

      {isHomeTeamDisplayed
        ? homeSubstitutes.map((substitute) => (
            <SubstituteIndicator
              key={substitute.player_id}
              substitute={substitute}
              colour={homeColour?.values.participant}
            />
          ))
        : awaySubstitutes.map((substitute) => (
            <SubstituteIndicator
              key={substitute.player_id}
              substitute={substitute}
              colour={awayColour?.values.participant}
            />
          ))}
    </div>
  );
}

export default Substitutes;
