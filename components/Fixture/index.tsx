"use client";

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

import { isTabDisplayed } from "@/utils/individualFixtureHelpers";

import FixtureLineups from "@/components/Fixture/FixtureLineups";
import FixtureEvents from "@/components/Fixture/FixtureEvents";
import FixtureStatistics from "@/components/Fixture/FixtureStatistics";
import FixtureTable from "@/components/Fixture/FixtureTable";
import FixtureInformation from "@/components/Fixture/FixtureInformation";
import FixtureHead2Head from "@/components/Fixture/FixtureHead2Head";
import { useFixtureContext } from "@/hooks/useFixtureContext";

type TabTitleProps = {
  title: string;
};

function TabTitle({ title }: TabTitleProps) {
  return (
    <Tab
      className={`data-[selected]:bg-[#EFEF3E] data-[selected]:text-black data-[selected]:outline-none h-[30px] md:h-[40px] px-6 flex-1 rounded-full`}
    >
      {title}
    </Tab>
  );
}

export default function FixtureComponent() {
  const { fixture, isLoading, error, retry } = useFixtureContext();

  return (
    <main className="flex flex-col w-full overflow-x-hidden px-4 mx-auto mb-16">
      {error ? (
        <div className="text-center py-12">
          <p className="mb-2">Couldn&apos;t load this fixture.</p>
          <p className="text-sm text-[rgba(255,255,255,0.6)] mb-6">{error}</p>
          <button
            onClick={retry}
            className="bg-[#EFEF3E] text-black px-6 py-2 rounded-full"
          >
            Try again
          </button>
        </div>
      ) : fixture ? (
        <>
          <FixtureInformation fixture={fixture} />

          <TabGroup>
            <TabList className="flex overflow-x-scroll pb-8 mt-8 mb-8 border-b-[1px] border-[rgba(255,255,255,0.3)]">
              {isTabDisplayed(fixture) && fixture.statistics.length > 0 ? (
                <TabTitle title="Statistics" />
              ) : (
                false
              )}
              {isTabDisplayed(fixture) && fixture.events.length > 0 ? (
                <TabTitle title="Events" />
              ) : (
                false
              )}
              {isTabDisplayed(fixture) && fixture.lineups.length > 0 ? (
                <TabTitle title="Lineups" />
              ) : (
                false
              )}
              <TabTitle title="Table" />
              <TabTitle title="H2H" />
            </TabList>
            <TabPanels className="w-full">
              {isTabDisplayed(fixture) && fixture.statistics.length > 0 ? (
                <TabPanel>
                  <FixtureStatistics statistics={fixture.statistics} />
                </TabPanel>
              ) : (
                false
              )}
              {isTabDisplayed(fixture) && fixture.events.length > 0 ? (
                <TabPanel>
                  <FixtureEvents
                    events={fixture.events}
                    participants={fixture.participants}
                    periods={fixture.periods}
                  />
                </TabPanel>
              ) : (
                false
              )}
              {isTabDisplayed(fixture) && fixture.lineups.length > 0 ? (
                <TabPanel>
                  <FixtureLineups fixture={fixture} />
                </TabPanel>
              ) : (
                false
              )}

              <TabPanel>
                <FixtureTable fixture={fixture} />
              </TabPanel>
              <TabPanel>
                <FixtureHead2Head
                  participants={fixture.participants}
                  league={fixture.league}
                />
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </>
      ) : isLoading ? null : (
        <div className="text-center py-12 text-[rgba(255,255,255,0.6)]">
          Fixture not found.
        </div>
      )}
    </main>
  );
}
