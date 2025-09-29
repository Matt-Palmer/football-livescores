
import {
  isComplete,
  isInplay,
} from "@/services/MatchStates";
import { isTabDisplayed } from "@/utils/individualFixtureHelpers";
import { Fixture } from "@/typings";
import { MdStadium } from "react-icons/md";


type ScoreDisplayProps = {
  fixture: Fixture;
};

function ScoreDisplay({fixture}: ScoreDisplayProps ) {
  const getFixtureTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const fixtureStartTime = `${date.getHours()}:${
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
    }`;

    return fixtureStartTime;
  };

  const getCurrentScore = () => {
    const currentScores = fixture.scores.filter(
      (score) => score.description === "CURRENT"
    );

    const homeScore = currentScores?.find(
      (score) => score.score.participant === "home"
    );

    const awayScore = currentScores?.find(
      (score) => score.score.participant === "away"
    );

    const homeTeam = fixture.participants.find(
      (team) => team.meta.location === "home"
    );
    const awayTeam = fixture.participants.find(
      (team) => team.meta.location === "away"
    );

    let homeScoreClasses = "";
    let awayScoreClasses = "";

    if (isComplete(fixture) && !homeTeam?.meta.winner && awayTeam?.meta.winner)
      homeScoreClasses = "opacity-60";
    if (isComplete(fixture) && homeTeam?.meta.winner && !awayTeam?.meta.winner)
      awayScoreClasses = "opacity-60";
    if (currentScores) {
      return (
        <>
          <span className={`${homeScoreClasses} px-2`}>
            {homeScore?.score.goals ? homeScore?.score.goals : 0}
          </span>
          <span>-</span>
          <span className={`${awayScoreClasses} px-2`}>
            {awayScore?.score.goals ? awayScore?.score.goals : 0}
          </span>
        </>
      );
    }

    return null;
  };

  const getMinutesPassed = () => {
    if (fixture.periods.length <= 0) return null;

    const currentPeriod = fixture.periods[fixture.periods.length - 1].started
      ? fixture.periods[fixture.periods.length - 1]
      : fixture.periods[0];

    return <span>{currentPeriod.minutes}</span>;
  };

  return (
    <div className="flex flex-col items-center">
      {isTabDisplayed(fixture) ? (
        <>
          <div
            className={`flex justify-center mb-2 ${
              isInplay(fixture) ? "text-[#ED3E42]" : ""
            }  text-center text-3xl md:text-4xl lg:text-5xl px-6 py-3`}
          >
            {getCurrentScore()}
          </div>
        </>
      ) : (
        <span className="md:text-2xl lg:text-3xl mb-2 px-6 py-3">
          {getFixtureTime(fixture.starting_at_timestamp)}
        </span>
      )}

      {/* <span className="flex items-center">
        <MdStadium className="h-5 w-5 mr-2" />
        {fixtureVenue.name}
      </span> */}
    </div>
  );
}

export default ScoreDisplay;
