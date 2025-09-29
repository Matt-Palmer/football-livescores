"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { db } from "@/services/Firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { getFetchUrl } from "@/utils/getFetchUrls";
import {
  Detail,
  Fixture,
  FixtureTable,
  Participant,
  Rule,
  Standing,
} from "@/typings";
import { getParticipant } from "@/services/Participants";

type FixtureTableProps = {
  fixture: Fixture;
};

function FixtureTable({ fixture }: FixtureTableProps) {
  const [fixtureTableData, setFixtureTableData] = useState<FixtureTable[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getLeagueData = async () => {
      // FETCH STANDINGS
      // Fetch the 'standings' for the current season from the API.
      const result = await fetch(
        getFetchUrl(`api/Season/${fixture.season_id}`),
        {
          method: "POST",
          body: JSON.stringify({
            seasonId: `${fixture.season_id}`,
          }),
        }
      );

      // Wait for the response from the API call.
      const response: Standing[] = await result.json();

      // FILTER STANDINGS
      // Get both participants in the fixture.
      const homeParticipant: Participant | undefined = getParticipant(
        fixture.participants,
        "home"
      );
      const awayParticipant: Participant | undefined = getParticipant(
        fixture.participants,
        "away"
      );

      /* 
        Filter out the the response to only include entries from the participating
        teams in the current fixture.
      */
      const participantEntries: Standing[] = response.filter(
        (item: Standing) =>
          item.participant.id === homeParticipant?.id ||
          item.participant.id === awayParticipant?.id
      );

      // SORT STANDINGS
      const leagues: FixtureTable[] = [];

      // Loop through each of the 'participant' entries to build league tables.
      participantEntries.forEach((participantEntry: Standing) => {
        // Build league table
        const newLeague: FixtureTable | null = buildLeague(
          response,
          leagues,
          participantEntry
        );

        // If a 'newLeague' was returned, push it into the 'leagues' array.
        if (newLeague) leagues.push(newLeague);
      });

      setIsLoading(false);

      return leagues;
    };

    // GET LEAGUE STANDINGS
    getLeagueData().then((response) => {
      // SET LEAGUE STANDINGS
      setFixtureTableData(response);
    });
  }, []);

  const buildLeague = (
    response: Standing[],
    league: FixtureTable[],
    participant: Standing
  ): FixtureTable | null => {
    const groupName: string = participant.group
      ? " - " + participant.group.name
      : "";
    const leagueName: string = fixture.league.name + groupName;

    let leagueEntries: Standing[] = response.filter(
      (leagueEntry: Standing) => leagueEntry.stage_id === participant.stage_id
    );

    if (participant.group_id !== null) {
      leagueEntries = leagueEntries.filter(
        (leagueEntry: Standing) => leagueEntry.group_id === participant.group_id
      );
    }

    const leagueItem = league.find(
      (item: FixtureTable) => item.id === participant.stage_id
    );

    if (leagueItem) return null;

    return {
      name: leagueName,
      id: participant.stage_id,
      standings: leagueEntries,
    };
  };

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
      {!isLoading ? (
        <div className="flex flex-col items-center">
          {fixtureTableData.map((league) => (
            <div
              key={league.id}
              className="overflow-hidden w-full max-w-[700px] table-auto mb-8"
            >
              <div className="flex mb-4">
                <div className="relative h-[24px] w-[24px] mr-4">
                  <Image
                    src={fixture.league.image_path}
                    fill={true}
                    style={{ objectFit: "contain" }}
                    sizes="(max-width: 1200px) 24px, 24px"
                    alt="Team Logo"
                    priority={true}
                  />
                </div>
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
            </div>
          ))}
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
