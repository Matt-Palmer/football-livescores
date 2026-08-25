"use client";

import React, { createContext, useCallback, useEffect, useRef, useState } from "react";

import { getErrorMessage, isAbortError, postJson } from "@/services/Api";
import { isComplete, isInplay } from "@/services/MatchStates";
import { Fixture } from "@/typings";

const POLL_INTERVAL_MS = 5000;
const CLOCK_INTERVAL_MS = 1000;

type FixtureContextType = {
  fixture: Fixture | null;
  isFixtureInPlay: boolean;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
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
  const [isFixtureInPlay, setIsFixtureInPlay] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState<number>(0);

  /*
    The polling interval is created once per fixture id, so it must not close
    over `fixture` or `isFixtureInPlay` directly — those values would be
    frozen at the moment the interval was created. Refs give the callback a
    live view instead.

    This also keeps `isFixtureInPlay` out of the effect dependencies. It used
    to be listed there, which meant every kickoff and final whistle destroyed
    and rebuilt the interval, firing an extra request each time.
  */
  const fixtureRef = useRef<Fixture | null>(fixture);

  const isInPlayRef = useRef<boolean>(isFixtureInPlay);

  /*
    Synced in effects, not during render: under React 19 a discarded render
    would otherwise leave these refs holding values from work that never
    committed. Declared ahead of the interval effects so they run first.
  */
  useEffect(() => {
    fixtureRef.current = fixture;
  }, [fixture]);

  useEffect(() => {
    isInPlayRef.current = isFixtureInPlay;
  }, [isFixtureInPlay]);

  const retry = useCallback(() => {
    setError(null);
    setIsLoading(true);
    setReloadKey((key) => key + 1);
  }, []);

  // Initial load, and any explicit retry.
  useEffect(() => {
    const controller = new AbortController();

    postJson<Fixture>("Fixture", { id }, controller.signal)
      .then((response) => {
        setFixture(response);
        setIsFixtureInPlay(isInplay(response));
        setError(null);
      })
      .catch((cause) => {
        if (isAbortError(cause)) return;

        setError(getErrorMessage(cause));
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    // The signal is now actually passed to the request. The previous version
    // built an AbortController, threaded the signal through a helper, and
    // never handed it to fetch, so nothing was ever cancelled.
    return () => controller.abort();
  }, [id, reloadKey]);

  // Live polling while the match is in play.
  useEffect(() => {
    const controller = new AbortController();

    const poll = () => {
      if (!isInPlayRef.current) return;

      postJson<Fixture>("Fixture", { id }, controller.signal)
        .then((response) => {
          setFixture(response);

          if (isComplete(response) && response.result_info) {
            setIsFixtureInPlay(false);
          }
        })
        .catch((cause) => {
          if (!isAbortError(cause)) console.error("[poll]", cause);
        });
    };

    const pollTimer = setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      clearInterval(pollTimer);
      controller.abort();
    };
  }, [id]);

  // Starts polling when a fixture that has not finished reaches kickoff.
  useEffect(() => {
    const clockTimer = setInterval(() => {
      const current = fixtureRef.current;

      if (!current || isInPlayRef.current || isComplete(current)) return;

      if (Date.now() / 1000 >= current.starting_at_timestamp) {
        setIsFixtureInPlay(true);
      }
    }, CLOCK_INTERVAL_MS);

    return () => clearInterval(clockTimer);
  }, []);

  return (
    <FixtureContext.Provider
      value={{ fixture, isFixtureInPlay, isLoading, error, retry }}
    >
      {children}
    </FixtureContext.Provider>
  );
}
