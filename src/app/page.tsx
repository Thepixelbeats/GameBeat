import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BarChart3,
  Compass,
  Gamepad2,
  Layers3,
  Sparkles,
  Target,
} from "lucide-react";

import { getCurrentUserSession } from "@/lib/auth/session";

const featureList = [
  {
    title: "Track what matters",
    description:
      "Keep your backlog, playing list, and completed games in one place.",
    icon: Layers3,
  },
  {
    title: "Find something new",
    description:
      "Search public game data, save titles fast, and build a cleaner queue.",
    icon: Compass,
  },
  {
    title: "Pick tonight's game",
    description:
      "Use a simple suggestion flow when you want less scrolling and more playing.",
    icon: Target,
  },
  {
    title: "See your gaming DNA",
    description:
      "Spot genre trends, completion habits, and the shape of your backlog.",
    icon: BarChart3,
  },
] as const;

const benefitList = [
  {
    title: "Less decision fatigue",
    description:
      "GameFlow turns a messy library into a short list you can actually act on.",
  },
  {
    title: "One hub for your gaming life",
    description:
      "Backlog management, discovery, recommendations, and stats live in the same flow.",
  },
  {
    title: "Momentum instead of guilt",
    description:
      "It helps you keep moving through your games instead of endlessly browsing them.",
  },
] as const;

