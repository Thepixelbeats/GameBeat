import Link from "next/link";
import {
  BarChart3,
  Clock3,
  Library,
  Sparkles,
  Trophy,
} from "lucide-react";

import { AppShellPage } from "@/components/layout/app-shell-page";
import { StatePanel } from "@/components/shared/state-panel";
import { TagPill } from "@/components/shared/tag-pill";
import { Button } from "@/components/ui/button";
import type {
  StatsGenreDistributionItem,
  StatsPageData,
  StatsStatusBreakdownItem,
} from "@/services/stats/types";

function MetricCard({
  label,
  value,
  hint,
  icon: Icon,
  iconClassName,
}: {
  label: string;
  value: string;
  hint: string;
  icon: typeof Library;
  iconClassName: string;
}) {
  return (
    <article className="gf-stat-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
            {label}
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
            {value}
          </p>
        </div>
        <span className={`rounded-2xl p-2 ${iconClassName}`}>
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-400">{hint}</p>
    </article>
  );
}

function GenreDistributionCard({
  items,
}: {
  items: StatsGenreDistributionItem[];
}) {
  return (
    <article className="gf-surface-strong p-5 sm:p-6">
      <div>
        <h2 className="gf-section-title">Genre distribution</h2>
        <p className="gf-section-copy">
          Share of your tracked library that contains each genre.
        </p>
      </div>

      {items.length > 0 ? (
        <div className="mt-6 grid gap-4">
          {items.map((item) => (
            <div key={item.genre} className="space-y-2">
              <div className="flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-3 text-white">
                  <span className="font-medium">{item.genre}</span>
                  <span className="text-slate-500">{item.count} games</span>
                </div>
                <span className="text-slate-300">{item.percentage}%</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/6">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,rgba(16,185,129,0.85),rgba(34,211,238,0.9))]"
                  style={{ width: `${Math.max(item.percentage, 8)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-[1.25rem] border border-dashed border-white/12 bg-white/[0.03] p-5 text-sm leading-6 text-slate-400">
          Genre distribution will appear once your tracked games include genre metadata.
        </div>
      )}
    </article>
  );
}

function StatusBreakdownCard({
  items,
}: {
  items: StatsStatusBreakdownItem[];
}) {
  return (
    <article className="gf-surface p-5 sm:p-6">
      <div>
        <h2 className="gf-section-title">Library breakdown</h2>
        <p className="gf-section-copy">
          Every tracked game, including wishlist items.
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {items.map((item) => (
          <div
            key={item.status}
            className="gf-surface-muted p-4"
          >
            <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
              {item.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-white">{item.count}</p>
            <p className="mt-1 text-sm text-slate-400">{item.percentage}% of library</p>
          </div>
        ))}
      </div>
    </article>
  );
}

type StatsViewProps = {
  data: StatsPageData;
};

export function StatsView({ data }: StatsViewProps) {
  if (!data.hasTrackedGames) {
    return (
      <AppShellPage
        eyebrow="Stats"
        title="Read your gaming DNA"
        description="Stats turn your backlog into quick insight once you have a few tracked games to work with."
        actions={
          <>
            <Button render={<Link href="/discover" />}>Discover games</Button>
            <Button render={<Link href="/backlog" />} variant="outline">
              Open backlog
            </Button>
          </>
        }
      >
        <StatePanel
          eyebrow="No Stats Yet"
          title="Start tracking a few games first"
          description="Once you add games to your library, this page will show genre spread, completion habits, backlog pressure, and a simple Gaming DNA summary."
          className="border-dashed"
        />
      </AppShellPage>
    );
  }

  return (
    <AppShellPage
      eyebrow="Stats"
      title="Read your gaming DNA"
      description="A lightweight view of what you play, what you finish, and how much time your active queue is asking from you."
    >
      <div className="grid gap-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Tracked games"
            value={data.trackedGamesCount.toString()}
            hint="Everything currently living in your personal library."
            icon={Library}
            iconClassName="bg-cyan-400/12 text-cyan-100"
          />
          <MetricCard
            label="Backlog size"
            value={data.backlogSize.toString()}
            hint={`${data.backlogQueuedCount} queued and ${data.playingCount} currently in rotation.`}
            icon={BarChart3}
            iconClassName="bg-emerald-400/12 text-emerald-100"
          />
          <MetricCard
            label="Completion rate"
            value={`${data.completionRate}%`}
            hint={`${data.completedCount} completed out of ${data.completionBaseCount} non-wishlist entries.`}
            icon={Trophy}
            iconClassName="bg-amber-300/12 text-amber-100"
          />
          <MetricCard
            label="Backlog hours"
            value={`${data.backlogHoursEstimate}h`}
            hint={`Genre-based estimate across ${data.backlogSize} active backlog games.`}
            icon={Clock3}
            iconClassName="bg-fuchsia-400/12 text-fuchsia-100"
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <GenreDistributionCard items={data.genreDistribution} />

          <article className="gf-accent-surface overflow-hidden p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="rounded-2xl bg-emerald-400/12 p-2 text-emerald-200">
                <Sparkles className="size-5" />
              </span>
              <div>
                <p className="text-xs font-semibold tracking-[0.22em] text-emerald-100/80 uppercase">
                  Gaming DNA
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  {data.gamingDna.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {data.gamingDna.summary}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {data.gamingDna.traits.map((trait) => (
                <TagPill
                  key={trait}
                  tone="emerald"
                >
                  {trait}
                </TagPill>
              ))}
            </div>

            <div className="gf-surface-muted mt-6 p-4">
              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
                Estimate note
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Backlog hours use a simple genre heuristic because the current data
                model does not store real playtime yet.
              </p>
            </div>
          </article>
        </section>

        <StatusBreakdownCard items={data.statusBreakdown} />
      </div>
    </AppShellPage>
  );
}
