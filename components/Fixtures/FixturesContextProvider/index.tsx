"use client";

import { getTodaysDate } from "@/services/Date";
import {
  areFixturesInPlay,
  getFixtures,
  updateFixtures,
} from "@/services/Fixtures";
import { Fixture } from "@/typings";
import { createContext, useEffect, useRef, useState } from "react";

type FixturesContextType = {
  fixtures: Fixture[];
  fixturesInPlay: boolean;
  todaysDate: string;
  isLoading: boolean;
};

type FixturesContextProviderType = {
  children: React.ReactNode;
};

export const FixturesContext = createContext<FixturesContextType | null>(null);

export default function FixturesContextProvider({
  children,
}: FixturesContextProviderType) {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [fixturesInPlay, setFixturesInPlay] = useState<boolean>(false);
  const [todaysDate, setTodaysDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const fixtureCompleteStateIds = [5, 7, 8, 10, 11, 12, 15, 20];

  let todaysFixtures = useRef<any[]>([]);
  let clock = useRef<number>();

  useEffect(() => {
    let fixturesInPlayInterval: NodeJS.Timer;

    if (!fixturesInPlay) {
      getFixtures().then((response: Fixture[]) => {
        if (response.length > 0) {
          todaysFixtures.current = response.filter(
            (fixture: Fixture) =>
              !fixtureCompleteStateIds.includes(fixture.state_id)
          );

          setFixtures(response);
          setFixturesInPlay(areFixturesInPlay(response));
        }
      });
    } else {
      fixturesInPlayInterval = setInterval(() => {
        getFixtures().then((response) => {
          if (!response || response.length <= 0) {
            setFixturesInPlay(false);
            clearInterval(fixturesInPlayInterval);
          } else {
            setFixtures(updateFixtures(response, fixtures));
          }
        });
      }, 5000);
    }

    const clockIntervalTimer = setInterval(() => {
      clock.current = Date.now() / 1000;
      const date = getTodaysDate();

      if (todaysDate !== date) setTodaysDate(date);

      if (todaysFixtures.current.length <= 0) return;

      if (
        !fixturesInPlay &&
        clock.current >= todaysFixtures.current[0].starting_at_timestamp
      )
        setFixturesInPlay(true);
    }, 1000);

    setIsLoading(false);

    return () => {
      clearInterval(clockIntervalTimer);
      clearInterval(fixturesInPlayInterval);
    };
  }, [fixturesInPlay, todaysDate]);

  return (
    <FixturesContext.Provider
      value={{ fixtures, fixturesInPlay, todaysDate, isLoading }}
    >
      {children}
    </FixturesContext.Provider>
  );
}
