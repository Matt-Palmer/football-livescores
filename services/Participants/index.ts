import { Participant } from "@/typings";

export const getParticipant = (
  participants: Participant[],
  participantLocation: string
): Participant => {
  const participant = participants.find(
    (participant: Participant) =>
      participant.meta.location === participantLocation
  );

  if (participant) return participant;

  return {} as Participant;
};
