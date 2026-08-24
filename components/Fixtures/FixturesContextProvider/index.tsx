"use client";

import { createContext, useCallback, useEffect, useRef, useState } from "react";

import { getErrorMessage, isAbortError } from "@/services/Api";
import { getTodaysDate } from "@/services/Date";
import { isComplete } from "@/services/MatchStates";
import {
  areFixturesInPlay,
  getFixtures,
  updateFixtures,
} from "@/services/Fixtures";
import { Fixture } from "@/typings";

const POLL_INTERVAL_MS = 5000;
const CLOCK_INTERVAL_MS = 1000;

type FixturesContextType = {
  fixtures: Fixture[];
  fixturesInPlay: boolean;
  todaysDate: string;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
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
  const [todaysDate, setTodaysDate] = useState<string>(() => getTodaysDate());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState<number>(0);

  /*
    Polling reads the current fixture list through a ref rather than through
    the `fixtures` state variable directly.

    The interval callback is created once, so anything it closes over is
    frozen at that moment. Reading `fixtures` there would merge every update
    into the list as it stood when the interval started, quietly discarding
    scores. The ref always points at the latest list.
  */
  const fixturesRef = useRef<Fixture[]>([]);
  fixturesRef.current = fixtures;

  /*
    Likewise for the in-play flag. It is deliberately *not* an effect
    dependency: making it one tore the interval down and rebuilt it on every
    kickoff and full-time whistle, so polls were dropped or doubled up.
  */
  const fixturesInPlayRef = useRef<boolean>(fixturesInPlay);
  fixturesInPlayRef.current = fixturesInPlay;

  const retry = useCallback(() => {
    setError(null);
    setIsLoading(true);
    setReloadKey((key) => key + 1);
  }, []);

  // Initial load, and any explicit retry.
  useEffect(() => {
    const controller = new AbortController();

    getFixtures(controller.signal)
      .then((response) => {
        setFixtures(response);
        setFixturesInPlay(areFixturesInPlay(response));
        setError(null);
      })
      .catch((cause) => {
        if (isAbortError(cause)) return;

        setError(getErrorMessage(cause));
      })
      .finally(() => {
        // Only clears once the request has actually settled. Previously this
        // ran synchronously at the end of the effect, so the skeleton vanished
        // before any data existed.
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [todaysDate, reloadKey]);

  // Live polling. One interval for the lifetime of the provider.
  useEffect(() => {
    const controller = new AbortController();

    const poll = () => {
      if (!fixturesInPlayRef.current) return;

      getFixtures(controller.signal)
        .then((response) => {
          if (response.length === 0) return;

          const merged = updateFixtures(response, fixturesRef.current);

          setFixtures(merged);
          setFixturesInPlay(areFixturesInPlay(merged));
        })
        .catch((cause) => {
          // A failed poll is not worth tearing the page down over: the last
          // good scores stay on screen and the next tick tries again.
          if (!isAbortError(cause)) console.error("[poll]", cause);
        });
    };

    const pollTimer = setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      clearInterval(pollTimer);
      controller.abort();
    };
  }, []);

  /*
    Clock. Two jobs: notice the local day rolling over, and notice the first
    kickoff of the day so polling starts without waiting for a page refresh.
  */
  useEffect(() => {
    const clockTimer = setInterval(() => {
      const date = getTodaysDate();

      setTodaysDate((current) => (current === date ? current : date));

      if (fixturesInPlayRef.current) return;

      const nowInSeconds = Date.now() / 1000;

      /*
        Start polling once any fixture that has not already finished passes
        its kickoff time. We cannot wait for a live state_id here: state only
        changes in data we have not fetched yet, so requiring it would mean
        polling never starts.

        The old check looked solely at fixtures[0], assuming the API returned
        them in kickoff order. It does not.
      */
      const hasKickedOff = fixturesRef.current.some(
        (fixture) =>
          !isComplete(fixture) && nowInSeconds >= fixture.starting_at_timestamp
      );

      if (hasKickedOff) setFixturesInPlay(true);
    }, CLOCK_INTERVAL_MS);

    return () => clearInterval(clockTimer);
  }, []);

  return (
    <FixturesContext.Provider
      value={{ fixtures, fixturesInPlay, todaysDate, isLoading, error, retry }}
    >
      {children}
    </FixturesContext.Provider>
  );
}
