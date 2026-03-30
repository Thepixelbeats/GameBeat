import Link from "next/link";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Sparkles,
  Star,
} from "lucide-react";

import { GameCoverArt } from "@/components/game/game-cover-art";
import { AppShellPage } from "@/components/layout/app-shell-page";
import { TagPill } from "@/components/shared/tag-pill";
import { Button } from "@/components/ui/button";
import { StatePanel } from "@/components/shared/state-panel";
import {
  formatPlatformSummary,
  formatStatusLabel,
} from "@/lib/utils/game-presentation";
import type { DashboardPageData } from "@/services/dashboard/types";

const statIcons = [Activity, Clock3, CheckCircle2, Star];

function formatAddedDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

type DashboardViewProps = {
  data: DashboardPageData;
};

export function DashboardView({ data }: DashboardViewProps) {
  return (
    <AppShellPage
      eyebrow="Dashboard"
      title={`Welcome back, ${data.playerName}.`}
      description="Keep your queue moving, spot what you added recently, and keep tonight's next great session close at hand."
      actions={
        <div className="gf-surface-muted flex items-start gap-3 px-4 py-3 text-sm text-slate-300 sm:max-w-[21rem]">
          <div className="rounded-2xl border border-emerald-300/12 bg-emerald-300/10 p-2 text-emerald-100">
            <Sparkles className="size-4" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-white">Momentum check</p>
            <p className="text-sm leading-6 text-slate-300">
              {data.hasTrackedGames
                ? `${data.stats[1]?.value ?? "0"} titles are waiting in backlog focus, with ${data.stats[2]?.value ?? "0"} already cleared.`
                : "Track a few games and this space will turn into a quick read on your queue, completions, and next-session momentum."}
            </p>
          </div>
        </div>
      }
    >
      <div className="grid gap-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {data.stats.map((stat, index) => {
            const Icon = statIcons[index] ?? Activity;

            return (
              <article key={stat.label} className="gf-stat-card">
                <div className="mb-8 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-300">
                    {stat.label}
                  </span>
                  <span className="rounded-2xl border border-white/8 bg-white/[0.05] p-2 text-slate-100">
                    <Icon className="size-4" />
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-semibold tracking-tight text-white">
                    {stat.value}
                  </p>
                  <p className="text-sm leading-6 text-slate-400">
                    {stat.hint}
                  </p>
                </div>
              </article>
            );
          })}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
          <article className="gf-surface-strong p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="gf-section-title">Recently added games</h2>
                <p className="gf-section-copy">
                  The latest titles that landed in your personal queue.
                </p>
              </div>
              <Button render={<Link href="/backlog" />} size="lg">
                View backlog
              </Button>
            </div>

            {data.recentGames.length > 0 ? (
              <div className="grid gap-4">
                {data.recentGames.map((game) => (
                  <article
                    key={game.id}
                    className="gf-surface-muted grid gap-4 p-4 sm:grid-cols-[88px_1fr]"
                  >
                    <GameCoverArt
                      title={game.title}
                      coverUrl={game.coverUrl}
                      ratio="poster"
                    />

                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {game.title}
                          </h3>
                          <p className="mt-1 text-sm text-slate-400">
                            Added {formatAddedDate(game.addedAt)}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <TagPill
                            tone="cyan"
                            className="text-xs font-semibold tracking-[0.18em] uppercase"
                          >
                            {formatStatusLabel(game.status)}
                          </TagPill>
                          {typeof game.rating === "number" ? (
                            <TagPill tone="amber">
                              {game.rating.toFixed(1)} critic
                            </TagPill>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                        {game.genres.slice(0, 3).map((genre) => (
                          <TagPill
                            key={genre}
                            className="border-transparent bg-white/[0.06]"
                          >
                            {genre}
                          </TagPill>
                        ))}
                      </div>

                      <p className="text-sm leading-6 text-slate-400">
                        {formatPlatformSummary(game.platforms)}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <StatePanel
                eyebrow={data.hasTrackedGames ? "Quiet Week" : "Empty Library"}
                title={
                  data.hasTrackedGames
                    ? "No recent additions yet"
                    : "Start building your command center"
                }
                description={
                  data.hasTrackedGames
                    ? "Your library is active, but nothing new has been added recently. The next titles you track will appear here."
                    : "Add a few games to your backlog and the dashboard will start showing recent additions, momentum, and cleaner next-step guidance."
                }
                size="compact"
                actions={
                  <>
                    <Button render={<Link href="/discover" />}>
                      Discover games
                    </Button>
                    <Button render={<Link href="/backlog" />} variant="outline">
                      Open backlog
                    </Button>
                  </>
                }
                className="border-dashed"
              />
            )}
          </article>

          <div className="grid gap-6">
            <article className="gf-surface p-5 sm:p-6">
              <div className="mb-5">
                <h2 className="gf-section-title">Quick actions</h2>
                <p className="gf-section-copy">
                  Fast ways to move through the MVP without extra clutter.
                </p>
              </div>

              <div className="grid gap-3">
                {data.quickActions.map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="group gf-surface-muted p-4 transition hover:border-emerald-300/20 hover:bg-white/[0.06]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-medium text-white">
                          {action.label}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-slate-400">
                          {action.description}
                        </p>
                      </div>
                      <ArrowRight className="mt-0.5 size-4 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-emerald-200" />
                    </div>
                  </Link>
                ))}
              </div>
            </article>

            <article className="gf-accent-surface overflow-hidden p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-emerald-400/12 p-2 text-emerald-200">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {data.tonight.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {data.tonight.description}
                  </p>
                </div>
              </div>

              <div className="gf-surface-muted mt-6 p-4">
                <p className="text-xs font-semibold tracking-[0.22em] text-emerald-100/85 uppercase">
                  Live now
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Open Tonight, set your session length, mood, and play style,
                  and GameFlow will narrow the night down to three practical
                  picks with short reasons.
                </p>
              </div>
            </article>
          </div>
        </section>
      </div>
    </AppShellPage>
  );
}
