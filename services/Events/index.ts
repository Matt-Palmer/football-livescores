import { Event } from "@/typings";

export const getPlayerEvents = (events: Event[], player_id: number) => {
  if (events.length <= 0) return [];

  const playerEvents = events.filter((event) => event.player_id === player_id);
  const playerRelatedEvents = events.filter(
    (event) => event.related_player_id === player_id
  );

  return playerEvents.concat(playerRelatedEvents);
};

export const getGoalsScored = (events: Event[], player_id: number) => {
  return events
    .filter(
      (event) =>
        event.type_id === 14 || event.type_id === 15 || event.type_id === 16
    )
    .filter((event) => event.player_id === player_id);
};

export const getAssists = (events: Event[], player_id: number) => {
  return events
    .filter((event) => event.type_id === 14 || event.type_id === 15)
    .filter((event) => event.related_player_id === player_id);
};

export const getSubOff = (events: Event[], player_id: number) => {
  const subEvents = events.filter((event) => event.type_id === 18);

  const subOff = subEvents.find(
    (event) => event.related_player_id === player_id
  );

  if (subOff) return true;

  return false;
};

export const getSubOn = (events: Event[], player_id: number) => {
  const subEvents = events.filter((event) => event.type_id === 18);

  const subOn = subEvents.find(
    (event) => event.player_id === player_id
  );

  if (subOn) return true;

  return false;
};

export const getCard = (events: Event[], player_id: number) => {
  const cardEvents = events.filter(
    (event) =>
      event.type_id === 19 || event.type_id === 20 || event.type_id === 21
  );
  const playerCardEvents = cardEvents.filter(
    (event) => event.player_id === player_id
  );
  
  playerCardEvents.sort((a, b) => {
    if (b.minute < a.minute) return -1;
    if (a.minute > b.minute) return 1;

    if (b.extra_minute && a.extra_minute) {
      if (b.extra_minute < a.extra_minute) return -1;
      if (a.extra_minute > b.extra_minute) return 1;
    }

    

    return 0;
  });

  if (playerCardEvents.length > 0) return playerCardEvents[0].type_id;

  return false;
};