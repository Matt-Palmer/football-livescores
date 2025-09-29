import { getFetchUrl } from "@/utils/getFetchUrls";
import { getTodaysDate } from "../Date";
import { Fixture } from "@/typings";

const fixtureInPlayStatesIds = [2, 3, 4, 6, 9, 16, 21, 22, 23, 25];

export const getFixtures = async () => {
  const date = getTodaysDate();

  try {
    const result = await fetch(getFetchUrl("api/GetFixtures"), {
      method: "POST",
      body: JSON.stringify({
        todaysDate: date,
      }),
    });

    const response = await result.json();

    return response;
  } catch (error) {
    console.error(error);
  }
};

export const areFixturesInPlay = (fixtures: Fixture[]): boolean => {
  const inPlayFixtures = fixtures.filter((fixture: Fixture) =>
    fixtureInPlayStatesIds.includes(fixture.state_id)
  );

  if (inPlayFixtures.length > 0) return true;

  return false;
};

export const updateFixtures = (updatedFixturesState: Fixture[], currentFixturesState: Fixture[]): Fixture[] => {
  const newState = [...currentFixturesState];

  updatedFixturesState.forEach((item: Fixture) => {
    const fixtureIndex = newState.findIndex(
      (fixture: Fixture) => fixture.id === item.id
    );
    newState[fixtureIndex] = item;
  });
  
  return newState;
};
