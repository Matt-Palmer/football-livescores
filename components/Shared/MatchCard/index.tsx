"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { ChartBarSquareIcon } from "@heroicons/react/24/outline";

import { isComplete, isHalfTime, isInplay } from "@/services/MatchStates";
import { isTabDisplayed } from "@/utils/individualFixtureHelpers";
import { formatFixtureDateOrTime } from "@/services/Date";
import { sportmonksStates } from "@/utils/Sportmonks/States";
import { useFavouritesContext } from "@/hooks/useFavouritesContext";
import { getParticipant } from "@/services/Participants";
import { Fixture, Participant } from "@/typings";
import LiveIndicator from "@/components/Shared/LiveIndicator";
import QuickViewModal from "./QuickViewModal";

type Props = {
  fixture: Fixture;
};

function TeamColumn({
  participant,
  fadeOut,
}: {
  participant: Participant;
  fadeOut: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center gap-1.5 flex-1 min-w-0 ${
        fadeOut ? "opacity-60" : ""
      }`}
    >
      <div className="relative h-[32px] w-[32px] shrink-0">
        <Image
          src={participant?.image_path || "/default-team-logo.svg"}
          fill={true}
          alt="Team logo"
          style={{ objectFit: "cover" }}
          sizes="32px"
        />
      </div>
      <span className="text-xs text-center line-clamp-2 leading-tight">
        {participant?.name}
      </span>
    </div>
  );
}

function MatchCard({ fixture }: Props) {
  const { id, starting_at_timestamp, scores } = fixture;
  const { isFavourite, toggleFavourite } = useFavouritesContext();
  const [showQuickView, setShowQuickView] = useState(false);
  const favourited = isFavourite(id);

  const homeParticipant = getParticipant(fixture.participants, "home");
  const awayParticipant = getParticipant(fixture.participants, "away");

  const getGoals = (location: string): number | null => {
    const current = scores.find(
      (score) =>
        score.description === "CURRENT" && score.score.participant === location
    );

    return current ? current.score.goals : null;
  };

  const getStateShortName = () =>
    sportmonksStates.find((state) => state.id === fixture.state_id)
      ?.short_name;

  const hasScore = scores.length > 0;

  const homeGoals = getGoals("home");
  const awayGoals = getGoals("away");
  const homeLost =
    isComplete(fixture) &&
    homeGoals !== null &&
    awayGoals !== null &&
    homeGoals < awayGoals;
  const awayLost =
    isComplete(fixture) &&
    homeGoals !== null &&
    awayGoals !== null &&
    awayGoals < homeGoals;

  const renderStatusBadge = () => {
    if (isHalfTime(fixture))
      return <LiveIndicator minute={null} label={getStateShortName()} />;

    if (isInplay(fixture)) {
      const currentPeriod = fixture.periods[fixture.periods.length - 1];

      return (
        <LiveIndicator minute={currentPeriod ? currentPeriod.minutes : 0} />
      );
    }

    if (isComplete(fixture))
      return (
        <span className="text-[10px] uppercase tracking-wide text-brand-muted">
          {getStateShortName()}
        </span>
      );

    return null;
  };

  return (
    <div className="relative rounded-lg border border-brand-border bg-brand-surface hover:border-brand-gold/50 hover:bg-brand-surfaceHover transition-colors">
      <Link href={`/Fixture/${id}`} className="flex flex-col p-3 pt-8">
        <div className="flex items-center justify-between gap-2">
          <TeamColumn participant={homeParticipant} fadeOut={homeLost} />

          <div className="flex flex-col items-center gap-1 shrink-0 px-1">
            {hasScore ? (
              <>
                {renderStatusBadge()}
                <div className="flex items-center gap-2 text-lg font-medium">
                  <span>{homeGoals ?? 0}</span>
                  <span className="text-brand-muted">-</span>
                  <span>{awayGoals ?? 0}</span>
                </div>
              </>
            ) : (
              <span className="text-xs text-brand-muted whitespace-nowrap">
                {formatFixtureDateOrTime(starting_at_timestamp, true)}
              </span>
            )}
          </div>

          <TeamColumn participant={awayParticipant} fadeOut={awayLost} />
        </div>
      </Link>

      <div className="absolute top-2 right-2 flex items-center gap-1">
        {isTabDisplayed(fixture) ? (
          <button
            type="button"
            onClick={() => setShowQuickView(true)}
            aria-label="Quick view: events and stats"
            className="p-1 rounded-full hover:bg-brand-bg/60"
          >
            <ChartBarSquareIcon width={16} height={16} color="#8FA096" />
          </button>
        ) : null}

        <button
          type="button"
          onClick={() => toggleFavourite(id)}
          aria-pressed={favourited}
          aria-label={favourited ? "Remove from favourites" : "Add to favourites"}
          className="p-1 rounded-full hover:bg-brand-bg/60"
        >
          {favourited ? (
            <StarIconSolid width={15} height={15} color="#C9A15A" />
          ) : (
            <StarIconOutline width={15} height={15} color="#8FA096" />
          )}
        </button>
      </div>

      {showQuickView ? (
        <QuickViewModal
          fixtureId={id}
          onClose={() => setShowQuickView(false)}
        />
      ) : null}
    </div>
  );
}

export default MatchCard;
