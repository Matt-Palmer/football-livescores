import FixturesComponent from "@/components/Fixtures";
import FixturesContextProvider from "@/components/Fixtures/FixturesContextProvider";

export default function Home() {
  return (
    <FixturesContextProvider>
      <FixturesComponent />
    </FixturesContextProvider>
  );
}
