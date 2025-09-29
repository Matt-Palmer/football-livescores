import { Fixture } from "@/typings";

const halfTimeStatesIds = [3, 21];
const fixtureInPlayStatesIds = [2, 3, 4, 6, 9, 16, 21, 22, 23, 25];
const fixtureCompleteStateIds = [5, 7, 8, 10, 11, 12, 15, 20];

export const isInplay = (fixture: Fixture) => {
  return fixtureInPlayStatesIds.includes(fixture.state_id);
};

export const isHalfTime = (fixture: Fixture) => {
  return halfTimeStatesIds.includes(fixture.state_id);
};

export const isComplete = (fixture: Fixture) => {
  return fixtureCompleteStateIds.includes(fixture.state_id);
};
