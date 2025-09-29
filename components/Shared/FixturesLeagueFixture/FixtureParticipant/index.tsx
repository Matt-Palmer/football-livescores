import { isComplete, isInplay } from "@/services/MatchStates";
import { Fixture, Participant } from "@/typings";
import { getParticipant } from "@/services/Participants";
import Logo from "../../Logo/Logo";
import { capitalizeFirstLetter } from "@/utils/helperFunctions";
import Image from "next/image";

type Props = {
  fixture: Fixture;
  location: string;
};

function FixtureParticipant({ fixture, location }: Props) {
  const { participants, scores } = fixture;

  const participant: Participant = getParticipant(participants, location);

  const getScore = () => {
    const currentScores = scores.filter(
      (score) => score.description === "CURRENT"
    );

    const score = currentScores.find(
      (currentScore) =>
        currentScore.score.participant === participant?.meta.location
    );

    return (
      <span className={`text-sm md:text-base ${isInplay(fixture) ? "text-[#ED3E42]" : ""}`}>
        {score?.score.goals}
      </span>
    );
  };

  const getWinner = () => {
    if (fixture.state_id === 5) return participant?.meta.winner;

    if (fixture.state_id === 7) {
      const currentScores = fixture.scores.filter(
        (score) => score.description === "CURRENT"
      );
      const participantScore = currentScores.find(
        (score) => score.score.participant === participant?.meta.location
      );
      const otherParticipantScore = currentScores.find(
        (score) => score.score.participant !== participant?.meta.location
      );

      if (participantScore?.score.goals && otherParticipantScore?.score.goals) {
        if (participantScore?.score.goals > otherParticipantScore?.score.goals)
          return true;
      }

      return false;
    }

    return true;
  };

  return (
    <div
      className={`px-2 md:px-4 py-[1px] flex items-center justify-between rounded-lg ${
        isComplete(fixture) && !getWinner() ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        <div className={`relative h-[22px] w-[22px]`}>
          <Image
            src={
              participant.image_path
                ? participant.image_path
                : "default-team-logo.svg"
            }
            fill={true}
            alt="Country flag"
            style={{ objectFit: "cover" }}
            sizes={`(max-width: 1200px) 30px, 30px`}
          />
        </div>
        <p className="text-sm md:text-base">{participant?.name}</p>
      </div>

      {scores.length > 0 ? getScore() : null}
    </div>
  );
}

export default FixtureParticipant;
