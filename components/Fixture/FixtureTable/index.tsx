"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { getErrorMessage, isAbortError, postJson } from "@/services/Api";
import {
  Detail,
  Fixture,
  FixtureTable as LeagueTable,
  Participant,
  Rule,
  Standing,
} from "@/typings";
import { getParticipant } from "@/services/Participants";
import { sportmonksTypes } from "@/utils/Sportmonks/Types";
import LogoBadge from "@/components/Shared/LogoBadge";

type FixtureTableProps = {
  fixture: Fixture;
};

/*
  Groups the standings rows that belong to the same stage (and group, where a
  competition has them) as the given participant.

  Hoisted out of the component so it is a stable reference: as an inner
  function it was recreated on every render, which is why the effect below had
  to omit it from its dependencies to avoid refetching on every poll.
*/
const buildLeague = (
  response: Standing[],
  leagues: LeagueTable[],
  participant: Standing,
  competitionName: string
): LeagueTable | null => {
  // Already built for this stage.
  if (leagues.some((item: LeagueTable) => item.id === participant.stage_id))
    return null;

  const groupName: string = participant.group
    ? " - " + participant.group.name
    : "";

  let leagueEntries: Standing[] = response.filter(
    (leagueEntry: Standing) => leagueEntry.stage_id === participant.stage_id
  );

  if (participant.group_id !== null) {
    leagueEntries = leagueEntries.filter(
      (leagueEntry: Standing) => leagueEntry.group_id === participant.group_id
    );
  }

  return {
    name: competitionName + groupName,
    id: participant.stage_id,
    standings: leagueEntries,
  };
};

