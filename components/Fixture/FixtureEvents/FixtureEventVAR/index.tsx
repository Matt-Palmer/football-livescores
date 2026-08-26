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
				<div className="flex gap-3 px-4">
					<div className="flex justify-center items-center">
						<div className="flex flex-col justify-center items-center w-[30px]">
							<span>{minute}</span>

							{extra_minute ? (
								<span className="opacity-70">+{extra_minute}</span>
							) : (
								false
							)}
						</div>
					</div>

					<div>
						<p className="flex items-center text-xs gap-2">
							<span className="flex justify-center items-center">
								<MdMonitor />
							</span>
							<span>{player_name ? player_name : "Goal"}</span>
						</p>
						{result && <p className="text-[10px] opacity-50">{result}</p>}
					</div>
				</div>
			) : (
				<div className="flex gap-3 px-4">
					<div>
						{result && <p className="text-[10px] opacity-50">{result}</p>}
						<p className="flex items-center text-xs gap-2">
							<span>{player_name ? player_name : "Goal"}</span>
							<span className="flex justify-center items-center">
								<MdMonitor />
							</span>
						</p>
					</div>
					<div className="flex justify-center items-center">
						<div className="flex flex-col justify-center items-center w-[30px]">
							<span>{minute}</span>

							{extra_minute ? (
								<span className="opacity-70">+{extra_minute}</span>
							) : (
								false
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
}

export default FixtureEventVAR;
