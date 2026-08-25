
import {
  getStateName,
  isComplete,
  isInplay,
  neverKickedOff,
} from "@/services/MatchStates";
import { isTabDisplayed } from "@/utils/individualFixtureHelpers";
import {
  formatFixtureDate,
  formatKickOffTime,
  isFixtureDateInFuture,
} from "@/services/Date";
import { Fixture } from "@/typings";
import { MdStadium } from "react-icons/md";
import LiveIndicator from "@/components/Shared/LiveIndicator";


type ScoreDisplayProps = {
  fixture: Fixture;
};

function ScoreDisplay({fixture}: ScoreDisplayProps ) {
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

  const getMinutesPassed = (): number | null => {
    if (fixture.periods.length <= 0) return null;

    const currentPeriod = fixture.periods[fixture.periods.length - 1].started
      ? fixture.periods[fixture.periods.length - 1]
      : fixture.periods[0];

    return currentPeriod.minutes;
  };

  return (
    <div className="flex flex-col items-center">
      {neverKickedOff(fixture) ? (
        <span className="md:text-2xl lg:text-3xl mb-2 px-6 py-3">
          {getStateName(fixture)}
        </span>
      ) : isTabDisplayed(fixture) ? (
        <>
          {isInplay(fixture) && <LiveIndicator minute={getMinutesPassed()} />}
          <div
            className={`flex justify-center mb-2 ${
              isInplay(fixture) ? "text-[#E1523D]" : ""
            }  text-center text-2xl md:text-3xl px-6 py-3`}
          >
            {getCurrentScore()}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center mb-2 px-6 py-3">
          {isFixtureDateInFuture(fixture.starting_at_timestamp) ? (
            <span className="text-sm md:text-base opacity-70">
              {formatFixtureDate(fixture.starting_at_timestamp, true)}
            </span>
          ) : null}
          <span className="md:text-2xl lg:text-3xl">
            {formatKickOffTime(fixture.starting_at_timestamp)}
          </span>
        </div>
      )}

      {/* <span className="flex items-center">
        <MdStadium className="h-5 w-5 mr-2" />
        {fixtureVenue.name}
      </span> */}
    </div>
  );
}

export default ScoreDisplay;
