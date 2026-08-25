import { Fixture } from "@/typings";
import { sportmonksStates } from "@/utils/Sportmonks/States";

const halfTimeStatesIds = [3, 21];
const fixtureInPlayStatesIds = [2, 3, 4, 6, 9, 16, 21, 22, 23, 25];
const fixtureCompleteStateIds = [5, 7, 8, 10, 11, 12, 15, 20];

// Postponed, Cancelled, Deleted: the match never kicked off, unlike the rest
// of fixtureCompleteStateIds (Suspended, Abandoned included) where it did.
const neverKickedOffStateIds = [10, 12, 20];

export const isInplay = (fixture: Fixture) => {
  return fixtureInPlayStatesIds.includes(fixture.state_id);
};

export const isHalfTime = (fixture: Fixture) => {
  return halfTimeStatesIds.includes(fixture.state_id);
};

export const isComplete = (fixture: Fixture) => {
  return fixtureCompleteStateIds.includes(fixture.state_id);
};

export const neverKickedOff = (fixture: Fixture) => {
  return neverKickedOffStateIds.includes(fixture.state_id);
};

/** The Sportmonks state name for a fixture, e.g. "Postponed". */
export const getStateName = (fixture: Fixture): string | undefined => {
  return sportmonksStates.find((state) => state.id === fixture.state_id)
    ?.name;
};