export default async function HomePage() {
  const session = await getCurrentUserSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="overflow-x-hidden">
      <section className="relative min-h-screen">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(100,255,198,0.2),transparent_24%),radial-gradient(circle_at_78%_18%,rgba(79,146,255,0.18),transparent_22%),linear-gradient(180deg,rgba(5,9,16,0.26),rgba(5,9,16,0.82))]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent" />

        <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 pt-6 pb-16 sm:px-8 lg:px-10">
          <header className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-3 text-sm font-medium tracking-[0.22em] text-white uppercase"
            >
              <span className="flex size-9 items-center justify-center rounded-2xl border border-emerald-300/18 bg-emerald-300/10 shadow-[0_0_40px_rgba(104,255,191,0.12)]">
                <Gamepad2 className="size-4 text-emerald-100" />
              </span>
              GameFlow
            </Link>

            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-white transition hover:border-white/16 hover:bg-white/[0.07]"
            >
              Sign in
            </Link>
          </header>

          <div className="grid flex-1 items-center gap-14 py-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-20 lg:py-20">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.68rem] font-semibold tracking-[0.2em] text-emerald-100 uppercase">
                <Sparkles className="size-3.5" />
                Game backlog clarity
              </div>

              <div className="mt-6 space-y-5">
                <p className="text-sm font-medium tracking-[0.18em] text-slate-300 uppercase">
                  Organize. Discover. Decide faster.
                </p>
                <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
                  Turn your gaming backlog into a clear next move.
                </h1>
                <p className="max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                  GameFlow helps gamers track what they own, cut through backlog
                  chaos, and know what to play next without overthinking it.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/login"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-emerald-200/20 bg-[linear-gradient(135deg,rgba(134,255,196,0.98),rgba(98,236,181,0.9))] px-5 text-sm font-semibold text-slate-950 shadow-[0_14px_36px_rgba(70,219,158,0.24)] transition hover:brightness-[1.03]"
                >
                  Try GameFlow
                </Link>
                <Link
                  href="#features"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-5 text-sm font-medium text-white transition hover:border-white/16 hover:bg-white/[0.07]"
                >
                  See what it does
                </Link>
              </div>

              <div className="mt-10 grid max-w-xl gap-4 border-t border-white/10 pt-6 text-sm text-slate-300 sm:grid-cols-3">
                <p>Track your backlog with less friction.</p>
                <p>Get focused recommendations.</p>
                <p>Know what to play tonight.</p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-10 -left-8 hidden h-40 w-40 rounded-full bg-emerald-300/12 blur-3xl lg:block" />
              <div className="absolute right-10 -bottom-8 hidden h-44 w-44 rounded-full bg-sky-400/12 blur-3xl lg:block" />

              <div className="gf-surface-strong relative overflow-hidden px-5 py-5 sm:px-7 sm:py-7">
                <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(103,255,189,0.14),transparent)]" />

                <div className="relative space-y-5">
                  <div className="flex items-center justify-between border-b border-white/8 pb-4">
                    <div>
                      <p className="text-xs font-semibold tracking-[0.22em] text-emerald-100/80 uppercase">
                        Inside GameFlow
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-white">
                        One calm place for gaming decisions
                      </h2>
                    </div>

                    <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300">
                      MVP ready
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[0.72fr_1.28fr]">
                    <div className="rounded-[1.5rem] border border-white/8 bg-black/18 p-4">
                      <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                        Workspace
                      </p>
                      <div className="mt-4 space-y-2">
                        {[
                          "Dashboard",
                          "Backlog",
                          "Discover",
                          "Tonight",
                          "Stats",
                        ].map((item, index) => (
                          <div
                            key={item}
                            className={`rounded-2xl px-3 py-2 text-sm ${
                              index === 0
                                ? "border border-emerald-300/18 bg-emerald-300/10 text-emerald-50"
                                : "border border-transparent bg-white/[0.035] text-slate-300"
                            }`}
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[1.5rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-4 sm:p-5">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-[1.25rem] border border-white/8 bg-black/20 p-4">
                          <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                            Tonight
                          </p>
                          <p className="mt-3 text-xl font-semibold text-white">
                            Hades
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-300">
                            Fast run, strong momentum, perfect for a short
                            session.
                          </p>
                        </div>

                        <div className="rounded-[1.25rem] border border-white/8 bg-black/20 p-4">
                          <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                            Backlog
                          </p>
                          <p className="mt-3 text-3xl font-semibold text-white">
                            28
                          </p>
                          <p className="mt-2 text-sm text-slate-300">
                            Games tracked with clean status control.
                          </p>
                        </div>

                        <div className="rounded-[1.25rem] border border-white/8 bg-black/20 p-4">
                          <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                            Recommendations
                          </p>
                          <p className="mt-3 text-sm leading-6 text-slate-300">
                            Genre-aware picks based on what you finish and rate
                            highly.
                          </p>
                        </div>

                        <div className="rounded-[1.25rem] border border-white/8 bg-black/20 p-4">
                          <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                            Completion rate
                          </p>
                          <p className="mt-3 text-3xl font-semibold text-white">
                            61%
                          </p>
                          <p className="mt-2 text-sm text-slate-300">
                            Enough signal to understand your habits.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 border-t border-white/8 pt-4 text-sm text-slate-300 sm:grid-cols-3">
                    <p>Built for backlog collectors and casual explorers.</p>
                    <p>Minimal clutter, fast actions, and clean dark UI.</p>
                    <p>Designed to reduce browsing loops and choice fatigue.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="about"
        className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-8 lg:px-10"
      >
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="space-y-4">
            <p className="text-sm font-semibold tracking-[0.2em] text-emerald-100/80 uppercase">
              What GameFlow is
            </p>
            <h2 className="max-w-lg text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              A focused gaming companion for the games you already have and the
              ones you want next.
            </h2>
          </div>

          <div className="grid gap-6 border-t border-white/8 pt-6 sm:grid-cols-3 sm:border-t-0 sm:pt-0">
            <div>
              <p className="text-lg font-semibold text-white">Track</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Keep your list current without turning it into homework.
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold text-white">Discover</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Save interesting games fast while you browse new options.
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold text-white">Decide</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Get enough context to stop scrolling and actually start playing.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="mx-auto w-full max-w-7xl px-6 py-4 sm:px-8 lg:px-10"
      >
        <div className="gf-surface px-6 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-col gap-3 border-b border-white/8 pb-6 sm:pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-emerald-100/80 uppercase">
                Core features
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                The MVP covers the gaming loop end to end.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-400">
              Enough structure to stay organized, enough guidance to know what
              to play next.
            </p>
          </div>

          <div className="grid gap-0 divide-y divide-white/8 md:grid-cols-2 md:divide-x md:divide-y-0">
            {featureList.map((feature) => {
              const Icon = feature.icon;

              return (
                <div key={feature.title} className="px-0 py-6 md:px-6 md:py-7">
                  <div className="flex items-start gap-4">
                    <span className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-emerald-100">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {feature.title}
                      </h3>
                      <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="space-y-4">
            <p className="text-sm font-semibold tracking-[0.2em] text-emerald-100/80 uppercase">
              Why it helps
            </p>
            <h2 className="max-w-md text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Built for the real problem: too many games, not enough clear
              choices.
            </h2>
          </div>

          <div className="space-y-5">
            {benefitList.map((benefit, index) => (
              <div
                key={benefit.title}
                className="flex gap-5 border-b border-white/8 pb-5 last:border-b-0 last:pb-0"
              >
                <span className="text-2xl font-semibold tracking-tight text-slate-500">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 pb-20 sm:px-8 lg:px-10">
        <div className="gf-accent-surface px-6 py-10 text-center sm:px-10 sm:py-12">
          <p className="text-sm font-semibold tracking-[0.2em] text-emerald-100/80 uppercase">
            Start now
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Spend less time deciding and more time actually playing.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
            Try GameFlow to organize your list, sharpen your next pick, and make
            your gaming habits easier to understand.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-emerald-200/20 bg-[linear-gradient(135deg,rgba(134,255,196,0.98),rgba(98,236,181,0.9))] px-5 text-sm font-semibold text-slate-950 shadow-[0_14px_36px_rgba(70,219,158,0.24)] transition hover:brightness-[1.03]"
            >
              Sign up or try the app
            </Link>
            <Link
              href="#about"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-5 text-sm font-medium text-white transition hover:border-white/16 hover:bg-white/[0.07]"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
