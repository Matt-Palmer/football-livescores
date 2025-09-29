import { FixturesContext } from "@/components/Fixtures/FixturesContextProvider";
import { useContext } from "react";

export function useFixturesContext() {
  const context = useContext(FixturesContext);

  if (!context) {
    throw new Error(
      "useFixturesContext must be within FixturesContextProvider"
    );
  }

  return context;
}
