import { useContext } from "react";

import { Fixture, Player } from "@/typings";
import { getParticipant } from "@/services/Participants";
import ParticipantLineup from "./ParticipantLineup";
import { useFixtureContext } from "@/hooks/useFixtureContext";

type Props = {
  isHomeTeamDisplayed: boolean;
};

function FixtureLineupsPitch({ isHomeTeamDisplayed }: Props) {
  const { fixture } = useFixtureContext();

  const getStartingEleven = (participantLocation: string) => {
    if (!fixture) return [];

    const participant = getParticipant(
      fixture.participants,
      participantLocation
    );

    const teamLineup: Player[] = fixture.lineups.filter(
      (player) => player.team_id === participant.id
    );

    return teamLineup.filter((player) => player.formation_position !== null);
  };

  return (
    <div className="flex flex-col w-full max-w-[500px] h-[550px] md:h-[600px] bg-[#3f576c]">
      {isHomeTeamDisplayed ? (
        <ParticipantLineup
          lineup={getStartingEleven("home")}
          isHomeTeam={true}
        />
      ) : (
        <ParticipantLineup
          lineup={getStartingEleven("away")}
          isHomeTeam={false}
        />
      )}
    </div>
  );
}

export default FixtureLineupsPitch;
