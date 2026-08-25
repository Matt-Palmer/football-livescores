import FixtureComponent from "@/components/Fixture";
import FixtureContextProvider from "@/components/Fixture/FixtureContextProvider";

/*
  Next 15 made route params asynchronous, so `params` is a Promise and the
  page component has to be async to unwrap it.
*/
type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function FixturePage({ params }: Props) {
  const { id } = await params;

  return (
    <FixtureContextProvider id={id}>
      <FixtureComponent />
    </FixtureContextProvider>
  );
}
