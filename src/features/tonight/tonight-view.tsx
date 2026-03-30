import Link from "next/link";
import { Gamepad2, MoonStar, Sparkles, Users } from "lucide-react";

import { GameCoverArt } from "@/components/game/game-cover-art";
import { AppShellPage } from "@/components/layout/app-shell-page";
import { StatePanel } from "@/components/shared/state-panel";
import { TagPill } from "@/components/shared/tag-pill";
import { Button } from "@/components/ui/button";
import {
  formatPlatformSummary,
  formatReleaseYear,
} from "@/lib/utils/game-presentation";
import type {
  TonightMood,
  TonightPageData,
  TonightPlayStyle,
  TonightSessionLength,
} from "@/services/tonight/types";

const sessionLengthOptions: Array<{
  value: TonightSessionLength;
  label: string;
  description: string;
}> = [
  {
    value: "short",
    label: "Short",
    description: "Quick run, one mission, or a fast unwind.",
  },
  {
    value: "medium",
    label: "Medium",
    description: "A solid evening block with some momentum.",
  },
  {
    value: "long",
    label: "Long",
    description: "You have time to really sink into something.",
  },
];

const moodOptions: Array<{
  value: TonightMood;
  label: string;
  description: string;
}> = [
  {
    value: "chill",
    label: "Chill",
    description: "Lower stress, easier pacing, less friction.",
  },
  {
    value: "focused",
    label: "Focused",
    description: "You want something deliberate and mentally sticky.",
  },
  {
    value: "intense",
    label: "Intense",
    description: "Immediate action, pressure, and momentum.",
  },
  {
    value: "story",
    label: "Story",
    description: "You want immersion, world-building, and narrative pull.",
  },
];

const playStyleOptions: Array<{
  value: TonightPlayStyle;
  label: string;
  description: string;
}> = [
  {
    value: "solo",
    label: "Solo",
    description: "Pick something that feels good to lock into alone.",
  },
  {
    value: "multiplayer",
    label: "Multiplayer",
    description: "Bias toward games that feel more social or group-friendly.",
  },
];

