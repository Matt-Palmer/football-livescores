type Props = {
  isHomeTeam: boolean;
  type_id: number;
  player_name: string;
  info: string | null;
};

function FixtureEventCard({ isHomeTeam, type_id, player_name, info }: Props) {
  const getCardType = () => {
    if (type_id === 19) {
      return (
        <div
          className={`flex justify-center items-center ${
            isHomeTeam ? "border-l-[1px] ml-4" : "border-r-[1px] mr-4"
          } h-6 w-10`}
        >
          <div className={`w-3 h-4 rounded-sm bg-yellow-400`}></div>
        </div>
      );
    }

    if (type_id === 20) {
      return (
        <div className={`flex justify-center items-center ${
            isHomeTeam ? "border-l-[1px] ml-4" : "border-r-[1px] mr-4"
          } h-6 w-10`}>
          <div className={`w-3 h-4 rounded-sm bg-red-600`}></div>
        </div>
      );
    }

    return (
      <div
        className={`flex justify-center items-center relative ${
          isHomeTeam ? "border-l-[1px] ml-4" : "border-r-[1px] mr-4"
        } h-6 w-10`}
      >
        <div
          className={`w-3 h-4 absolute left-[12px] top-[6px] rounded-sm bg-yellow-400`}
        ></div>
        <div
          className={`w-3 h-4 absolute left-[15px] top-[3px] rounded-sm bg-red-600`}
        ></div>
      </div>
    );
  };

  return (
    <>
      {isHomeTeam && (
        <>
          <div>
            <p className="text-sm text-right leading-3">{player_name}</p>
            {info && <p className="text-xs text-right opacity-70">{info}</p>}
          </div>

          {getCardType()}
        </>
      )}

      {!isHomeTeam && (
        <>
          {getCardType()}
          <div>
            <p className="text-sm leading-3">{player_name}</p>
            {info && <p className="text-xs opacity-70">{info}</p>}
          </div>
        </>
      )}
    </>
  );
}

export default FixtureEventCard;
