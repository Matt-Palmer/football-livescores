"use client";

import { Player } from "@/typings";
import PlayerIndicator from "../PlayerIndicator";
import { useFixtureContext } from "@/hooks/useFixtureContext";

type Props = {
  lineup: Player[];
  isHomeTeam: boolean;
};

function ParticipantLineup({ lineup, isHomeTeam }: Props) {
  const { fixture } = useFixtureContext();
  const metadata = fixture ? fixture.metadata : [];

  const displayFormation = () => {
    const formationMetadata = metadata.find((meta) => meta.type_id === 159);
    const formation: number[] = isHomeTeam
      ? formationMetadata?.values.home.split("-")
      : formationMetadata?.values.away.split("-");

    lineup.sort((a, b) => a.formation_position - b.formation_position);

    const teamLineup = [];
    teamLineup.push(lineup.splice(0, 1));

    formation.forEach((pos) => {
      teamLineup.push(lineup.splice(0, pos));
    });

    const kitColour = isHomeTeam
      ? metadata.find((meta) => meta.type_id === 161)
      : metadata.find((meta) => meta.type_id === 162);

    return teamLineup.map((section, index) => (
      <div key={`${getTeam()?.id}-${index}`} className={`flex justify-center`}>
        {section.map((player: Player) => (
          <PlayerIndicator
            key={player.player_id}
            player={player}
            colour={kitColour?.values.participant}
          />
        ))}
      </div>
    ));
  };

  const getTeam = () => {
    if (!fixture) return null;

    const participantLocation = isHomeTeam ? "home" : "away";

    return fixture.participants.find(
      (participant) => participant.meta.location === participantLocation
    );
  };

  return (
    <div className={`flex h-full justify-between py-4 px-2 md:p-6 flex-col`}>
      {displayFormation()}
    </div>
  );
}

export default ParticipantLineup;
