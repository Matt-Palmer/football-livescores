import { Event } from "@/typings";
import FixtureEventGoal from "../FixtureEventGoal";
import FixtureEventCard from "../FixtureEventCard";
import FixtureEventSubstitution from "../FixtureEventSubstitution";
import FixtureEventPenalty from "../FixtureEventPenalty";
import FixtureEventVAR from "../FixtureEventVAR";

type Props = {
  event: Event;
  isHomeTeam: boolean;
};

function EventsListItem({ event, isHomeTeam }: Props) {
  const getEventTypeComponent = (event: Event) => {
    switch (event.type_id) {
      case 10:
        return (
          <FixtureEventVAR
            isHomeTeam={isHomeTeam}
            player_name={event.player_name}
            result={event.addition}
            minute={event.minute}
            extra_minute={event.extra_minute}
          />
        );
      case 14:
      case 15:
        return (
          <FixtureEventGoal
            isHomeTeam={isHomeTeam}
            player_name={event.player_name}
            result={event.result}
            related_player_name={event.related_player_name}
            type_id={event.type_id}
            minute={event.minute}
            extra_minute={event.extra_minute}
          />
        );
      case 16:
        return (
          <FixtureEventPenalty
            isHomeTeam={isHomeTeam}
            player_name={event.player_name}
            result={event.result}
            wasScored={true}
            minute={event.minute}
            extra_minute={event.extra_minute}
          />
        );
      case 17:
        return (
          <FixtureEventPenalty
            isHomeTeam={isHomeTeam}
            player_name={event.player_name}
            result={event.result}
            wasScored={false}
            minute={event.minute}
            extra_minute={event.extra_minute}
          />
        );
      case 18:
        return (
          <FixtureEventSubstitution
            isHomeTeam={isHomeTeam}
            player_off_name={event.related_player_name}
            player_on_name={event.player_name}
            minute={event.minute}
            extra_minute={event.extra_minute}
          />
        );
      case 19:
        return (
          <FixtureEventCard
            isHomeTeam={isHomeTeam}
            type_id={event.type_id}
            player_name={event.player_name}
            info={event.info}
            minute={event.minute}
            extra_minute={event.extra_minute}
          />
        );
      case 20:
        return (
          <FixtureEventCard
            isHomeTeam={isHomeTeam}
            type_id={event.type_id}
            player_name={event.player_name}
            info={event.info}
            minute={event.minute}
            extra_minute={event.extra_minute}
          />
        );
      case 21:
        return (
          <FixtureEventCard
            isHomeTeam={isHomeTeam}
            type_id={event.type_id}
            player_name={event.player_name}
            info={event.info}
            minute={event.minute}
            extra_minute={event.extra_minute}
          />
        );

      default:
        break;
    }
  };
  return (
    <div className="flex h-10 bg-[#3F576C] rounded-lg mb-2">
      {isHomeTeam ? (
          <div className="flex items-center">
            {getEventTypeComponent(event)}
          </div>
      ) : (
          <div className="flex flex-1 w-full justify-end items-center">
            {getEventTypeComponent(event)}
          </div>
      )}
    </div>
  );
}

export default EventsListItem;
