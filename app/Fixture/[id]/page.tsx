import FixtureComponent from "@/components/Fixture";
import FixtureContextProvider from "@/components/Fixture/FixtureContextProvider";

type Props = {
  params: {
    id: string;
  };
};

export default function FixturePage({ params: { id } }: Props) {
  return (
    <FixtureContextProvider id={id}>
      <FixtureComponent />
    </FixtureContextProvider>
  );
}
