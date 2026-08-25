import { Event, Participant, Period } from "@/typings";
import FixtureEvent from "../FixtureEvent";

type FixtureEventsListProps = {
  fixtureEvents: Event[];
  participants: Participant[];
  period: Period;
};

function FixtureEventsList({
  fixtureEvents,
  participants,
  period,
}: FixtureEventsListProps) {
  const isHomeTeam = (participant_id: number) => {
    const homeTeam = participants.find(
      (participant) => participant.meta.location === "home"
    );

    if (participant_id === homeTeam?.id) return true;

    return false;
  };

  return (
    <>
      {fixtureEvents && fixtureEvents.length > 0
        ? fixtureEvents.map((event: Event, index: number) => (
            <FixtureEvent
              key={index}
              event={event}
              isHomeTeam={isHomeTeam(event.participant_id)}
            />
          ))
        : null}

      {period && period.started ? (
        <div className="flex items-center relative h-10 mb-2">
          <hr className="w-full" />
          <p className="absolute flex items-center px-2 bg-[#0E1A14] h-10 right-1/2 translate-x-1/2">
            {period.sort_order === 1 ? '1st' : '2nd'} Half Begins
          </p>
        </div>
      ) : false}
    </>
  );
}

export default FixtureEventsList;
