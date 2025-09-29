import { FixtureContext } from "@/components/Fixture/FixtureContextProvider";
import { useContext } from "react";

export function useFixtureContext() {
  const context = useContext(FixtureContext);

  if (!context) {
    throw new Error(
      "useFixtureContext must be within FixturesContextProvider"
    );
  }

  return context;
}
