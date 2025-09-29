import { MdMonitor } from "react-icons/md";

type Props = {
  isHomeTeam: boolean;
  player_name: string;
  result: string | null;
  minute: number;
  extra_minute: number | null;
};

function FixtureEventVAR({ isHomeTeam, player_name, result, minute, extra_minute }: Props) {
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
            <MdMonitor />
          </span>
          <div>
            <p className="text-sm leading-3">
              {player_name ? player_name : "Goal"}
            </p>
            {result && <p className="text-xs opacity-70">VAR - {result}</p>}
          </div>
        </div>
      ) : (
        <div className="flex gap-4 px-4">
          <div>
            <p className="text-sm text-right leading-3">
              {player_name ? player_name : "Goal"}
            </p>
            {result ? (<p className="text-xs text-right opacity-70">VAR - {result}</p>) : false}
          </div>
          <span className="flex justify-center items-center">
            <MdMonitor />
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

export default FixtureEventVAR;
