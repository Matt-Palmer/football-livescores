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
       
          <span className={`w-3 h-4 rounded-sm bg-yellow-400`}></span>
       
      );
    }

    if (type_id === 20) {
      return (
          <span className={`w-3 h-4 rounded-sm bg-red-600`}></span>
      );
    }

    return (
      <div className="w-3 h-4 relative">
        <span
          className={`w-3 h-4 absolute left-[-1px] top-[1px] rounded-sm bg-yellow-400`}
        ></span>
        <span
          className={`w-3 h-4 absolute left-[1px] top-[-1px] rounded-sm bg-red-600`}
        ></span>
      </div>
    );
  };

  return (
    <>
      {isHomeTeam && (
        <div className="flex items-center gap-4 px-4">
          <div className="flex justify-center items-center">
            <p>
              {minute}
              {extra_minute ? "+" + extra_minute : false}
              {"'"}
            </p>
          </div>
          {getCardType()}

          <div>
            <p className="text-sm leading-3">{player_name}</p>
            {info && <p className="text-xs opacity-70">{info}</p>}
          </div>
        </div>
      )}

      {!isHomeTeam && (
        <div className="flex items-center gap-4 px-4">
          <div>
            <p className="text-sm text-right leading-3">{player_name}</p>
            {info && <p className="text-xs text-right opacity-70">{info}</p>}
          </div>
          {getCardType()}
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

export default FixtureEventCard;
