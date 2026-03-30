import { Compass, Sparkles, Star, Trophy } from "lucide-react";

import { GameCoverArt } from "@/components/game/game-cover-art";
import { AppShellPage } from "@/components/layout/app-shell-page";
import { TagPill } from "@/components/shared/tag-pill";
import {
  formatPlatformSummary,
  formatReleaseYear,
} from "@/lib/utils/game-presentation";
import type { RecommendationsPageData } from "@/services/recommendations/types";

type RecommendationsViewProps = {
  data: RecommendationsPageData;
};

export function RecommendationsView({ data }: RecommendationsViewProps) {
  const hasSignals =
    data.completedGamesCount > 0 ||
    data.highlyRatedGamesCount > 0 ||
    data.favoriteGenres.length > 0;

  return (
    <AppShellPage
      eyebrow="Recommendations"
      title="Deterministic recommendations that stay stable"
      description="We score untracked games from your completed history, your highest ratings, and your favorite genres, then return the same top 10 until your data changes."
    >
      <div className="grid gap-6">
        <div className="grid gap-4 xl:grid-cols-[1.3fr_2fr]">
          <section className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            <article className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-4">
              <div className="flex items-center gap-3">
                <span className="rounded-2xl bg-emerald-400/12 p-2 text-emerald-100">
                  <Trophy className="size-4" />
                </span>
                <div>
                  <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                    Completed
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-white">
                    {data.completedGamesCount}
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-4">
              <div className="flex items-center gap-3">
                <span className="rounded-2xl bg-amber-300/12 p-2 text-amber-100">
                  <Star className="size-4" />
                </span>
                <div>
                  <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                    Highly rated
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-white">
                    {data.highlyRatedGamesCount}
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-4">
              <div className="flex items-center gap-3">
                <span className="rounded-2xl bg-cyan-400/12 p-2 text-cyan-100">
                  <Compass className="size-4" />
                </span>
                <div>
                  <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                    Favorite genres
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-white">
                    {data.favoriteGenres.length}
                  </p>
                </div>
              </div>
            </article>
          </section>

          <section className="rounded-[1.75rem] border border-emerald-400/15 bg-[linear-gradient(180deg,rgba(18,35,31,0.95),rgba(8,15,13,0.92))] p-5">
            <div className="flex items-start gap-3">
              <span className="rounded-2xl bg-emerald-400/12 p-2 text-emerald-200">
                <Sparkles className="size-5" />
              </span>

              <div className="space-y-3">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    How {data.playerName}&apos;s list is being shaped
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                    {hasSignals
                      ? "Genre overlap drives the ranking first, then critic score settles the close calls."
                      : "You do not have completed or highly rated games yet, so the engine is falling back to critic score until your taste profile fills in."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {data.favoriteGenres.length > 0 ? (
                    data.favoriteGenres.map((genre) => (
                      <TagPill key={genre} tone="emerald">
                        {genre}
                      </TagPill>
                    ))
                  ) : (
                    <TagPill className="text-slate-300">
                      Favorite genres will appear after a few ratings or
                      completions
                    </TagPill>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

        {data.recommendations.length > 0 ? (
          <section className="grid gap-4 xl:grid-cols-2">
            {data.recommendations.map((recommendation, index) => (
              <article
                key={recommendation.id}
                className="grid gap-4 rounded-[1.75rem] border border-white/10 bg-slate-950/45 p-4 backdrop-blur-sm sm:grid-cols-[110px_1fr]"
              >
                <GameCoverArt
                  title={recommendation.title}
                  coverUrl={recommendation.coverUrl}
                />

                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold tracking-[0.22em] text-emerald-100/80 uppercase">
                        #{String(index + 1).padStart(2, "0")}
                      </p>
                      <h2 className="mt-1 text-xl font-semibold text-white">
                        {recommendation.title}
                      </h2>
                      <p className="mt-1 text-sm text-slate-400">
                        {formatReleaseYear(recommendation.releaseDate)} •{" "}
                        {formatPlatformSummary(recommendation.platforms)}
                      </p>
                    </div>

                    {typeof recommendation.rating === "number" ? (
                      <TagPill tone="amber">
                        {recommendation.rating.toFixed(1)} critic
                      </TagPill>
                    ) : null}
                  </div>

                  <p className="text-sm leading-6 text-slate-300">
                    {recommendation.explanation}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {recommendation.matchedGenres.length > 0 ? (
                      recommendation.matchedGenres.map((genre) => (
                        <TagPill
                          key={`${recommendation.id}-${genre}`}
                          tone="cyan"
                        >
                          Matched on {genre}
                        </TagPill>
                      ))
                    ) : (
                      <TagPill>Critic-led fallback</TagPill>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                    {recommendation.genres.map((genre) => (
                      <TagPill
                        key={`${recommendation.id}-genre-${genre}`}
                        className="border-transparent bg-white/[0.06]"
                      >
                        {genre}
                      </TagPill>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section className="rounded-[1.75rem] border border-dashed border-white/12 bg-white/[0.03] p-8 text-center">
            <h2 className="text-xl font-semibold text-white">
              No recommendations yet
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Add more games to the catalog or leave a few ratings in your
              backlog so the recommendation engine has candidate games and taste
              signals to work with.
            </p>
          </section>
        )}
      </div>
    </AppShellPage>
  );
}
