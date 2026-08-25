import FixturesLeagueFixture from "@/components/Shared/FixturesLeagueFixture";
import LogoBadge from "@/components/Shared/LogoBadge";
import { Fixture } from "@/typings";

type Props = {
  leagueName: string;
  leagueImage: string;
  fixtures: Fixture[];
  activeFixtureId?: number;
};

function LeaguePanel({
  leagueName,
  leagueImage,
  fixtures,
  activeFixtureId,
}: Props) {
  return (
    <div className="rounded-lg border border-brand-border bg-brand-surface overflow-hidden break-inside-avoid mb-4">
      <div className="flex items-center gap-3 px-3 py-2.5 border-b border-brand-border">
        <LogoBadge
          src={leagueImage}
          alt="Competition logo"
          className="h-[20px] w-[20px]"
          sizes="20px"
        />
        <h2 className="text-sm font-medium truncate">{leagueName}</h2>
      </div>
      <div className="p-1">
        {fixtures.map((fixture) => (
          <FixturesLeagueFixture
            key={fixture.id}
            fixture={fixture}
            isActive={fixture.id === activeFixtureId}
          />
        ))}
      </div>
    </div>
  );
}

export default LeaguePanel;
