import { Fixture } from "@/typings";
import { sportmonksCountries } from "@/utils/Sportmonks/Countries";
import { leagueOrder } from "@/utils/LeagueOrder";

export type LeaguePanelData = {
  key: string;
  leagueName: string;
  leagueImage: string;
  fixtures: Fixture[];
};

// The handful of countries that stay pinned to the top of the page, in this
// exact order, ahead of the alphabetical rest.
const PRIORITY_COUNTRIES = [
  "Europe",
  "England",
  "Spain",
  "Germany",
  "France",
  "Italy",
];

/**
 * Groups fixtures into one panel per league. Countries are ordered with the
 * priority tier (Europe, England, Spain, Germany, France, Italy) first in
 * that fixed order, then every other country that has fixtures today,
 * alphabetically — including countries with no entry in leagueOrder at all,
 * which used to be dropped from the page entirely.
 *
 * Within a country, leagues follow that country's curated order from
 * leagueOrder where one exists (e.g. Premier League before Championship),
 * with any leagues leagueOrder doesn't know about appended alphabetically
 * after. A country with no curation at all just sorts its leagues
 * alphabetically.
 */
export function buildLeaguePanels(
  fixtures: Fixture[],
  isFavourite: (fixtureId: number) => boolean
): LeaguePanelData[] {
  const fixturesByCountry: Record<string, Fixture[]> = {};

  fixtures.forEach((fixture) => {
    const countryObj = sportmonksCountries.find(
      (country) => country.id === fixture.league.country_id
    );

    if (!countryObj) return;

    fixturesByCountry[countryObj.name] = fixturesByCountry[countryObj.name] || [];
    fixturesByCountry[countryObj.name].push(fixture);
  });

  const countriesWithFixtures = Object.keys(fixturesByCountry);

  const priorityCountries = PRIORITY_COUNTRIES.filter((country) =>
    countriesWithFixtures.includes(country)
  );
  const remainingCountries = countriesWithFixtures
    .filter((country) => !PRIORITY_COUNTRIES.includes(country))
    .sort((a, b) => a.localeCompare(b));

  const orderedCountries = [...priorityCountries, ...remainingCountries];

  const panels: LeaguePanelData[] = [];

  orderedCountries.forEach((country) => {
    const countryFixtures = fixturesByCountry[country];

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

    const curatedLeagues =
      leagueOrder.find((entry) => entry.country === country)?.leagues ?? [];
    const leagueKeys = Object.keys(fixturesByLeague);

    const curatedKeys = curatedLeagues.filter((name) =>
      leagueKeys.includes(name)
    );
    const remainingKeys = leagueKeys
      .filter((key) => !curatedKeys.includes(key))
      .sort((a, b) => a.localeCompare(b));

    [...curatedKeys, ...remainingKeys].forEach((leagueKey) => {
      const panel = fixturesByLeague[leagueKey];

      panel.fixtures.sort(
        (a, b) => Number(isFavourite(b.id)) - Number(isFavourite(a.id))
      );

      panels.push(panel);
    });
  });

  return panels;
}