function FixtureTable({ fixture }: FixtureTableProps) {
  const [fixtureTableData, setFixtureTableData] = useState<LeagueTable[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /*
    A league table does not change during a match, so this is keyed on the
    season and the two teams rather than on the fixture object. The parent
    re-renders every five seconds while a match is live; without this the
    standings would be refetched on every one of those polls.
  */
  const seasonId = fixture.season_id;
  const competitionName = fixture.league.name;
  const homeTeamId = getParticipant(fixture.participants, "home")?.id;
  const awayTeamId = getParticipant(fixture.participants, "away")?.id;

  useEffect(() => {
    const controller = new AbortController();

    postJson<Standing[]>(
      `Season/${seasonId}`,
      { seasonId: `${seasonId}` },
      controller.signal
    )
      .then((response) => {
        const standings = Array.isArray(response) ? response : [];

        // Only the two teams in this fixture decide which tables to show.
        const participantEntries: Standing[] = standings.filter(
          (item: Standing) =>
            item.participant.id === homeTeamId ||
            item.participant.id === awayTeamId
        );

        const leagues: LeagueTable[] = [];

        participantEntries.forEach((participantEntry: Standing) => {
          const newLeague = buildLeague(
            standings,
            leagues,
            participantEntry,
            competitionName
          );

          if (newLeague) leagues.push(newLeague);
        });

        setFixtureTableData(leagues);
        setError(null);
      })
      .catch((cause) => {
        if (isAbortError(cause)) return;

        setError(getErrorMessage(cause));
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [seasonId, homeTeamId, awayTeamId, competitionName]);

  const getPositionColourIndicator = (rule: Rule | null): string => {
    switch (rule?.type_id) {
      case 147:
      case 168:
      case 180:
      case 183:
      case 267:
      case 268:
      case 255:
      case 257:
      case 275:
      case 279:
      case 284:
        return "bg-[#3bb552]";
      case 260:
      case 269:
      case 246:
        return "bg-[#80ea79]";
      case 181:
      case 263:
      case 264:
      case 265:
      case 278:
        return "bg-[#288eea]";
      case 293:
      case 299:
        return "bg-[#0ad8d8]";
      case 289:
        return "bg-[#2f9d9d]";
      case 249:
        return "bg-[#ffb936]";
      case 182:
      case 184:
        return "bg-[#ef5158]";
      default:
        return "border-transparent";
    }
  };

  /*
    Only the colours actually used in this table, each labelled with the
    Sportmonks rule name(s) that map to it — so a table for a league with no
    European qualification shows no Champions League swatch.
  */
  const getLegendEntries = (
    standings: Standing[]
  ): { colourClass: string; label: string }[] => {
    const namesByColour = new Map<string, Set<string>>();

    standings.forEach((team) => {
      const colourClass = getPositionColourIndicator(team.rule);

      if (colourClass === "border-transparent") return;

      const name = sportmonksTypes.find(
        (type) => type.id === team.rule?.type_id
      )?.name;

      if (!name) return;

      if (!namesByColour.has(colourClass)) namesByColour.set(colourClass, new Set());

      namesByColour.get(colourClass)!.add(name);
    });

    return Array.from(namesByColour.entries()).map(([colourClass, names]) => ({
      colourClass,
      label: Array.from(names).join(" / "),
    }));
  };

  const isActiveTeam = (teamId: number): string => {
    const homeTeam: Participant | undefined = fixture.participants.find(
      (team) => team.meta.location === "home"
    );
    const awayTeam: Participant | undefined = fixture.participants.find(
      (team) => team.meta.location === "away"
    );

    if (teamId === homeTeam?.id || teamId === awayTeam?.id) {
      return "text-white bg-[rgba(255,255,255,0.1)] border-transparent";
    }

    return "text-[rgba(255,255,255,0.6)] border-[rgba(255,255,255,0.1)]";
  };

  const getDetail = (
    team: Standing,
    standingDetailId: number
  ): number | undefined => {
    const detail: Detail | undefined = team.details.find(
      (detail: Detail) => detail.type_id === standingDetailId
    );

    return detail?.value;
  };

  return (
    <>
      {error ? (
        <div className="text-center py-8">
          <p className="mb-1">Couldn&apos;t load the league table.</p>
          <p className="text-sm text-[rgba(255,255,255,0.6)]">{error}</p>
        </div>
      ) : !isLoading ? (
        <div className="flex flex-col items-center">
          {fixtureTableData.map((league) => {
            const legendEntries = getLegendEntries(league.standings ?? []);

            return (
            <div
              key={league.id}
              className="overflow-hidden w-full max-w-[700px] table-auto mb-8"
            >
              <div className="flex items-center mb-4">
                <LogoBadge
                  src={fixture.league.image_path}
                  alt="Competition logo"
                  className="h-[24px] w-[24px] mr-4"
                  sizes="(max-width: 1200px) 24px, 24px"
                  priority={true}
                />
                <p>{league.name}</p>
              </div>

              <div className="text-center text-[rgba(255,255,255,0.6)] flex border-b-[1px] border-[rgba(255,255,255,0.1)]">
                <span className="w-[30px] text-sm md:text-base py-2">#</span>
                <span className="text-sm text-left md:text-base p-2 flex-1">
                  Team
                </span>
                <span className="w-[30px] text-sm md:text-base md:w-[40px] py-2">
                  P
                </span>
                <span className="hidden sm:block w-[30px] text-sm md:text-base md:w-[40px] py-2">
                  W
                </span>
                <span className="hidden sm:block w-[30px] text-sm md:text-base md:w-[40px] py-2">
                  D
                </span>
                <span className="hidden sm:block w-[30px] text-sm md:text-base md:w-[40px] py-2">
                  L
                </span>
                <span className="w-[40px] text-sm md:text-base md:w-[50px] py-2">
                  Goals
                </span>
                <span className="w-[30px] text-sm md:text-base md:w-[40px] py-2">
                  Pts
                </span>
              </div>
              {league.standings &&
                league.standings.map((team) => (
                  <div
                    key={team.id}
                    className={`relative flex overflow-hidden border-b-[1px] ${isActiveTeam(
                      team.participant.id
                    )}`}
                  >
                    <span
                      className={`absolute top-1/2 -translate-y-1/2 rounded-sm left-0 h-1/2 w-[3px] ${getPositionColourIndicator(
                        team.rule
                      )}`}
                    ></span>
                    <span
                      className={`w-[30px] text-sm md:text-base md:w-[40px] py-2 text-center`}
                    >
                      {team.position}
                    </span>
                    <span className="flex text-left p-2 flex-1">
                      <div className="hidden relative h-[24px] w-[24px]">
                        <Image
                          src={team.participant.image_path}
                          fill={true}
                          style={{ objectFit: "contain" }}
                          sizes="(max-width: 1200px) 24px, 24px"
                          alt="Team Logo"
                          priority={true}
                        />
                      </div>
                      <span className="text-sm md:text-base">
                        {team.participant.name}
                      </span>
                    </span>
                    <span className="w-[30px] text-sm md:text-base md:w-[40px] py-2 text-center">
                      {getDetail(team, 129)}
                    </span>
                    <span className="hidden sm:block w-[30px] text-sm md:text-base md:w-[40px] py-2 text-center">
                      {getDetail(team, 130)}
                    </span>
                    <span className="hidden sm:block w-[30px] text-sm md:text-base md:w-[40px] py-2 text-center">
                      {getDetail(team, 131)}
                    </span>
                    <span className="hidden sm:block w-[30px] text-sm md:text-base md:w-[40px] py-2 text-center">
                      {getDetail(team, 132)}
                    </span>
                    <span className="w-[40px] text-sm md:text-base md:w-[50px] py-2 text-center">
                      {getDetail(team, 133)}:{getDetail(team, 134)}
                    </span>
                    <span className="w-[30px] text-sm md:text-base md:w-[40px] py-2 text-center">
                      {getDetail(team, 187)}
                    </span>
                  </div>
                ))}

              {legendEntries.length > 0 ? (
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
                  {legendEntries.map((entry) => (
                    <div
                      key={entry.colourClass}
                      className="flex items-center gap-2 text-xs text-[rgba(255,255,255,0.6)]"
                    >
                      <span
                        className={`inline-block w-3 h-3 rounded-sm ${entry.colourClass}`}
                      ></span>
                      <span>{entry.label}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            );
          })}
        </div>
      ) : (
        <div className="max-w-[700px] m-auto">
          <div className="flex h-[24px] w-1/3 mb-2">
            <div className="h-full w-[24px] mr-2 animate-pulse bg-[#3f576c]"></div>
            <div className="h-full w-full animate-pulse bg-[#3f576c]"></div>
          </div>
          {Array.from({ length: 10 }).map((item, index) => (
            <div
              key={index}
              className="bg-[#3f576c] animate-pulse h-[36px] md:h-[40px] w-full mb-1"
            ></div>
          ))}
        </div>
      )}
    </>
  );
}

export default FixtureTable;
