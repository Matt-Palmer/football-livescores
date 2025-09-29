"use client";

import { Tab } from "@headlessui/react";

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
      className={`ui-selected:bg-[#EFEF3E] ui-selected:text-black ui-selected:outline-none h-[30px] md:h-[40px] px-6 flex-1 rounded-full`}
    >
      {title}
    </Tab>
  );
}

export default function FixtureComponent() {
  const { fixture } = useFixtureContext();

  return (
    <main className="flex flex-col w-full overflow-x-hidden px-4 mx-auto mb-16">
      {fixture ? (
        <>
          <FixtureInformation fixture={fixture} />

          <Tab.Group>
            <Tab.List className="flex overflow-x-scroll pb-8 mt-8 mb-8 border-b-[1px] border-[rgba(255,255,255,0.3)]">
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
            </Tab.List>
            <Tab.Panels className="w-full">
              {isTabDisplayed(fixture) && fixture.statistics.length > 0 ? (
                <Tab.Panel>
                  <FixtureStatistics statistics={fixture.statistics} />
                </Tab.Panel>
              ) : (
                false
              )}
              {isTabDisplayed(fixture) && fixture.events.length > 0 ? (
                <Tab.Panel>
                  <FixtureEvents
                    events={fixture.events}
                    participants={fixture.participants}
                    periods={fixture.periods}
                  />
                </Tab.Panel>
              ) : (
                false
              )}
              {isTabDisplayed(fixture) && fixture.lineups.length > 0 ? (
                <Tab.Panel>
                  <FixtureLineups fixture={fixture} />
                </Tab.Panel>
              ) : (
                false
              )}

              <Tab.Panel>
                <FixtureTable fixture={fixture} />
              </Tab.Panel>
              <Tab.Panel>
                <FixtureHead2Head
                  participants={fixture.participants}
                  league={fixture.league}
                />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </>
      ) : (
        false
      )}
    </main>
  );
}
