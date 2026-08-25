import LeagueComponent from "@/components/League";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LeaguePage({ params }: Props) {
  const { id } = await params;

  return <LeagueComponent leagueId={id} />;
}
