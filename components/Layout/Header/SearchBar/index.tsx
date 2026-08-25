"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import { postJson, isAbortError } from "@/services/Api";
import { sportmonksLeagues } from "@/utils/Sportmonks/Leagues";
import LogoBadge from "@/components/Shared/LogoBadge";

type LeagueResult = {
  id: number;
  name: string;
  image_path: string;
};

type TeamResult = {
  id: number;
  name: string;
  image_path: string;
};

const MAX_LEAGUE_RESULTS = 5;

function SearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [teamResults, setTeamResults] = useState<TeamResult[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const trimmedQuery = query.trim();

  // Derived rather than a separate boolean set from inside the effect: a
  // query is "still searching" exactly when it hasn't settled yet.
  const [settledQueryKey, setSettledQueryKey] = useState<string | null>(null);
  const isSearchingTeams =
    trimmedQuery.length >= 2 && settledQueryKey !== trimmedQuery;

  const leagueResults: LeagueResult[] =
    trimmedQuery.length >= 2
      ? (sportmonksLeagues as LeagueResult[])
          .filter((league) =>
            league.name.toLowerCase().includes(trimmedQuery.toLowerCase())
          )
          .slice(0, MAX_LEAGUE_RESULTS)
      : [];

  // Debounced team search against the new backend route — there is no local
  // team directory to filter client-side the way leagues can be.
  useEffect(() => {
    // Below the minimum length there is nothing to search, and the render
    // below already gates on trimmedQuery.length, so stale results from a
    // longer query just sit unused rather than needing to be cleared here.
    if (trimmedQuery.length < 2) return;

    const controller = new AbortController();

    const timer = setTimeout(() => {
      postJson<TeamResult[]>(
        "Search/Teams",
        { query: trimmedQuery },
        controller.signal
      )
        .then((results) => setTeamResults(results))
        .catch((cause) => {
          if (!isAbortError(cause)) setTeamResults([]);
        })
        .finally(() => {
          if (!controller.signal.aborted) setSettledQueryKey(trimmedQuery);
        });
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmedQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const closeAndReset = () => {
    setIsOpen(false);
    setQuery("");
  };

  const showResults =
    isOpen && trimmedQuery.length >= 2 && (leagueResults.length > 0 || teamResults.length > 0 || isSearchingTeams);
  const showEmptyState =
    isOpen &&
    trimmedQuery.length >= 2 &&
    !isSearchingTeams &&
    leagueResults.length === 0 &&
    teamResults.length === 0;

  return (
    <div ref={containerRef} className="relative w-full max-w-[260px]">
      <div className="flex items-center gap-2 bg-brand-surface border border-brand-border rounded-full px-3 py-1.5 focus-within:border-brand-gold/60">
        <MagnifyingGlassIcon className="w-4 h-4 text-brand-muted shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search teams, leagues"
          className="bg-transparent outline-none text-sm w-full placeholder:text-brand-muted"
          aria-label="Search teams and leagues"
        />
      </div>

      {(showResults || showEmptyState) && (
        <div className="absolute right-0 mt-2 w-[300px] bg-brand-surface border border-brand-border rounded-lg shadow-xl overflow-hidden z-50 max-h-[70vh] overflow-y-auto">
          {showEmptyState ? (
            <p className="px-4 py-6 text-sm text-brand-muted text-center">
              No results for &quot;{trimmedQuery}&quot;.
            </p>
          ) : (
            <>
              {leagueResults.length > 0 && (
                <div className="py-2">
                  <p className="px-4 pb-1 text-xs uppercase tracking-wide text-brand-muted">
                    Leagues
                  </p>
                  {leagueResults.map((league) => (
                    <Link
                      key={league.id}
                      href={`/League/${league.id}`}
                      onClick={closeAndReset}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-brand-surfaceHover"
                    >
                      <LogoBadge
                        src={league.image_path}
                        alt="League logo"
                        className="h-[20px] w-[20px]"
                        sizes="20px"
                      />
                      <span className="text-sm">{league.name}</span>
                    </Link>
                  ))}
                </div>
              )}

              {(teamResults.length > 0 || isSearchingTeams) && (
                <div className="py-2 border-t border-brand-border">
                  <p className="px-4 pb-1 text-xs uppercase tracking-wide text-brand-muted">
                    Teams
                  </p>
                  {isSearchingTeams && teamResults.length === 0 ? (
                    <p className="px-4 py-2 text-sm text-brand-muted">
                      Searching…
                    </p>
                  ) : (
                    teamResults.map((team) => (
                      <Link
                        key={team.id}
                        href={`/Team/${team.id}`}
                        onClick={closeAndReset}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-brand-surfaceHover"
                      >
                        <span className="relative h-[20px] w-[20px] shrink-0">
                          <Image
                            src={team.image_path || "/default-team-logo.svg"}
                            fill={true}
                            alt="Team logo"
                            style={{ objectFit: "contain" }}
                            sizes="20px"
                          />
                        </span>
                        <span className="text-sm">{team.name}</span>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
