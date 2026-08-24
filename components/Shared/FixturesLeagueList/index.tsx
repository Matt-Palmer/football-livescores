import FixturesLeagueFixture from "@/components/Shared/FixturesLeagueFixture";
import { Fixture } from "@/typings";
import Image from "next/image";

type Props = {
  countryId: any;
  fixtures: Fixture[];
};

const FixturesLeagueList = ({ countryId, fixtures }: Props) => {
  const displayLeagues = () => {
    const filteredFixtures = fixtures.filter(
      (fixture) => fixture.league.country_id === countryId
    );

    const todaysFixturesNew = filteredFixtures.reduce(
      (prevArr: any, fixture: Fixture) => {
        const groupName = fixture.group ? " - " + fixture.group.name : "";
        const leagueName = fixture.league.name + groupName;

        prevArr[leagueName] = prevArr[leagueName] || {
          ...prevArr[leagueName],
          name: leagueName,
          image_path: fixture.league.image_path,
          fixtures: [],
        };

        prevArr[leagueName].fixtures.push(fixture);

        return prevArr;
      },
      {}
    );

    return (
      <div>
        {todaysFixturesNew &&
          Object.keys(todaysFixturesNew).map((leagueKey) => (
            <div key={leagueKey}>
              <div className="p-2 pb-4 md:p-4 md:pt-2 flex items-center w-full gap-4 h-14">
                <div className={`relative h-[25px] w-[25px]`}>
                  <Image
                    src={
                      todaysFixturesNew[leagueKey].image_path
                        ? todaysFixturesNew[leagueKey].image_path
                        : "/default-team-logo.svg"
                    }
                    fill={true}
                    alt="Country flag"
                    style={{ objectFit: "cover" }}
                    sizes={`(max-width: 1200px) 30px, 30px`}
                  />
                </div>
                <h2 className="md:text-lg">
                  {todaysFixturesNew[leagueKey].name}
                </h2>
              </div>
              <div>
                {todaysFixturesNew[leagueKey].fixtures.map(
                  (fixture: Fixture) => (
                    <FixturesLeagueFixture key={fixture.id} fixture={fixture} />
                  )
                )}
              </div>
            </div>
          ))}
      </div>
    );
  };

  return <>{displayLeagues()}</>;
};

export default FixturesLeagueList;
