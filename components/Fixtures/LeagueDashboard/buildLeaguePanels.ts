import { Fixture } from "@/typings";
import { sportmonksCountries } from "@/utils/Sportmonks/Countries";
import { leagueOrder } from "@/utils/LeagueOrder";

export type LeaguePanelData = {
  key: string;
  leagueName: string;
  leagueImage: string;
  fixtures: Fixture[];
};

/**
 * Groups fixtures into one panel per league, in leagueOrder's curated
 * country priority order — the same curation the old country accordion
 * applied, just flattened straight to league panels.
 */
export function buildLeaguePanels(
  fixtures: Fixture[],
  isFavourite: (fixtureId: number) => boolean
): LeaguePanelData[] {
  const fixturesByCountry = fixtures.reduce(
    (acc: Record<string, Fixture[]>, fixture: Fixture) => {
      const countryObj = sportmonksCountries.find(
        (country) => country.id === fixture.league.country_id
      );

      if (!countryObj) return acc;

      acc[countryObj.name] = acc[countryObj.name] || [];
      acc[countryObj.name].push(fixture);

      return acc;
    },
    {}
  );

  const panels: LeaguePanelData[] = [];

  leagueOrder.forEach(({ country }) => {
    const countryFixtures = fixturesByCountry[country];

    if (!countryFixtures) return;

    const fixturesByLeague = countryFixtures.reduce(
      (acc: Record<string, LeaguePanelData>, fixture: Fixture) => {
        const groupName = fixture.group ? " - " + fixture.group.name : "";
        const leagueKey = fixture.league.name + groupName;

        acc[leagueKey] = acc[leagueKey] || {
          key: `${country}:${leagueKey}`,
          leagueName: leagueKey,
          leagueImage: fixture.league.image_path,
          fixtures: [],
        };

        acc[leagueKey].fixtures.push(fixture);

        return acc;
      },
      {}
    );

    Object.values(fixturesByLeague).forEach((panel) => {
      panel.fixtures.sort(
        (a, b) => Number(isFavourite(b.id)) - Number(isFavourite(a.id))
      );
      panels.push(panel);
    });
  });

  return panels;
}
