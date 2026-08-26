import MatchCard from "@/components/Shared/MatchCard";
import LogoBadge from "@/components/Shared/LogoBadge";
import { Fixture } from "@/typings";

type Props = {
  leagueName: string;
  leagueImage: string;
  fixtures: Fixture[];
};

function LeaguePanel({ leagueName, leagueImage, fixtures }: Props) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <LogoBadge
          src={leagueImage}
          alt="Competition logo"
          className="h-[22px] w-[22px]"
          sizes="22px"
        />
        <h2 className="text-sm md:text-base font-medium">{leagueName}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {fixtures.map((fixture) => (
          <MatchCard key={fixture.id} fixture={fixture} />
        ))}
      </div>
    </div>
  );
}

export default LeaguePanel;
