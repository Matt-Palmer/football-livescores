import Link from "next/link";

import LogoBadge from "@/components/Shared/LogoBadge";

type LeagueCrumb = {
  id: number;
  roundId?: number;
  label: string;
  imagePath?: string;
};

type BreadcrumbProps = {
  countryId: number;
  countryName: string;
  league?: LeagueCrumb;
};

function Breadcrumb({ countryId, countryName, league }: BreadcrumbProps) {
  return (
    <div className="flex items-center gap-2 text-gray-400 text-sm flex-wrap">
      <Link href={`/Country/${countryId}`} className="hover:text-white">
        {countryName}
      </Link>

      {league ? (
        <>
          <span>/</span>
          <Link
            href={
              league.roundId
                ? `/League/${league.id}/Round/${league.roundId}`
                : `/League/${league.id}`
            }
            className="flex items-center gap-2 hover:text-white"
          >
            {league.imagePath ? (
              <LogoBadge
                src={league.imagePath}
                alt="Competition logo"
                className="h-[20px] w-[20px] md:h-[25px] md:w-[25px]"
                sizes="(max-width: 1200px) 30px, 30px"
              />
            ) : null}
            <span>{league.label}</span>
          </Link>
        </>
      ) : null}
    </div>
  );
}

export default Breadcrumb;
