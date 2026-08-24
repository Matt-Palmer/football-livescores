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

    const formationValue = isHomeTeam
      ? formationMetadata?.values.home
      : formationMetadata?.values.away;

    // Sportmonks omits formation metadata for some fixtures.
    if (!formationValue) return null;

    const formation: number[] = formationValue
      .split("-")
      .map((pos: string) => Number(pos));

    /*
      Work on a copy. This used to sort and splice the `lineup` prop in place,
      draining the caller's array as a side effect of rendering. React 19
      double-invokes render functions in development, so the second invocation
      received the already-emptied array and drew an empty pitch.
    */
    const remaining = [...lineup].sort(
      (a, b) => a.formation_position - b.formation_position
    );

    const teamLineup: Player[][] = [];

    // Goalkeeper first, then one row per line of the formation.
    teamLineup.push(remaining.splice(0, 1));

    formation.forEach((pos) => {
      teamLineup.push(remaining.splice(0, pos));
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
