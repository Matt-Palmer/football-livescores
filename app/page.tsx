import { Suspense } from "react";

import FixturesComponent from "@/components/Fixtures";
import FixturesContextProvider from "@/components/Fixtures/FixturesContextProvider";

export default function Home() {
  return (
    // FixturesContextProvider reads the selected date from the URL via
    // useSearchParams, which Next requires to sit under a Suspense boundary
    // so the rest of the page can still be served as a static shell.
    <Suspense>
      <FixturesContextProvider>
        <FixturesComponent />
      </FixturesContextProvider>
    </Suspense>
  );
}
