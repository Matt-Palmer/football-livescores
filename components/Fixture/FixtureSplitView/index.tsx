"use client";

import { Suspense } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

import FixturesContextProvider from "@/components/Fixtures/FixturesContextProvider";
import FixtureComponent from "@/components/Fixture";
import { useSelectedFixtureContext } from "@/hooks/useSelectedFixtureContext";

import Sidebar from "./Sidebar";

type Props = {
  id: string;
};

/**
 * The split view a fixture opens into on desktop/tablet: the day's
 * fixtures collapsed into a sidebar on the left, full match detail on the
 * right. This is pure UI state (SelectedFixtureContext), not a route — the
 * URL never changes while browsing between fixtures here, so there is
 * nothing to accidentally share. "View full page" (rendered by
 * FixtureComponent itself, just below the score) is the one action that
 * does a real navigation, to the standalone /Fixture/[id] route.
 *
 * Sits below the app header (via --header-height, published by Header)
 * rather than covering it, so the real nav/search/favourites stays put.
 * Below the lg breakpoint the sidebar hides itself (mobile has no room for
 * a split layout), leaving what is visually the same full-page detail view.
 */
function FixtureSplitView({ id }: Props) {
  const { closeFixture } = useSelectedFixtureContext();

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 bg-brand-bg flex"
      style={{ top: "var(--header-height)" }}
    >
      <div className="hidden lg:block w-[340px] shrink-0 border-r border-brand-border">
        <Suspense>
          <FixturesContextProvider>
            <Sidebar />
          </FixturesContextProvider>
        </Suspense>
      </div>

      <div className="relative flex-1 overflow-y-auto">
        <button
          type="button"
          onClick={closeFixture}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-brand-surface/80 hover:bg-brand-surfaceHover border border-brand-border"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>

        <FixtureComponent onClose={closeFixture} />
      </div>
    </div>
  );
}

export default FixtureSplitView;
