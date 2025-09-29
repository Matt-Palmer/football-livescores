import { HiArrowSmDown, HiArrowSmUp } from "react-icons/hi";
import { FaArrowsRotate } from "react-icons/fa6";

type Props = {
  isHomeTeam: boolean;
  player_off_name: string | null;
  player_on_name: string;
  minute: number;
  extra_minute: number | null;
};
function FixtureEventSubstitution({ isHomeTeam, player_off_name, player_on_name, minute, extra_minute }: Props) {
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
            <FaArrowsRotate className={`w-4`} />
          </span>

          <div>
            <p className="flex items-center text-sm text-right leading-3">
              <HiArrowSmUp className="text-green-500" />
              {player_on_name}
            </p>
            <p className="flex items-center text-xs opacity-70">
              <HiArrowSmDown className="text-red-500 h-4 w-4" />
              {player_off_name}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex gap-4 px-4">
          <div>
            <p className="flex items-center justify-end text-sm text-right leading-3">
              <HiArrowSmUp className="text-green-500" />
              {player_on_name}
            </p>
            <p className="flex items-center justify-end text-xs opacity-70">
              <HiArrowSmDown className="text-red-500 h-4 w-4" />
              {player_off_name}
            </p>
          </div>

          <span className="flex justify-center items-center">
            <FaArrowsRotate className={`w-4`} />
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

export default FixtureEventSubstitution;
