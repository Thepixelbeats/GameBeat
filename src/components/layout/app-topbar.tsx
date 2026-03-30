import Link from "next/link";
import { Search, Sparkles, UserRound } from "lucide-react";

import { LogoutButton } from "@/features/auth/components/logout-button";

type AppTopbarProps = {
  playerName: string;
  playerEmail: string;
};

export function AppTopbar({ playerName, playerEmail }: AppTopbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/8 bg-[rgba(7,12,20,0.76)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-[0.22em] text-emerald-100/75 uppercase">
              GameFlow
            </p>
            <p className="truncate text-sm text-slate-200 sm:text-base">
              A focused space for backlog, discovery, and nightly decisions.
            </p>
          </div>
        </div>

        <Link
          href="/discover"
          className="hidden min-w-0 flex-1 items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3 text-sm text-slate-300 transition hover:border-white/14 hover:bg-white/[0.06] lg:flex"
        >
          <Search className="size-4 shrink-0 text-slate-400" />
          <span className="truncate">Search games in Discover</span>
          <span className="ml-auto rounded-full border border-white/8 bg-white/[0.04] px-2 py-0.5 text-[0.65rem] font-semibold tracking-[0.18em] text-slate-400 uppercase">
            Go
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/discover"
            className="inline-flex size-10 items-center justify-center rounded-xl border border-white/8 bg-white/[0.04] text-slate-300 transition hover:border-white/14 hover:bg-white/[0.06] hover:text-white lg:hidden"
            aria-label="Search games in Discover"
          >
            <Search className="size-4" />
          </Link>

          <Link
            href="/settings"
            className="hidden items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.04] px-3 py-2 transition hover:border-white/14 hover:bg-white/[0.06] sm:flex"
          >
            <div className="text-right">
              <p className="text-sm font-medium text-white">{playerName}</p>
              <p className="text-xs text-slate-500">{playerEmail}</p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(139,255,198,0.22),rgba(76,160,255,0.16))] text-white">
              <Sparkles className="size-4" />
            </div>
          </Link>

          <Link
            href="/settings"
            className="inline-flex size-10 items-center justify-center rounded-xl border border-white/8 bg-white/[0.04] text-slate-300 transition hover:border-white/14 hover:bg-white/[0.06] hover:text-white sm:hidden"
            aria-label="Open settings"
          >
            <UserRound className="size-4" />
          </Link>

          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
