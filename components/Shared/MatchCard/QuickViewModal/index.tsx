"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { getErrorMessage, isAbortError, postJson } from "@/services/Api";
import { Fixture } from "@/typings";
import ScoreDisplay from "@/components/Fixture/FixtureInformation/ScoreDisplay";
import FixtureEvents from "@/components/Fixture/FixtureEvents";
import FixtureStatistics from "@/components/Fixture/FixtureStatistics";

type Props = {
  fixtureId: number;
  onClose: () => void;
};

function QuickViewTeam({
  fixture,
  location,
}: {
  fixture: Fixture;
  location: string;
}) {
  const team = fixture.participants.find(
    (participant) => participant.meta.location === location
  );

  return (
    <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
      <div className="relative h-[36px] w-[36px] shrink-0">
        <Image
          src={team?.image_path || "/default-team-logo.svg"}
          fill={true}
          alt={`${location === "home" ? "Home" : "Away"} team logo`}
          style={{ objectFit: "cover" }}
          sizes="36px"
        />
      </div>
      <span className="text-xs text-center line-clamp-2">{team?.name}</span>
    </div>
  );
}

function QuickViewModal({ fixtureId, onClose }: Props) {
  const [fixture, setFixture] = useState<Fixture | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    postJson<Fixture>("Fixture", { id: fixtureId }, controller.signal)
      .then((response) => {
        setFixture(response);
        setError(null);
      })
      .catch((cause) => {
        if (isAbortError(cause)) return;

        setError(getErrorMessage(cause));
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [fixtureId]);

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/60" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-[420px] max-h-[85vh] flex flex-col rounded-lg border border-brand-border bg-brand-surface overflow-hidden">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3 right-3 z-10 p-1 rounded-full bg-brand-bg/60 hover:bg-brand-surfaceHover border border-brand-border"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>

          {error ? (
            <div className="text-center py-12 px-4">
              <p className="text-sm">Couldn&apos;t load this match.</p>
              <p className="text-xs text-brand-muted mt-1">{error}</p>
            </div>
          ) : isLoading || !fixture ? (
            <div className="p-6">
              <div className="h-[80px] rounded-lg bg-brand-bg animate-pulse mb-4" />
              <div className="h-[120px] rounded-lg bg-brand-bg animate-pulse" />
            </div>
          ) : (
            <>
              <div className="shrink-0 flex items-start justify-center gap-4 px-6 pt-6 pb-4 border-b border-brand-border">
                <QuickViewTeam fixture={fixture} location="home" />
                <ScoreDisplay fixture={fixture} />
                <QuickViewTeam fixture={fixture} location="away" />
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4">
                {fixture.events.length > 0 ? (
                  <div className="mb-8">
                    <h3 className="text-sm text-brand-muted uppercase tracking-wide mb-3">
                      Events
                    </h3>
                    <FixtureEvents
                      events={fixture.events}
                      participants={fixture.participants}
                      periods={fixture.periods}
                    />
                  </div>
                ) : null}

                {fixture.statistics.length > 0 ? (
                  <div>
                    <h3 className="text-sm text-brand-muted uppercase tracking-wide mb-3">
                      Statistics
                    </h3>
                    <FixtureStatistics statistics={fixture.statistics} />
                  </div>
                ) : null}

                {fixture.events.length === 0 &&
                fixture.statistics.length === 0 ? (
                  <p className="text-center text-sm text-brand-muted py-8">
                    No events or statistics available yet.
                  </p>
                ) : null}
              </div>
            </>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default QuickViewModal;
