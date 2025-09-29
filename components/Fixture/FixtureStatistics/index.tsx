import { sportmonksTypes } from "@/utils/Sportmonks/Types";
import { Statistic } from "@/typings";

const statisticOrder: any = {
  possesion: [45],
  shooting: [42, 86, 41, 58, 49, 50],
  miscellaneous: [34, 51, 56, 84, 83, 60, 53],
  passing: [80, 81, 82, 117, 98, 99],
  dribbling: [108, 109],
  defending: [78, 100, 66, 70, 65, 106, 57],
  attacks: [43, 1527, 44],
};

type FixtureStatisticsProps = {
  statistics: Statistic[];
};

function FixtureStatistics({ statistics }: FixtureStatisticsProps) {
  const getStatistic = (stat: number) => {
    const typeObj = sportmonksTypes.find((type) => type.id === stat);

    const filteredStat = statistics?.filter(
      (statistic) => statistic.type_id === stat
    );
    const homeStat = filteredStat
      ? filteredStat.find((stat) => stat.location === "home")
      : 0;
    const awayStat = filteredStat
      ? filteredStat.find((stat) => stat.location === "away")
      : 0;

    const newStatisticObj = {
      name: typeObj?.name,
      home: homeStat ? homeStat.data.value : 0,
      away: awayStat ? awayStat.data.value : 0,
    };

    if (newStatisticObj.home === 0 && newStatisticObj.away === 0) return false;

    return (
      <>
        <div className="flex justify-between text-white py-2">
          <span
            className={`px-2 md:text-lg lg:text-xl ${
              newStatisticObj.home > newStatisticObj.away
                ? "bg-[#EFEF3E] rounded-xl text-black"
                : "text-white"
            }`}
          >
            <span>{newStatisticObj.home}</span>
          </span>
          <span className="text-white md:text-lg lg:text-xl">
            {newStatisticObj.name}
          </span>
          <span
            className={`text-white px-2 text-right md:text-lg lg:text-xl ${
              newStatisticObj.away > newStatisticObj.home &&
              "bg-[#3F576C] rounded-xl"
            } `}
          >
            <span>{newStatisticObj.away} </span>
          </span>
        </div>
        <hr />
      </>
    );
  };

  const displayStatistics = () => {
    return (
      <div className="flex flex-col items-center">
        <div className="w-full max-w-[700px]">
          {Object.keys(statisticOrder).map((key, index) => (
            <div key={key} className="mb-12">
              {statisticOrder[key].map((stat: number) => (
                <div key={stat}>
                  <div>{getStatistic(stat)}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {statistics && statistics.length > 0 ? (
        displayStatistics()
      ) : (
        <div>
          <span>No stats available</span>
        </div>
      )}
    </>
  );
}

export default FixtureStatistics;
