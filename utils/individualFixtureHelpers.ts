import { Fixture } from "@/typings";
import { isComplete, isInplay } from "@/services/MatchStates";

export const isTabDisplayed = (fixture: Fixture) => {
  if (!isInplay(fixture) && !isComplete(fixture)) return false;

  return true;
};
