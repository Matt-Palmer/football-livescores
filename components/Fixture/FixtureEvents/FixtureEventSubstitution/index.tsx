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
				<div className="flex gap-3 px-4">
					<div className="flex flex-col justify-center items-center w-[30px]">
						<span>{minute}</span>

						{extra_minute ? (
							<span className="opacity-70">+{extra_minute}</span>
						) : (
							false
						)}
					</div>

					{/* <span className="flex justify-center items-center w-[30px]">
            <FaArrowsRotate className={`w-4`} />
          </span> */}

					<div>
						<p className="flex items-center gap-2 text-xs text-right">
							<HiArrowSmUp className="text-green-500" />
							{player_on_name}
						</p>
						<p className="flex items-center gap-2 text-xs opacity-50">
							<HiArrowSmDown className="text-red-500" />
							{player_off_name}
						</p>
					</div>
				</div>
			) : (
				<div className="flex gap-3 px-4">
					<div>
						<p className="flex items-center justify-end gap-2 text-xs text-right">
							{player_on_name}
							<HiArrowSmUp className="text-green-500" />
						</p>
						<p className="flex items-center justify-end gap-2 text-xs opacity-50">
							{player_off_name}
							<HiArrowSmDown className="text-red-500" />
						</p>
					</div>

					{/* <span className="flex justify-center items-center">
            <FaArrowsRotate className={`w-4`} />
          </span> */}

					<div className="flex flex-col justify-center items-center w-[30px]">
						<span>{minute}</span>

						{extra_minute ? (
							<span className="opacity-70">+{extra_minute}</span>
						) : (
							false
						)}
					</div>
				</div>
			)}
		</>
	);
}

export default FixtureEventSubstitution;
