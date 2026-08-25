import FixturesComponent from "@/components/Fixtures";
import FixturesContextProvider from "@/components/Fixtures/FixturesContextProvider";
import FavouritesContextProvider from "@/components/Shared/FavouritesContextProvider";

export default function Home() {
  return (
    <FavouritesContextProvider>
      <FixturesContextProvider>
        <FixturesComponent />
      </FixturesContextProvider>
    </FavouritesContextProvider>
  );
}
