import { GiGoalKeeper } from "react-icons/gi";

type Props = {
  isHomeTeam: boolean;
  player_name: string;
  result: string | null;
  wasScored: boolean;
  minute: number;
  extra_minute: number | null;
};

function FixtureEventPenalty({ isHomeTeam, player_name, result, wasScored, minute, extra_minute }: Props) {
  return (
    <>
      {isHomeTeam ? (
        <div className="flex gap-4 px-4">
          <div className="flex justify-center items-center">
            <p>
              {minute}
              {extra_minute ? "+" + extra_minute : false}
              {"'"}
            </p>
          </div>
          <span className="flex justify-center items-center">
            {wasScored ? (
              <GiGoalKeeper className={`w-5 text-green-400`} />
            ) : (
              <GiGoalKeeper className={`w-5 text-red-500`} />
            )}
          </span>
          <div className="flex flex-col justify-center">
            <p className="text-sm leading-3">
              {player_name ? player_name : "Goal"}
            </p>
            {result ? <p className="text-xs opacity-70">{result}</p> : false}
          </div>
        </div>
      ) : (
        <div className="flex gap-4 px-4">
          <div className="flex flex-col justify-center">
            <p className="text-sm text-right leading-3">
              {player_name ? player_name : "Goal"}
            </p>
            {result && (
              <p className="text-xs text-right opacity-70">{result}</p>
            )}
          </div>
          <span className="flex justify-center items-center">
            {wasScored ? (
              <GiGoalKeeper className={`w-5 text-green-400`} />
            ) : (
              <GiGoalKeeper className={`w-5 text-red-500`} />
            )}
          </span>
          <div className="flex justify-center items-center">
            <p>
              {minute}
              {extra_minute ? "+" + extra_minute : false}
              {"'"}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default FixtureEventPenalty;
