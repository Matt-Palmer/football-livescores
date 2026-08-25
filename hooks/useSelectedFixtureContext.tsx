import { useContext } from "react";
import { SelectedFixtureContext } from "@/components/Shared/SelectedFixtureContextProvider";

export function useSelectedFixtureContext() {
  const context = useContext(SelectedFixtureContext);

  if (!context) {
    throw new Error(
      "useSelectedFixtureContext must be within SelectedFixtureContextProvider"
    );
  }

  return context;
}
