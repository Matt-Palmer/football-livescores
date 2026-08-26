import { sportmonksTypes } from "@/utils/Sportmonks/Types";
import { Statistic } from "@/typings";

const statisticCategories: { label: string; stats: number[] }[] = [
  { label: "Possession", stats: [45] },
  { label: "Shooting", stats: [42, 86, 41, 58, 49, 50] },
  { label: "Miscellaneous", stats: [34, 51, 56, 84, 83, 60, 53] },
  { label: "Passing", stats: [80, 81, 82, 117, 98, 99] },
  // 1605 (Successful Dribbles %) added alongside the existing dribble counts.
  { label: "Dribbling", stats: [108, 109, 1605] },
  { label: "Defending", stats: [78, 100, 66, 70, 65, 106, 57] },
  { label: "Attacks", stats: [43, 1527, 44] },
];

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
            className={`px-2 text-sm ${
              newStatisticObj.home > newStatisticObj.away
                ? "bg-[#C9A15A] rounded-lg text-black"
                : "text-white"
            }`}
          >
            <span>{newStatisticObj.home}</span>
          </span>
          <span className="text-white text-sm">
            {newStatisticObj.name}
          </span>
          <span
            className={`text-white px-2 text-right text-sm ${
              newStatisticObj.away > newStatisticObj.home &&
              "bg-[#152420] rounded-lg"
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
          {statisticCategories.map((category) => {
            const rows = category.stats
              .map((stat) => ({ stat, row: getStatistic(stat) }))
              .filter(({ row }) => row);

            // A category whose stats are all 0-0 (or absent) has nothing to
            // show — skip the header rather than leave it floating over
            // nothing.
            if (rows.length === 0) return null;

            return (
              <div key={category.label} className="mb-12">
                <h3 className="text-sm text-brand-muted uppercase tracking-wide mb-2">
                  {category.label}
                </h3>
                {rows.map(({ stat, row }) => (
                  <div key={stat}>{row}</div>
                ))}
              </div>
            );
          })}
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
