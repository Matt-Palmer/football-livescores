import { Event, Participant, Period } from "@/typings";
import FixtureEventsList from "./FixtureEventsList";

type FixtureEventsProps = {
  events: Event[];
  participants: Participant[];
  periods: Period[];
}

function FixtureEvents({ events, participants, periods }: FixtureEventsProps) {
  const sortEvents = () => {
    const mergedfixtureEvents = [];

    events.sort((a: Event, b: Event) => {
      if (b.minute < a.minute) return -1;
      if (a.minute > b.minute) return 1;

      if (b.extra_minute && a.extra_minute) {
        if (b.extra_minute < a.extra_minute) return -1;
        if (a.extra_minute > b.extra_minute) return 1;
      }
        
      return 0;
    });

    const firstHalfEvents = events.filter((event: Event) => {
      if (event.minute && event.minute < 46) return event;
    });

    const secondHalfEvents = events.filter((event: Event) => {
      if (event.minute && event.minute > 45) return event;
    });

    mergedfixtureEvents.push(firstHalfEvents);
    mergedfixtureEvents.push(secondHalfEvents);

    return mergedfixtureEvents;
  };

  const sortedFixtureEvents = sortEvents();

  return (
      <div className="max-w-[700px] m-auto">
        <FixtureEventsList fixtureEvents={sortedFixtureEvents[1]} participants={participants} period={periods[1]} />
        <FixtureEventsList fixtureEvents={sortedFixtureEvents[0]} participants={participants} period={periods[0]} />
      </div>
  );
}

export default FixtureEvents;
