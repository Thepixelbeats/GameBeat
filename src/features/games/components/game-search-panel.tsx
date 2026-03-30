"use client";

import Image from "next/image";
import { LoaderCircle, Plus, Search } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

import { addSearchGameToBacklogAction } from "@/app/(app)/discover/actions";
import { AppShellPage } from "@/components/layout/app-shell-page";
import { SkeletonBlock } from "@/components/shared/skeleton-block";
import { StatePanel } from "@/components/shared/state-panel";
import { TagPill } from "@/components/shared/tag-pill";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { PublicGameSearchResult } from "@/services/games/types";

type SearchStatus = "idle" | "loading" | "success" | "error";

type SearchState = {
  status: SearchStatus;
  results: PublicGameSearchResult[];
  error: string | null;
};

const INITIAL_STATE: SearchState = {
  status: "idle",
  results: [],
  error: null,
};

export function GameSearchPanel() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchState, setSearchState] = useState<SearchState>(INITIAL_STATE);

  useEffect(() => {
    const normalizedQuery = query.trim();
    const timeoutId = window.setTimeout(
      () => {
        setDebouncedQuery(normalizedQuery);
      },
      normalizedQuery.length < 2 ? 0 : 350
    );

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.length === 0) {
      return;
    }

    if (debouncedQuery.length < 2) {
      return;
    }

    const controller = new AbortController();
    let isCancelled = false;

    queueMicrotask(() => {
      if (isCancelled) {
        return;
      }

      setSearchState((currentState) => ({
        status: "loading",
        results: currentState.results,
        error: null,
      }));

      void fetch(
        `/api/games/search?query=${encodeURIComponent(debouncedQuery)}`,
        {
          method: "GET",
          signal: controller.signal,
        }
      )
        .then(async (response) => {
          let payload: {
            results?: PublicGameSearchResult[];
            error?: string;
          } | null = null;

          try {
            payload = (await response.json()) as {
              results?: PublicGameSearchResult[];
              error?: string;
            };
          } catch {
            payload = null;
          }

          if (!response.ok) {
            throw new Error(
              payload?.error ?? "Something went wrong while searching."
            );
          }

          if (controller.signal.aborted) {
            return;
          }

          setSearchState({
            status: "success",
            results: payload?.results ?? [],
            error: null,
          });
        })
        .catch((error: unknown) => {
          if (controller.signal.aborted) {
            return;
          }

          setSearchState({
            status: "error",
            results: [],
            error:
              error instanceof Error
                ? error.message
                : "Something went wrong while searching.",
          });
        });
    });

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [debouncedQuery]);

  return (
    <AppShellPage
      eyebrow="Discover"
      title="Search public game data and save it fast"
      description="Look up titles from Steam, skim covers and genre tags, then drop the keepers straight into your backlog."
    >
      <div className="space-y-6">
        <div className="gf-surface p-4 sm:p-5">
          <label className="flex items-center gap-3 rounded-2xl border border-white/8 bg-slate-950/50 px-4 py-3">
            <Search className="text-muted-foreground size-5" />
            <Input
              value={query}
              onChange={(event) => {
                const nextQuery = event.target.value;

                setQuery(nextQuery);

                if (nextQuery.trim().length < 2) {
                  setSearchState(INITIAL_STATE);
                }
              }}
              placeholder="Search for Hades, Celeste, Elden Ring..."
              className="h-auto border-0 bg-transparent px-0 py-0 shadow-none focus-visible:ring-0"
              aria-label="Search games"
            />
          </label>
          <p className="text-muted-foreground mt-3 text-sm">
            Search waits a moment before calling the API so typing stays smooth.
          </p>
        </div>

        <SearchStatusMessage query={query} searchState={searchState} />

        {searchState.status === "loading" &&
        searchState.results.length === 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-[26rem]" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {searchState.results.map((game) => (
              <SearchResultCard key={game.externalId} game={game} />
            ))}
          </div>
        )}
      </div>
    </AppShellPage>
  );
}

