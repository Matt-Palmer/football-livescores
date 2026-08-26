import { BiFootball } from "react-icons/bi";
import { GiRunningShoe } from "react-icons/gi";

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
				<div className="flex items-center justify-start gap-3 px-4">
					<div className="flex flex-col justify-center items-center w-[30px]">
						<span>{minute}</span>

						{extra_minute ? (
							<span className="opacity-70">+{extra_minute}</span>
						) : (
							false
						)}
					</div>

					<div>
						<p className="flex items-center gap-3 text-xs leading-3">
							<span className="flex items-center gap-2">
								<span className="flex justify-center items-center">
									<BiFootball
										className={`${type_id === 15 ? "text-red-600" : ""}`}
									/>
								</span>
								<span>{player_name ? player_name : "Goal"}</span>
							</span>
							<span className="bg-slate-100 text-black text-[10px] font-bold px-2 py-[2px] rounded-full ">
								{result ? result : false}
							</span>
						</p>
						<div className="flex">
							{related_player_name ? (
								<p className="flex gap-2 text-xs opacity-50">
									<span className="flex justify-center items-center">
										<GiRunningShoe />
									</span>
									{related_player_name}
								</p>
							) : (
								false
							)}
						</div>
					</div>
				</div>
			) : (
				<div className="flex items-center justify-start gap-3 px-4">
					<div>
						<p className="flex items-center gap-3 text-xs text-right leading-3">
							<span className="bg-slate-100 text-black text-[10px] font-bold px-2 py-[2px] rounded-full ">
								{result ? result : false}
							</span>
							<span className="flex items-center gap-2">
								<span>{player_name ? player_name : "Goal"}</span>
								<span className="flex justify-center items-center">
									<BiFootball
										className={`${type_id === 15 ? "text-red-600" : ""}`}
									/>
								</span>
							</span>
						</p>
						<div className="flex justify-end">
							{related_player_name ? (
								<p className="flex gap-2 text-xs text-right opacity-50">
									{related_player_name}{" "}
									<span className="flex justify-center items-center">
										<GiRunningShoe />
									</span>
								</p>
							) : (
								false
							)}
						</div>
					</div>
					<div className="flex justify-center items-center w-[30px]">
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

export default FixtureEventGoal;
