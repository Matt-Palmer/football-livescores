import Image from "next/image";

import { getParticipant } from "@/services/Participants";
import { Participant } from "@/typings";

type Props = {
  isHomeTeamDisplayed: boolean;
  toggleDisplayedLineup: any;
  participantLocation: string;
  participants: Participant[];
};

function LineupToggleBtn({
  isHomeTeamDisplayed,
  toggleDisplayedLineup,
  participantLocation,
  participants
}: Props) {
  const displayToggleButton = () => {
    const classNames = isHomeTeamDisplayed
      ? "bg-[#ffffff]/30 border-[#ffffff]"
      : "bg-[#3f576c]/50 border-transparent";

    const participant = getParticipant(participants, participantLocation);

    return (
      <div
        className={`flex ${classNames} hover:cursor-pointer items-center px-2 pr-3 py-1 rounded-full border-2`}
        onClick={toggleDisplayedLineup}
      >
        <div className="relative w-[20px] h-[20px] mr-2">
          {participant?.image_path ? (
            <Image
              src={participant?.image_path}
              fill={true}
              alt="Team logo"
              style={{ objectFit: "contain" }}
              sizes="(max-width: 1200px) 20px, 20px"
            />
          ) : (
            false
          )}
        </div>
        <span>{participant?.name}</span>
      </div>
    );
  };

  return <>{displayToggleButton()}</>;
}

export default LineupToggleBtn;
