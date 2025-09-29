"use client";

import { useEffect, useState } from "react";

import { db } from "@/services/Firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { getFetchUrl } from "@/utils/getFetchUrls";
import { Fixture, League, Participant } from "@/typings";
import FixturesLeagueList from "../../Shared/FixturesLeagueList";

type FixtureHead2HeadProps = {
  participants: Participant[];
  league: League;
};

function FixtureHead2Head({ participants, league }: FixtureHead2HeadProps) {
  const [previousFixtures, setPreviousFixtures] = useState<Fixture[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getHead2HeadData = async () => {
      const homeTeamId = participants.find(
        (participant) => participant.meta.location === "home"
      );
      const awayTeamId = participants.find(
        (participant) => participant.meta.location === "away"
      );

      const result = await fetch(getFetchUrl(`api/Fixture/Head2Head`), {
        method: "POST",
        body: JSON.stringify({
          home_team_id: `${homeTeamId?.id}`,
          away_team_id: `${awayTeamId?.id}`,
        }),
      });

      const response = await result.json();

      setPreviousFixtures(response);
      setIsLoading(false);
    };

    getHead2HeadData();
  }, []);

  const getSummary = () => {
    let homeTeamWins = 0;
    let awayTeamWins = 0;
    let draws = 0;

    const homeTeam = participants.find(
      (participant) => participant.meta.location === "home"
    );
    const awayTeam = participants.find(
      (participant) => participant.meta.location === "away"
    );

    previousFixtures.forEach((previousFixture) => {
      if (previousFixture.state_id === 5) {
        const winningTeam = previousFixture.participants.find(
          (participant) => participant.meta.winner
        );

        if (winningTeam?.id === homeTeam?.id) {
          homeTeamWins++;
        } else if (winningTeam?.id === awayTeam?.id) {
          awayTeamWins++;
        } else {
          draws++;
        }
      }

      if (previousFixture.state_id === 7) {
        const aetScores = previousFixture.scores.filter(
          (score) => score.description === "CURRENT"
        );
        const homeTeamScore = aetScores.find(
          (score) => score.participant_id === homeTeam?.id
        );
        const awayTeamScore = aetScores.find(
          (score) => score.participant_id === awayTeam?.id
        );

        if (homeTeamScore?.score.goals && awayTeamScore?.score.goals) {
          if (homeTeamScore?.score.goals > awayTeamScore?.score.goals) {
            homeTeamWins++;
          } else if (homeTeamScore?.score.goals < awayTeamScore?.score.goals) {
            awayTeamWins++;
          } else {
            draws++;
          }
        }
      }
    });

    const total = previousFixtures.length;
    const homeWinsPercent = (homeTeamWins / total) * 100;
    const drawsPercent = (draws / total) * 100;
    const awayWinsPercent = (awayTeamWins / total) * 100;

    return (
      <div>
        <p className="mb-4 text-center">Overall</p>
        <div className="flex justify-center mb-2 mx-[2px]">
          <div className="flex flex-1 justify-between px-4">
            <span>Wins</span>
            <span>{homeTeamWins}</span>
          </div>
          <div className="flex flex-1 justify-between px-4">
            <span>Draws</span>
            <span>{draws}</span>
          </div>
          <div className="flex flex-1 justify-between px-4">
            <span>Wins</span>
            <span>{awayTeamWins}</span>
          </div>
        </div>
        <div className="flex justify-center">
          {homeTeamWins !== 0 ? (
            <div
              style={{ width: `${homeWinsPercent}%` }}
              className={`h-1 bg-[#EFEF3E] rounded-full mx-[2px]`}
            ></div>
          ) : null}

          {draws !== 0 ? (
            <div
              style={{ width: `${drawsPercent}%` }}
              className={`h-1 bg-white rounded-full mx-[2px]`}
            ></div>
          ) : null}

          {awayTeamWins !== 0 ? (
            <div
              style={{ width: `${awayWinsPercent}%` }}
              className={`h-1 bg-[#3F576C] rounded-full mx-[2px]`}
            ></div>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <>
      {!isLoading ? (
        <>
          {previousFixtures.length > 0 ? (
            <div className="flex flex-col-reverse lg:flex-row w-full max-w-[600px] lg:max-w-[900px] lg:gap-8 m-auto">
              <div className="w-full flex-1">
                <FixturesLeagueList
                  countryId={league.country_id}
                  fixtures={previousFixtures.splice(0, 5)}
                />
              </div>

              <div className="w-full flex-1 pb-8 mb-8 border-b-[1px] border-[rgba(255,255,255,0.3)] lg:border-none">
                {getSummary()}
              </div>
            </div>
          ) : (
            <div>No Results</div>
          )}
        </>
      ) : (
        <div className="flex flex-col-reverse lg:flex-row max-w-[600px] lg:max-w-[900px] lg:gap-8 m-auto">
          <div className="w-full">
            <div className="mb-4">
              <div className="flex h-[24px] w-1/3 mb-2">
                <div className="h-full w-[24px] mr-2 animate-pulse bg-[#3f576c]"></div>
                <div className="h-full w-full animate-pulse bg-[#3f576c]"></div>
              </div>
              {Array.from({ length: 2 }).map((item, index) => (
                <div
                  key={`1-${index}`}
                  className="bg-[#3f576c] animate-pulse h-[48px] md:h-[52px] w-full mb-1"
                ></div>
              ))}
            </div>

            <div className="mb-4">
              <div className="flex h-[24px] w-1/3 mb-2">
                <div className="h-full w-[24px] mr-2 animate-pulse bg-[#3f576c]"></div>
                <div className="h-full w-full animate-pulse bg-[#3f576c]"></div>
              </div>
              {Array.from({ length: 3 }).map((item, index) => (
                <div
                  key={`2-${index}`}
                  className="bg-[#3f576c] animate-pulse h-[48px] md:h-[52px] w-full mb-1"
                ></div>
              ))}
            </div>
          </div>
          <div className="w-full">
            <div className="h-[20px] w-[100px] mx-auto mb-4 animate-pulse bg-[#3f576c]"></div>
            <div className="flex h-[20px] w-full gap-1 mb-2">
              <div className="h-full w-1/3 animate-pulse bg-[#3f576c]"></div>
              <div className="h-full w-1/3 animate-pulse bg-[#3f576c]"></div>
              <div className="h-full w-1/3 animate-pulse bg-[#3f576c]"></div>
            </div>
            <div className="flex h-[5px] w-full gap-1 mb-8">
              <div className="h-full w-1/3 animate-pulse bg-[#3f576c]"></div>
              <div className="h-full w-1/3 animate-pulse bg-[#3f576c]"></div>
              <div className="h-full w-1/3 animate-pulse bg-[#3f576c]"></div>
            </div>
            <div className="h-[1px] w-full mb-8 animate-pulse bg-[#3f576c] lg:hidden"></div>
          </div>
        </div>
      )}
    </>
  );
}

export default FixtureHead2Head;
