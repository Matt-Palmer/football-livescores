import { BiFootball } from "react-icons/bi";

type Props = {
  isHomeTeam: boolean;
  player_name: string;
  result: string | null;
  related_player_name: string | null;
  type_id: number;
  minute: number;
  extra_minute: number | null;
};

function FixtureEventGoal({ isHomeTeam, player_name, result, related_player_name, type_id, minute, extra_minute }: Props) {
  return (
    <>
      {isHomeTeam ? (
        <div className="flex items-center justify-start gap-4 px-4">
          <div className="flex justify-center items-center">
            <p>
              {minute}
              {extra_minute ? "+" + extra_minute : false}
              {"'"}
            </p>
          </div>
          <span className="flex justify-center items-center">
            <BiFootball
              className={`text-xl ${type_id === 15 ? "text-red-600" : ""}`}
            />
          </span>
          <div>
            <p className="text-sm leading-3">
              {player_name ? player_name : "Goal"}
            </p>
            <div className="flex">
              {related_player_name ? (
                <p className="text-xs opacity-70 mr-1">
                  Assist: {related_player_name} -
                </p>
              ) : (
                false
              )}
              {result ? (
                <p className="text-xs opacity-70">{result}</p>
              ) : (
                false
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-start gap-4 px-4">
          <div>
            <p className="text-sm text-right leading-3">
              {player_name ? player_name : "Goal"}
            </p>
            <div className="flex justify-end">
              {related_player_name ? (
                <p className="text-xs text-right opacity-70 mr-1">
                  Assist: {related_player_name} -
                </p>
              ) : (
                false
              )}
              {result ? (
                <p className="text-xs opacity-70">{result}</p>
              ) : (
                false
              )}
            </div>
          </div>
          <span className="flex justify-center items-center">
            <BiFootball
              className={`text-xl ${type_id === 15 ? "text-red-600" : ""}`}
            />
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

export default FixtureEventGoal;
