"use client";

import Link from "next/link";
import { Grip, LayoutList, Search, Star, Trash2, Trophy } from "lucide-react";
import type { ReactNode } from "react";
import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";

import {
  addBacklogEntryAction,
  removeBacklogEntryAction,
  updateBacklogEntryAction,
} from "@/app/(app)/backlog/actions";
import { GameCoverArt } from "@/components/game/game-cover-art";
import { AppShellPage } from "@/components/layout/app-shell-page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  initialBacklogActionState,
  type BacklogActionState,
} from "@/features/backlog/action-state";
import { StatePanel } from "@/components/shared/state-panel";
import { TagPill } from "@/components/shared/tag-pill";
import { cn } from "@/lib/utils";
import {
  formatGenreSummary,
  formatPlatformSummary,
  formatReleaseYear,
  formatStatusLabel,
} from "@/lib/utils/game-presentation";
import {
  filterAvailableBacklogGames,
  filterBacklogEntries,
  sortBacklogEntries,
} from "@/services/backlog/collection";
import type {
  BacklogEntry,
  BacklogFilterStatus,
  BacklogGameRecord,
  BacklogPageData,
  BacklogSortOption,
  BacklogViewMode,
} from "@/services/backlog/types";

const statusOptions: Array<{ label: string; value: BacklogFilterStatus }> = [
  { label: "All", value: "ALL" },
  { label: "Backlog", value: "BACKLOG" },
  { label: "Playing", value: "PLAYING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Dropped", value: "DROPPED" },
  { label: "Wishlist", value: "WISHLIST" },
];

const sortOptions: Array<{ label: string; value: BacklogSortOption }> = [
  { label: "Recently added", value: "recent" },
  { label: "Title", value: "title" },
  { label: "Priority", value: "priority" },
  { label: "Your rating", value: "rating" },
  { label: "Status", value: "status" },
];

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function ActionMessage({ state }: { state: BacklogActionState }) {
  if (state.status === "idle") {
    return null;
  }

  return (
    <p
      className={cn(
        "text-xs",
        state.status === "error" ? "text-red-300" : "text-emerald-200"
      )}
    >
      {state.message}
    </p>
  );
}

function SubmitButton({
  label,
  pendingLabel,
  variant = "default",
  className,
  icon,
}: {
  label: string;
  pendingLabel: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive";
  className?: string;
  icon?: ReactNode;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={variant}
      className={className}
      disabled={pending}
    >
      {icon}
      {pending ? pendingLabel : label}
    </Button>
  );
}

