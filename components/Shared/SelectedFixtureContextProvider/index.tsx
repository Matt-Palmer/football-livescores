"use client";

import { createContext, useCallback, useState } from "react";
import { usePathname } from "next/navigation";

type SelectedFixtureContextType = {
  selectedFixtureId: number | null;
  openFixture: (fixtureId: number) => void;
  closeFixture: () => void;
};

type SelectedFixtureContextProviderType = {
  children: React.ReactNode;
};

export const SelectedFixtureContext =
  createContext<SelectedFixtureContextType | null>(null);

/**
 * Tracks which fixture (if any) is open in the split-view overlay. This is
 * deliberately not routed — the overlay is a UI state, not a page, so
 * switching between fixtures never touches the URL or history. Only "View
 * full page" inside the overlay does a real navigation, to the standalone
 * /Fixture/[id] route, which is what a viewer would actually share.
 */
export default function SelectedFixtureContextProvider({
  children,
}: SelectedFixtureContextProviderType) {
  const [selectedFixtureId, setSelectedFixtureId] = useState<number | null>(
    null
  );
  const pathname = usePathname();

  // A real navigation (header logo, search result, breadcrumb, etc.) should
  // dismiss the overlay rather than leave it floating over whatever page it
  // navigated to — the overlay's own controls close it themselves and never
  // change the pathname, so this only ever fires for navigations away from
  // it. Adjusting state during render (rather than in an effect) on a
  // pathname change is the React-recommended way to reset state in response
  // to something outside this component changing: it re-renders immediately
  // with the reset value instead of committing a stale frame first.
  const [settledPathname, setSettledPathname] = useState(pathname);

  if (pathname !== settledPathname) {
    setSettledPathname(pathname);
    setSelectedFixtureId(null);
  }

  const openFixture = useCallback((fixtureId: number) => {
    setSelectedFixtureId(fixtureId);
  }, []);

  const closeFixture = useCallback(() => {
    setSelectedFixtureId(null);
  }, []);

  return (
    <SelectedFixtureContext.Provider
      value={{ selectedFixtureId, openFixture, closeFixture }}
    >
      {children}
    </SelectedFixtureContext.Provider>
  );
}
