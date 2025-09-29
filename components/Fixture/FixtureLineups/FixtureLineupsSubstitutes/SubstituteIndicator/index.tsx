'use client';

import _ from "lodash";

import {
  getAssists,
  getCard,
  getGoalsScored,
  getSubOn,
} from "@/services/Events";
import { Player } from "@/typings";
import PlayerEventGoal from "../../PlayerEventGoal";
import PlayerEventAssist from "../../PlayerEventAssist";
import PlayerEventSubOn from "../../PlayerEventSubOn";
import PlayerEventCard from "../../PlayerEventCard";
import { useFixtureContext } from "@/hooks/useFixtureContext";

type Props = {
  substitute: Player;
  colour: string;
};

function SubstituteIndicator({ substitute, colour }: Props) {
  const { fixture } = useFixtureContext();
  const events = fixture ? fixture.events : [];

  const goalsScored = getGoalsScored(events, substitute.player_id);
  const assists = getAssists(events, substitute.player_id);
  const subOn = getSubOn(events, substitute.player_id);
  const card = getCard(events, substitute.player_id);

  return (
    <div
      key={substitute.player_id || _.uniqueId()}
      className={`flex items-center gap-4 bg-[#3F576C] rounded-full p-2 mb-2`}
    >
      <span
        style={{
          backgroundColor: `${colour}`,
        }}
        className="w-8 h-8 relative rounded-full flex justify-center items-center"
      >
        {substitute.jersey_number}

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

        {subOn ? (
          <div className="absolute -translate-x-full -translate-y-1/2 left-[9px] top-0">
            <PlayerEventSubOn classNames="w-4 h-4 text-green-600 bg-white rounded-full" />
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
      <div className="flex items-center justify-center">
        <div className="flex flex-col justify-center">
          <span className="text-sm mr-2">{substitute.player_name}</span>
        </div>
      </div>
    </div>
  );
}

export default SubstituteIndicator;