function AddGameForm({ games }: { games: BacklogGameRecord[] }) {
  const [state, formAction] = useActionState(
    addBacklogEntryAction,
    initialBacklogActionState
  );

  if (games.length === 0) {
    return (
      <Card className="bg-transparent shadow-none">
        <CardHeader className="space-y-2">
          <p className="text-xs font-semibold tracking-[0.22em] text-emerald-100/80 uppercase">
            Add from database
          </p>
          <CardTitle>Everything here is already tracked</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-slate-400">
            You have already added every current database record to your
            library. Use Discover to pull in something new, or update the
            entries you already have.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-transparent shadow-none">
      <CardHeader className="space-y-2">
        <p className="text-xs font-semibold tracking-[0.22em] text-emerald-100/80 uppercase">
          Add from database
        </p>
        <CardTitle>Bring an existing game record into your queue</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          key={games[0].id}
          action={formAction}
          className="flex flex-col gap-4"
        >
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-muted-foreground">Game record</span>
            <select
              name="gameId"
              defaultValue={games[0]?.id ?? ""}
              className="gf-input px-3"
            >
              {games.map((game) => (
                <option key={game.id} value={game.id}>
                  {game.title} • {formatReleaseYear(game.releaseDate)}
                </option>
              ))}
            </select>
          </label>

          <ActionMessage state={state} />

          <SubmitButton
            label="Add game"
            pendingLabel="Adding..."
            className="w-full"
          />
        </form>
      </CardContent>
    </Card>
  );
}

function EntryForm({
  entry,
  viewMode,
}: {
  entry: BacklogEntry;
  viewMode: BacklogViewMode;
}) {
  const [updateState, updateAction] = useActionState(
    updateBacklogEntryAction,
    initialBacklogActionState
  );
  const [removeState, removeAction] = useActionState(
    removeBacklogEntryAction,
    initialBacklogActionState
  );

  const isList = viewMode === "list";

  return (
    <article
      className={cn(
        "gf-surface p-4 sm:p-5",
        isList ? "grid gap-4 lg:grid-cols-[84px_1fr]" : "flex flex-col gap-4"
      )}
    >
      <div className={cn("shrink-0", isList ? "w-[4.5rem]" : "")}>
        <GameCoverArt
          title={entry.game.title}
          coverUrl={entry.game.coverUrl}
          compact={isList}
        />
      </div>

      <div className="min-w-0 space-y-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <TagPill
              tone="cyan"
              className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase"
            >
              {formatStatusLabel(entry.status)}
            </TagPill>
            <span className="text-xs text-slate-400">
              {formatReleaseYear(entry.game.releaseDate)}
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">
              {entry.game.title}
            </h3>
            <p className="text-sm leading-6 text-slate-400">
              {formatGenreSummary(entry.game.genres)}
            </p>
            <p className="text-xs text-slate-500">
              {formatPlatformSummary(entry.game.platforms)}
            </p>
          </div>
        </div>

        <form action={updateAction} className="space-y-4">
          <input type="hidden" name="entryId" value={entry.id} />

          <div className="grid gap-3 md:grid-cols-3">
            <label className="flex flex-col gap-2 text-sm">
              <span className="text-muted-foreground">Status</span>
              <select
                name="status"
                defaultValue={entry.status}
                className="gf-input h-10 rounded-xl px-3"
              >
                {statusOptions
                  .filter((option) => option.value !== "ALL")
                  .map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm">
              <span className="text-muted-foreground">Your rating</span>
              <input
                name="userRating"
                type="number"
                min={1}
                max={10}
                defaultValue={entry.userRating ?? ""}
                placeholder="1-10"
                className="gf-input h-10 rounded-xl px-3"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm">
              <span className="text-muted-foreground">Priority</span>
              <input
                name="priority"
                type="number"
                min={1}
                max={5}
                defaultValue={entry.priority ?? ""}
                placeholder="1-5"
                className="gf-input h-10 rounded-xl px-3"
              />
            </label>
          </div>

          <label className="flex flex-col gap-2 text-sm">
            <span className="text-muted-foreground">Notes</span>
            <textarea
              name="notes"
              defaultValue={entry.notes ?? ""}
              rows={isList ? 3 : 4}
              placeholder="Why this game matters, where you left off, or what you want to revisit."
              className="gf-input min-h-24 rounded-[1rem] px-3 py-2.5"
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1">
                <Star className="size-3.5" />
                Critic{" "}
                {entry.game.rating ? entry.game.rating.toFixed(1) : "N/A"}
              </span>
              <span className="inline-flex items-center gap-1">
                <Trophy className="size-3.5" />
                Updated {formatUpdatedAt(entry.updatedAt)}
              </span>
            </div>

            <SubmitButton
              label="Save changes"
              pendingLabel="Saving..."
              variant="secondary"
            />
          </div>

          <ActionMessage state={updateState} />
        </form>

        <form
          action={removeAction}
          className="flex items-center justify-between gap-3"
        >
          <input type="hidden" name="entryId" value={entry.id} />
          <ActionMessage state={removeState} />
          <SubmitButton
            label="Remove"
            pendingLabel="Removing..."
            variant="ghost"
            className="text-red-200 hover:bg-red-500/10 hover:text-red-100"
            icon={<Trash2 className="size-4" />}
          />
        </form>
      </div>
    </article>
  );
}

type BacklogScreenProps = {
  data: BacklogPageData;
};

export function BacklogScreen({ data }: BacklogScreenProps) {
  const [viewMode, setViewMode] = useState<BacklogViewMode>("grid");
  const [sortBy, setSortBy] = useState<BacklogSortOption>("recent");
  const [statusFilter, setStatusFilter] = useState<BacklogFilterStatus>("ALL");
  const [backlogQuery, setBacklogQuery] = useState("");
  const [libraryQuery, setLibraryQuery] = useState("");

  const filteredEntries = useMemo(
    () =>
      sortBacklogEntries(
        filterBacklogEntries(data.entries, backlogQuery, statusFilter),
        sortBy
      ),
    [backlogQuery, data.entries, sortBy, statusFilter]
  );

  const addableGames = useMemo(
    () =>
      filterAvailableBacklogGames(
        data.availableGames,
        data.entries,
        libraryQuery
      ),
    [data.availableGames, data.entries, libraryQuery]
  );
  const totalAddableGames = useMemo(
    () =>
      filterAvailableBacklogGames(data.availableGames, data.entries, "").length,
    [data.availableGames, data.entries]
  );

  return (
    <div className="flex flex-col gap-6">
      <AppShellPage
        eyebrow="Backlog"
        title="Manage the queue you actually want to play"
        description="Add games from the database, update progress, rate each title, capture notes, set priorities, and sort the list around the session you want next."
        actions={
          <div className="gf-surface-muted flex items-center gap-2 p-1">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition",
                viewMode === "grid"
                  ? "bg-[linear-gradient(135deg,rgba(134,255,196,0.96),rgba(98,236,181,0.88))] text-slate-950 shadow-[0_10px_24px_rgba(70,219,158,0.16)]"
                  : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
              )}
            >
              <Grip className="size-4" />
              Grid
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition",
                viewMode === "list"
                  ? "bg-[linear-gradient(135deg,rgba(134,255,196,0.96),rgba(98,236,181,0.88))] text-slate-950 shadow-[0_10px_24px_rgba(70,219,158,0.16)]"
                  : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
              )}
            >
              <LayoutList className="size-4" />
              List
            </button>
          </div>
        }
      >
        <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
          <section className="grid gap-4 sm:grid-cols-3">
            <Card className="bg-transparent shadow-none">
              <CardContent className="space-y-1 pt-4">
                <p className="text-3xl font-semibold text-white">
                  {data.entries.length}
                </p>
                <p className="text-sm text-slate-400">Tracked entries</p>
              </CardContent>
            </Card>
            <Card className="bg-transparent shadow-none">
              <CardContent className="space-y-1 pt-4">
                <p className="text-3xl font-semibold text-white">
                  {data.statusCounts.PLAYING + data.statusCounts.BACKLOG}
                </p>
                <p className="text-sm text-slate-400">Active rotation</p>
              </CardContent>
            </Card>
            <Card className="bg-transparent shadow-none">
              <CardContent className="space-y-1 pt-4">
                <p className="text-3xl font-semibold text-white">
                  {totalAddableGames}
                </p>
                <p className="text-sm text-slate-400">Available DB records</p>
              </CardContent>
            </Card>
          </section>

          <div className="space-y-4">
            <label className="relative block">
              <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-white/45" />
              <input
                value={libraryQuery}
                onChange={(event) => setLibraryQuery(event.target.value)}
                placeholder="Search database records to add"
                className="gf-input w-full pl-11"
              />
            </label>

            <AddGameForm games={addableGames} />
          </div>
        </div>
      </AppShellPage>

      <section className="gf-surface p-5 sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <label className="relative block max-w-2xl flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-white/45" />
              <input
                value={backlogQuery}
                onChange={(event) => setBacklogQuery(event.target.value)}
                placeholder="Filter by title, genre, or platform"
                className="gf-input w-full pl-11"
              />
            </label>

            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value as BacklogSortOption)
              }
              className="gf-input min-w-52 px-4"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  Sort by {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setStatusFilter(option.value)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold tracking-[0.16em] uppercase transition",
                  statusFilter === option.value
                    ? "border-emerald-300/24 bg-emerald-300/10 text-emerald-100"
                    : "border-white/10 bg-white/[0.04] text-slate-400 hover:border-white/16 hover:text-white"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {data.entries.length === 0 ? (
        <StatePanel
          eyebrow="Empty Backlog"
          title="Your backlog is still empty"
          description="Start by adding a title from the database records above or discover something new, then come back here to shape the queue with status, rating, notes, and priority."
          actions={
            <>
              <Button render={<Link href="/discover" />}>Discover games</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setLibraryQuery("")}
              >
                Show all database records
              </Button>
            </>
          }
          className="border-dashed"
        />
      ) : filteredEntries.length === 0 ? (
        <StatePanel
          eyebrow="No Match"
          title="No entries match this view"
          description="Your library has games in it, but this combination of search, status, and sort settings is hiding them right now."
          actions={
            <Button
              type="button"
              onClick={() => {
                setBacklogQuery("");
                setSortBy("recent");
                setStatusFilter("ALL");
              }}
            >
              Clear filters
            </Button>
          }
          className="border-dashed"
        />
      ) : (
        <section
          className={cn(
            viewMode === "grid"
              ? "grid gap-5 md:grid-cols-2 2xl:grid-cols-3"
              : "flex flex-col gap-5"
          )}
        >
          {filteredEntries.map((entry) => (
            <EntryForm key={entry.id} entry={entry} viewMode={viewMode} />
          ))}
        </section>
      )}
    </div>
  );
}
