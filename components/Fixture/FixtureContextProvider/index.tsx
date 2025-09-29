"use client";

import { isComplete, isInplay } from "@/services/MatchStates";
import { Fixture } from "@/typings";
import { getFetchUrl } from "@/utils/getFetchUrls";
import React, { createContext, useEffect, useRef, useState } from "react";

type FixtureContextType = {
  fixture: Fixture | null;
  isFixtureInPlay: boolean;
};

type FixtureContextProviderType = {
  id: string;
  children: React.ReactNode;
};

export const FixtureContext = createContext<FixtureContextType | null>(null);

export default function FixtureContextProvider({
  id,
  children,
}: FixtureContextProviderType) {
  const [fixture, setFixture] = useState<Fixture | null>(null);
  const [isFixtureInPlay, setIsFixtureInPlay] = useState<boolean>(true);

  let fixtureRef = useRef<any>();
  let clock = useRef<number>();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    let updateFixtureInterval: NodeJS.Timer;
    let clockIntervalTimer: NodeJS.Timer;

    const getFixture = async (signal: AbortSignal) => {
      try {
        const result = await fetch(getFetchUrl(`api/Fixture/`), {
          method: "POST",
          body: JSON.stringify({
            id: id,
          }),
        });

        const response = await result.json();

        return response;
      } catch (error) {
        console.error(error);
      }
    };

    getFixture(signal).then((response) => {
      setIsFixtureInPlay(isInplay(response));

      setFixture(response);

      fixtureRef.current = response;

      if (!isComplete(response)) {
        clockIntervalTimer = setInterval(() => {
          clock.current = Date.now() / 1000;
          if (
            !isFixtureInPlay &&
            clock.current >= fixtureRef.current.starting_at_timestamp
          ) {
            setIsFixtureInPlay(true);
          }
        }, 1000);
      }
    });

    if (isFixtureInPlay) {
      updateFixtureInterval = setInterval(() => {
        getFixture(signal).then((response) => {
          if (isComplete(response) && response.result_info)
            setIsFixtureInPlay(false);

          setFixture(response);
        });
      }, 5000);
    }

    return () => {
      clearInterval(updateFixtureInterval);
      clearInterval(clockIntervalTimer);
      controller.abort();
    };
  }, [id, isFixtureInPlay]);

  return (
    <FixtureContext.Provider value={{ fixture, isFixtureInPlay }}>
      {children}
    </FixtureContext.Provider>
  );
}