function SearchStatusMessage({
  query,
  searchState,
}: {
  query: string;
  searchState: SearchState;
}) {
  if (query.trim().length === 0) {
    return (
      <StatePanel
        eyebrow="Discover"
        title="Search for something worth your next session"
        description="Results include cover art, release date, genres, and a one-click backlog action."
        size="compact"
        className="border-dashed"
      />
    );
  }

  if (query.trim().length < 2) {
    return (
      <StatePanel
        eyebrow="Keep Typing"
        title="Type at least 2 characters"
        description="A slightly longer search gives Steam enough context to return useful game matches."
        size="compact"
      />
    );
  }

  if (searchState.status === "loading") {
    return (
      <div className="gf-surface-muted flex items-center gap-3 px-5 py-4">
        <LoaderCircle className="text-primary size-4 animate-spin" />
        <p className="text-sm text-white">Searching games...</p>
      </div>
    );
  }

  if (searchState.status === "error") {
    return (
      <StatePanel
        eyebrow="Search Unavailable"
        title="We couldn't load search results"
        description={
          searchState.error ??
          "Try the same search again in a moment or broaden the title."
        }
        tone="error"
        size="compact"
      />
    );
  }

  if (searchState.status === "success" && searchState.results.length === 0) {
    return (
      <StatePanel
        eyebrow="No Matches"
        title="Nothing came back for that search"
        description="Try a shorter title, a broader search phrase, or a different spelling."
        size="compact"
      />
    );
  }

  return null;
}

function SearchResultCard({ game }: { game: PublicGameSearchResult }) {
  return (
    <Card className="overflow-hidden bg-transparent py-0 shadow-none">
      <div className="relative aspect-[16/9] bg-[linear-gradient(135deg,#16253a_0%,#0c1320_100%)]">
        {game.coverUrl ? (
          <Image
            src={game.coverUrl}
            alt={game.title}
            fill
            sizes="(min-width: 1280px) 28rem, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-white/70">
            Cover unavailable
          </div>
        )}
      </div>

      <CardHeader className="pb-0">
        <CardTitle className="text-lg text-white">{game.title}</CardTitle>
        <CardDescription>{formatReleaseDate(game.releaseDate)}</CardDescription>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="flex min-h-10 flex-wrap gap-2">
          {game.genres.length > 0 ? (
            game.genres.map((genre) => (
              <TagPill key={genre} className="px-2.5 py-1">
                {genre}
              </TagPill>
            ))
          ) : (
            <span className="text-muted-foreground text-sm">
              Genres unavailable
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="border-white/10 bg-transparent">
        <AddToBacklogButton game={game} />
      </CardFooter>
    </Card>
  );
}

function AddToBacklogButton({ game }: { game: PublicGameSearchResult }) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isBacklogged, setIsBacklogged] = useState(false);

  return (
    <div className="w-full space-y-2">
      <Button
        className="w-full"
        size="lg"
        disabled={isPending || isBacklogged}
        onClick={() => {
          startTransition(async () => {
            const result = await addSearchGameToBacklogAction({
              externalId: game.externalId,
              title: game.title,
              coverUrl: game.coverUrl ?? undefined,
              releaseDate: game.releaseDate ?? undefined,
              genres: game.genres,
            });

            setFeedback(result.message);
            setIsBacklogged(result.inBacklog);
          });
        }}
      >
        {isPending ? (
          <>
            <LoaderCircle className="size-4 animate-spin" />
            Saving...
          </>
        ) : isBacklogged ? (
          "In backlog"
        ) : (
          <>
            <Plus className="size-4" />
            Add to backlog
          </>
        )}
      </Button>

      {feedback ? (
        <p className="text-muted-foreground text-xs leading-5">{feedback}</p>
      ) : null}
    </div>
  );
}

function formatReleaseDate(releaseDate: string | null) {
  if (!releaseDate) {
    return "Release date unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(releaseDate));
}
