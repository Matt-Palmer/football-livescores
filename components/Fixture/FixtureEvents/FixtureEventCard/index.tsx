type Props = {
  isHomeTeam: boolean;
  type_id: number;
  player_name: string;
  info: string | null;
  minute: number;
  extra_minute: number | null;
};

function FixtureEventCard({ isHomeTeam, type_id, player_name, info, minute, extra_minute }: Props) {
  const getCardType = () => {
    if (type_id === 19) {
      return (
       
        <div className={`w-[12px] h-[12px] flex justify-center`}>

          <span className={`block w-[8px] h-[12px] rounded-sm bg-yellow-400`}></span>
        </div>
       
      );
    }

    if (type_id === 20) {
      return (
          <span className={`w-[12px] h-[12px] rounded-sm bg-red-600`}></span>
      );
    }

    return (
      <div className="w-2 h-3 relative">
        <span
          className={`w-2 h-3 absolute left-[-1px] top-[1px] rounded-sm bg-yellow-400`}
        ></span>
        <span
          className={`w-2 h-3 absolute left-[1px] top-[-1px] rounded-sm bg-red-600`}
        ></span>
      </div>
    );
  };

  return (
		<>
			{isHomeTeam && (
				<div className="flex items-center gap-3 px-4">
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

					<div className="flex items-center gap-2 text-xs">
						{getCardType()}
						<p className="text-xs leading-3"> {player_name}</p>

						{/* {info && <p className="text-xs opacity-70">{info}</p>} */}
					</div>
				</div>
			)}

			{!isHomeTeam && (
				<div className="flex items-center gap-3 px-4">
					<div className="flex items-center gap-2 text-xs">
						<p className="text-xs text-right leading-3">{player_name}</p>
						{getCardType()}
						{/* {info && <p className="text-xs text-right opacity-70">{info}</p>} */}
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

export default FixtureEventCard;
