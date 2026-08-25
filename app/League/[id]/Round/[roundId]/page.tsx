import LeagueComponent from "@/components/League";

type Props = {
  params: Promise<{
    id: string;
    roundId: string;
  }>;
};

export default async function LeagueRoundPage({ params }: Props) {
  const { id, roundId } = await params;

  return <LeagueComponent leagueId={id} roundId={roundId} />;
}
