import { MdMonitor } from "react-icons/md";

import { sportmonksTypes } from "@/utils/Sportmonks/Types";

type Props = {
  isHomeTeam: boolean;
  player_name: string;
  sub_type_id: number | null;
  addition: string | null;
  minute: number;
  extra_minute: number | null;
};

function FixtureEventVAR({
  isHomeTeam,
  player_name,
  sub_type_id,
  addition,
  minute,
  extra_minute,
}: Props) {
  // sub_type_id is Sportmonks' structured outcome code (e.g. "Goal
  // Disallowed"); addition is free text that in practice is often just the
  // generic word "Review". Prefer the structured code, and only fall all the
  // way back to "Review" when neither says anything more specific.
  const result =
    sportmonksTypes.find((type) => type.id === sub_type_id)?.name ??
    addition ??
    "Review";

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
