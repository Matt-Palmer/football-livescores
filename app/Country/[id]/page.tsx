import CountryComponent from "@/components/Country";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CountryPage({ params }: Props) {
  const { id } = await params;

  return <CountryComponent countryId={id} />;
}
