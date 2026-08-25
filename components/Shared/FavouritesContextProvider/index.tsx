"use client";

import { createContext, useCallback, useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "favouriteFixtureIds";

const EMPTY_FAVOURITES: ReadonlySet<number> = new Set();

type FavouritesContextType = {
  favouriteIds: number[];
  isFavourite: (fixtureId: number) => boolean;
  toggleFavourite: (fixtureId: number) => void;
};

type FavouritesContextProviderType = {
  children: React.ReactNode;
};

export const FavouritesContext = createContext<FavouritesContextType | null>(
  null
);

/*
  localStorage is an external store, so it is read through
  useSyncExternalStore rather than loaded in an effect. Loading it in an
  effect would mean calling setState right after mount purely to reflect an
  external source, which is exactly the cascading-render pattern
  useSyncExternalStore exists to replace, and it also means the server
  snapshot (always empty, `window` does not exist there) has a real chance to
  diverge from the client's first render without React's help reconciling it.
*/
let cachedFavourites: Set<number> | null = null;
const listeners = new Set<() => void>();

function readFavourites(): Set<number> {
  if (cachedFavourites) return cachedFavourites;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];

    cachedFavourites = new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    cachedFavourites = new Set();
  }

  return cachedFavourites;
}

function writeFavourites(next: Set<number>) {
  cachedFavourites = next;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
  } catch {
    // Storage can be unavailable (private browsing, quota). Favouriting
    // still works for the rest of the session, it just won't persist.
  }

  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  // Keeps other tabs in sync with a change made in this one.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;

    cachedFavourites = null;
    listener();
  };

  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getServerSnapshot() {
  return EMPTY_FAVOURITES;
}

export default function FavouritesContextProvider({
  children,
}: FavouritesContextProviderType) {
  const favourites = useSyncExternalStore(
    subscribe,
    readFavourites,
    getServerSnapshot
  );

  // readFavourites returns the same Set instance across renders unless the
  // favourites actually changed, so this array is only rebuilt when they do.
  const favouriteIds = useMemo(() => Array.from(favourites), [favourites]);

  const toggleFavourite = useCallback((fixtureId: number) => {
    const next = new Set(readFavourites());

    if (next.has(fixtureId)) {
      next.delete(fixtureId);
    } else {
      next.add(fixtureId);
    }

    writeFavourites(next);
  }, []);

  const isFavourite = useCallback(
    (fixtureId: number) => favourites.has(fixtureId),
    [favourites]
  );

  return (
    <FavouritesContext.Provider
      value={{
        favouriteIds,
        isFavourite,
        toggleFavourite,
      }}
    >
      {children}
    </FavouritesContext.Provider>
  );
}
