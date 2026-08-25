"use client";

import { useSelectedFixtureContext } from "@/hooks/useSelectedFixtureContext";
import FixtureContextProvider from "@/components/Fixture/FixtureContextProvider";
import FixtureSplitView from "@/components/Fixture/FixtureSplitView";

/** Renders the split-view overlay when a fixture is selected, app-wide. */
function FixtureOverlay() {
  const { selectedFixtureId } = useSelectedFixtureContext();

  if (selectedFixtureId === null) return null;

  return (
    <FixtureContextProvider id={String(selectedFixtureId)}>
      <FixtureSplitView id={String(selectedFixtureId)} />
    </FixtureContextProvider>
  );
}

export default FixtureOverlay;