function FilterGroup<T extends string>({
  name,
  legend,
  options,
  selectedValue,
}: {
  name: string;
  legend: string;
  options: Array<{ value: T; label: string; description: string }>;
  selectedValue: T;
}) {
  return (
    <fieldset className="grid gap-3">
      <legend className="text-sm font-semibold tracking-[0.18em] text-slate-300 uppercase">
        {legend}
      </legend>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1">
        {options.map((option) => {
          const isSelected = option.value === selectedValue;

          return (
            <label
              key={option.value}
              className={`rounded-[1.35rem] border p-4 transition ${
                isSelected
                  ? "border-emerald-300/24 bg-emerald-300/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
                  : "border-white/10 bg-slate-950/42 hover:border-white/16 hover:bg-white/[0.05]"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                defaultChecked={isSelected}
                className="sr-only"
              />
              <div>
                <p className="text-sm font-semibold text-white">
                  {option.label}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  {option.description}
                </p>
              </div>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

type TonightViewProps = {
  data: TonightPageData;
};

export function TonightView({ data }: TonightViewProps) {
  const hasTrackedOptions = data.trackedOptionsCount > 0;

  return (
    <AppShellPage
      eyebrow="Tonight"
      title="What should I play tonight?"
      description="Set the vibe, tell GameFlow how much time you have, and get three practical picks with clear reasons."
    >
      <div className="grid gap-6">
        <section className="grid gap-4 xl:grid-cols-[1.1fr_1.5fr]">
          <form method="get" className="gf-surface-strong grid gap-5 p-5">
            <div className="flex items-start gap-3">
              <span className="rounded-2xl bg-emerald-400/12 p-2 text-emerald-200">
                <MoonStar className="size-5" />
              </span>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Tune tonight&apos;s picker
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Start with your available time, tonight&apos;s mood, and
                  whether you want to play solo or lean social.
                </p>
              </div>
            </div>

            <FilterGroup
              name="sessionLength"
              legend="Session Length"
              options={sessionLengthOptions}
              selectedValue={data.filters.sessionLength}
            />

            <FilterGroup
              name="mood"
              legend="Mood"
              options={moodOptions}
              selectedValue={data.filters.mood}
            />

            <FilterGroup
              name="playStyle"
              legend="Solo Or Multiplayer"
              options={playStyleOptions}
              selectedValue={data.filters.playStyle}
            />

            <Button type="submit" size="lg" className="w-full sm:w-auto">
              Refresh suggestions
            </Button>
          </form>

          <section className="grid gap-4">
            <article className="gf-accent-surface p-5">
              <div className="flex items-start gap-3">
                <span className="rounded-2xl bg-emerald-400/12 p-2 text-emerald-200">
                  <Sparkles className="size-5" />
                </span>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Built for {data.playerName}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    We score your tracked games first, then pull in discovery
                    fallbacks only if your current queue is thin.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <TagPill>
                  {data.trackedOptionsCount} tracked options in play
                </TagPill>
                {data.favoriteGenres.length > 0 ? (
                  data.favoriteGenres.map((genre) => (
                    <TagPill key={genre} tone="cyan">
                      {genre}
                    </TagPill>
                  ))
                ) : (
                  <TagPill className="text-slate-300">
                    Taste profile grows as you complete and rate more games
                  </TagPill>
                )}
              </div>
            </article>

            <article className="gf-surface p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                    Current setup
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {data.filters.sessionLength} / {data.filters.mood} /{" "}
                    {data.filters.playStyle}
                  </p>
                </div>

                <div className="flex gap-2 text-slate-300">
                  <span className="rounded-2xl border border-white/8 bg-white/[0.05] p-2">
                    <Gamepad2 className="size-4" />
                  </span>
                  <span className="rounded-2xl border border-white/8 bg-white/[0.05] p-2">
                    <Users className="size-4" />
                  </span>
                </div>
              </div>

              {data.multiplayerNote ? (
                <p className="mt-4 rounded-[1.2rem] border border-amber-300/15 bg-amber-300/10 px-4 py-3 text-sm leading-6 text-amber-100">
                  {data.multiplayerNote}
                </p>
              ) : null}
            </article>
          </section>
        </section>

        {data.suggestions.length > 0 ? (
          <section className="grid gap-4 xl:grid-cols-3">
            {data.suggestions.map((suggestion, index) => (
              <article
                key={suggestion.id}
                className="gf-surface-strong flex h-full flex-col gap-4 p-4"
              >
                <GameCoverArt
                  title={suggestion.title}
                  coverUrl={suggestion.coverUrl}
                />

                <div className="flex flex-1 flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold tracking-[0.22em] text-emerald-100/80 uppercase">
                        Pick #{index + 1}
                      </p>
                      <h2 className="mt-1 text-xl font-semibold text-white">
                        {suggestion.title}
                      </h2>
                    </div>

                    <TagPill>{suggestion.sourceLabel}</TagPill>
                  </div>

                  <p className="text-sm text-slate-400">
                    {formatReleaseYear(suggestion.releaseDate)} •{" "}
                    {formatPlatformSummary(suggestion.platforms)}
                  </p>

                  <p className="text-sm leading-6 text-slate-300">
                    {suggestion.reason}
                  </p>

                  <div className="mt-auto flex flex-wrap gap-2">
                    {suggestion.genres.slice(0, 3).map((genre) => (
                      <TagPill
                        key={`${suggestion.id}-${genre}`}
                        className="border-transparent bg-white/[0.06]"
                      >
                        {genre}
                      </TagPill>
                    ))}
                    {typeof suggestion.rating === "number" ? (
                      <TagPill tone="amber">
                        {suggestion.rating.toFixed(1)} critic
                      </TagPill>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <StatePanel
            eyebrow={hasTrackedOptions ? "Nothing Fits Yet" : "No Picks Yet"}
            title={
              hasTrackedOptions
                ? "Nothing matched tonight's setup"
                : "Add a few games before asking for tonight's picks"
            }
            description={
              hasTrackedOptions
                ? "Try a different session length, mood, or play style and GameFlow will reshuffle the shortlist."
                : "Once you track a few games in your backlog, this picker can narrow the night down to three practical suggestions."
            }
            actions={
              <>
                <Button render={<Link href="/backlog" />}>Open backlog</Button>
                <Button render={<Link href="/discover" />} variant="outline">
                  Discover games
                </Button>
              </>
            }
            className="border-dashed"
          />
        )}
      </div>
    </AppShellPage>
  );
}
