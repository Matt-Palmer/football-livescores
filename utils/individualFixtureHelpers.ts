import { Fixture } from "@/typings";
import { isComplete, isInplay, neverKickedOff } from "@/services/MatchStates";

export const isTabDisplayed = (fixture: Fixture) => {
  if (neverKickedOff(fixture)) return false;
  if (!isInplay(fixture) && !isComplete(fixture)) return false;

  return true;
};
