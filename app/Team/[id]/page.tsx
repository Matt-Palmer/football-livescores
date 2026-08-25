import TeamComponent from "@/components/Team";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TeamPage({ params }: Props) {
  const { id } = await params;

  return <TeamComponent teamId={id} />;
}
