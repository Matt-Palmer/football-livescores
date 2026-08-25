"use client";

import {
  getAssists,
  getCard,
  getGoalsScored,
  getSubOff,
} from "@/services/Events";
import { Player } from "@/typings";
import { getContrastTextColour } from "@/utils/helperFunctions";
import PlayerEventGoal from "../../PlayerEventGoal";
import PlayerEventAssist from "../../PlayerEventAssist";
import PlayerEventSubOff from "../../PlayerEventSubOff";
import PlayerEventCard from "../../PlayerEventCard";
import { useFixtureContext } from "@/hooks/useFixtureContext";

type Props = {
  player: Player;
  colour: string;
};

function PlayerIndicator({ player, colour }: Props) {
  const { fixture } = useFixtureContext();
  const events = fixture ? fixture.events : [];

  const goalsScored = getGoalsScored(events, player.player_id);
  const assists = getAssists(events, player.player_id);
  const subOff = getSubOff(events, player.player_id);
  const card = getCard(events, player.player_id);

  return (
    <span className="flex flex-1 items-center flex-col h-full">
      <span
        style={{
          backgroundColor: `${colour}`,
          color: getContrastTextColour(colour),
          border: `2px solid ${colour}`,
        }}
        className={`relative rounded-full w-8 h-8 md:w-10 md:h-10 flex justify-center items-center mb-2`}
      >
        <span className="text-sm font-bold">{player.jersey_number}</span>

        {goalsScored.length > 0 ? (
          <div className="absolute translate-x-full translate-y-1/2 right-[9px] bottom-0 flex">
            {goalsScored.map((goal) => (
              <PlayerEventGoal key={goal.id} type_id={goal.type_id} />
            ))}
          </div>
        ) : (
          false
        )}

        {assists.length > 0 ? (
          <div className="absolute -translate-x-full translate-y-1/2 left-[9px] bottom-0 flex">
            {assists.map((assist) => (
              <PlayerEventAssist
                key={assist.id}
                classNames="w-4 h-4 text-blue-600 bg-white rounded-full"
              />
            ))}
          </div>
        ) : (
          false
        )}

        {subOff ? (
          <div className="absolute -translate-x-full -translate-y-1/2 left-[9px] top-0 flex">
            <PlayerEventSubOff classNames="w-4 h-4 text-red-600" />
          </div>
        ) : (
          false
        )}

        {card ? (
          <div
            className={`absolute -translate-y-1/2 ${
              card === 21 ? "translate-x-full" : "translate-x-full"
            } right-[9px] top-0 flex`}
          >
            <PlayerEventCard type_id={card} />
          </div>
        ) : (
          false
        )}
      </span>
      <span className="text-xs text-center font-bold">
        {player.player_name}
      </span>
    </span>
  );
}

export default PlayerIndicator;
