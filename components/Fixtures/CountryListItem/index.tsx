"use client";

import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";

import { Fixture } from "@/typings";
import { sportmonksCountries } from "@/utils/Sportmonks/Countries";
import { leagueOrder } from "@/utils/LeagueOrder";

import FixturesLeagueList from "../../Shared/FixturesLeagueList";
import LogoBadge from "@/components/Shared/LogoBadge";
import { useFixturesContext } from "@/hooks/useFixturesContext";
import { getDayStripLabel } from "@/services/Date";

const CountryListItem = () => {
  const { fixtures, selectedDate, isToday, isLoading, error, retry } =
    useFixturesContext();

  const displayCountries = () => {
    if (!fixtures) return;

    const todaysFixtures = fixtures.reduce((prevArr: any, fixture: Fixture) => {
      const countryObj = sportmonksCountries.find(
        (country): boolean => country.id === fixture.league.country_id
      );

      if (countryObj) {
        const countryName: string = countryObj.name;

        prevArr[countryName] = prevArr[countryName] || {
          ...countryObj,
        };
      }

      return prevArr;
    }, {});

    const sortedFixtures: any = {};

    leagueOrder.forEach((country) => {
      if (todaysFixtures.hasOwnProperty(country.country)) {
        sortedFixtures[country.country] = {
          ...todaysFixtures[country.country],
        };
      }
    });

    return (
      <>
        {error ? (
          <div className="text-center py-12">
            <p className="mb-2">
              Couldn&apos;t load {isToday ? "today's" : "this day's"} fixtures.
            </p>
            <p className="text-sm text-[rgba(255,255,255,0.6)] mb-6">{error}</p>
            <button
              onClick={retry}
              className="bg-[#EFEF3E] text-black px-6 py-2 rounded-full"
            >
              Try again
            </button>
          </div>
        ) : !isLoading ? (
          <>
            {Object.keys(sortedFixtures).length > 0 ? (
              Object.keys(sortedFixtures).map((countryKey: string) => (
                <Disclosure key={countryKey}>
                  <div className="mb-1 bg-[#3F576C] overflow-hidden">
                    <DisclosureButton className="p-2 md:p-4 flex items-center w-full gap-4 rounded-lg bg-[#3F576C]">
                      <LogoBadge
                        src={sortedFixtures[countryKey].image_path}
                        alt="Country flag"
                        className="h-[25px] w-[25px] md:h-[30px] md:w-[30px]"
                        sizes="(max-width: 1200px) 30px, 30px"
                      />
                      <h2 className="md:text-lg">{countryKey}</h2>
                    </DisclosureButton>
                    <DisclosurePanel>
                      <FixturesLeagueList
                        countryId={sortedFixtures[countryKey].id}
                        fixtures={fixtures}
                      />
                    </DisclosurePanel>
                  </div>
                </Disclosure>
              ))
            ) : (
              <div className="text-center py-12 text-[rgba(255,255,255,0.6)]">
                {isToday
                  ? "No fixtures today."
                  : `No fixtures on ${getDayStripLabel(selectedDate)}.`}
              </div>
            )}
          </>
        ) : (
          <>
            {Array.from({ length: 10 }).map((item, index) => (
              <div
                key={index}
                className="bg-[#3f576c] animate-pulse h-[41px] md:h-[62px] w-full mb-1"
              ></div>
            ))}
          </>
        )}
      </>
    );
  };

  return displayCountries();
};

export default CountryListItem;
