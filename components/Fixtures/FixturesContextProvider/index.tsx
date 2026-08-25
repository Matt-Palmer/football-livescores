"use client";

import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
const DATE_PARAM = "date";

type FixturesContextType = {
  fixtures: Fixture[];
  fixturesInPlay: boolean;
  selectedDate: string;
  isToday: boolean;
  goToDate: (date: string) => void;
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /*
    `clockDate` always tracks the real current date in the viewer's
    timezone — it is what "today" resolves to, independent of whatever date
    the viewer has navigated to. `selectedDate` falls back to it whenever the
    URL has no explicit ?date, which is what makes the homepage default to
    today without ever resolving "today" on the server (the server does not
    know the viewer's timezone).
  */
  const [clockDate, setClockDate] = useState<string>(() => getTodaysDate());
  const dateParam = searchParams.get(DATE_PARAM);
  const selectedDate = dateParam ?? clockDate;
  const isToday = selectedDate === clockDate;

  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [fixturesInPlay, setFixturesInPlay] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState<number>(0);

  /*
    `isLoading` is derived rather than set at the top of the fetch effect
    below. Calling setState synchronously in an effect body forces an extra
    render pass and trips `set-state-in-effect`; comparing keys instead means
    a date change flips `isLoading` true on the very same render that changed
    it, and the effect only ever calls setState from its async continuation.
  */
  const [settledFetchKey, setSettledFetchKey] = useState<string | null>(null);
  const fetchKey = `${selectedDate}:${reloadKey}`;
  const isLoading = settledFetchKey !== fetchKey;

  /*
    Polling reads the current fixture list through a ref rather than through
    the `fixtures` state variable directly.

    The interval callback is created once, so anything it closes over is
    frozen at that moment. Reading `fixtures` there would merge every update
    into the list as it stood when the interval started, quietly discarding
    scores. The ref always points at the latest list.
  */
  const fixturesRef = useRef<Fixture[]>(fixtures);

  /*
    Likewise for the in-play flag. It is deliberately *not* an effect
    dependency: making it one tore the interval down and rebuilt it on every
    kickoff and full-time whistle, so polls were dropped or doubled up.
  */
  const fixturesInPlayRef = useRef<boolean>(fixturesInPlay);

  /*
    And for whether the viewer is currently looking at today. Polling and
    kickoff-detection only make sense for today's fixtures — a fixture list
    for a past or future date will never go live — so the clock and poll
    intervals below both gate on this ref rather than closing over a stale
    boolean from whenever the interval was created.
  */
  const isTodayRef = useRef<boolean>(isToday);

  /*
    Refs are synced in effects rather than assigned during render. Under React
    19 a render can be discarded before it commits, and a ref written during
    that render would keep a value from work that never happened.

    Declared before the interval effects below so that on mount they run
    first, and the timers never observe a stale ref.
  */
  useEffect(() => {
    fixturesRef.current = fixtures;
  }, [fixtures]);

  useEffect(() => {
    fixturesInPlayRef.current = fixturesInPlay;
  }, [fixturesInPlay]);

  useEffect(() => {
    isTodayRef.current = isToday;
  }, [isToday]);

  const retry = useCallback(() => {
    setError(null);
    setReloadKey((key) => key + 1);
  }, []);

  const goToDate = useCallback(
    (date: string) => {
      const params = new URLSearchParams(searchParams.toString());

      // Keeps the URL clean (no ?date at all) whenever it lands back on
      // today, rather than pinning to today's literal date string.
      if (date === clockDate) {
        params.delete(DATE_PARAM);
      } else {
        params.set(DATE_PARAM, date);
      }

      const query = params.toString();

      router.push(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [searchParams, router, pathname, clockDate]
  );

  // Load fixtures whenever the selected date changes, and on any explicit
  // retry.
  useEffect(() => {
    const controller = new AbortController();

    getFixtures(selectedDate, controller.signal)
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
        // Only marks this fetch settled once it has actually finished, so
        // `isLoading` stays true for the whole request rather than clearing
        // before any data exists.
        if (!controller.signal.aborted) setSettledFetchKey(fetchKey);
      });

    return () => controller.abort();
  }, [selectedDate, reloadKey, fetchKey]);

  // Live polling. One interval for the lifetime of the provider.
  useEffect(() => {
    const controller = new AbortController();

    const poll = () => {
      if (!isTodayRef.current || !fixturesInPlayRef.current) return;

      getFixtures(selectedDate, controller.signal)
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
  }, [selectedDate]);

  /*
    Clock. Two jobs: notice the local day rolling over, and notice the first
    kickoff of the day so polling starts without waiting for a page refresh.
    Both are only meaningful while the viewer is looking at today.
  */
  useEffect(() => {
    const clockTimer = setInterval(() => {
      const date = getTodaysDate();

      setClockDate((current) => (current === date ? current : date));

      if (!isTodayRef.current || fixturesInPlayRef.current) return;

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
      value={{
        fixtures,
        fixturesInPlay,
        selectedDate,
        isToday,
        goToDate,
        isLoading,
        error,
        retry,
      }}
    >
      {children}
    </FixturesContext.Provider>
  );
}
