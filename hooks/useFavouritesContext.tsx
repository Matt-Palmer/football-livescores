import { useContext } from "react";

import { FavouritesContext } from "@/components/Shared/FavouritesContextProvider";

export function useFavouritesContext() {
  const context = useContext(FavouritesContext);

  if (!context) {
    throw new Error(
      "useFavouritesContext must be within FavouritesContextProvider"
    );
  }

  return context;
}
