import type { GameStatus } from "@/lib/db/prisma-client";

let sequence = 0;

function makeCuid() {
  sequence += 1;
  return `c${String(sequence).padStart(24, "0")}`;
}

type GameOverrides = Partial<{
  id: string;
  externalId: string;
  title: string;
  slug: string | null;
  coverUrl: string | null;
  releaseDate: Date | null;
  genres: string[];
  platforms: string[];
  rating: number | null;
}>;

type UserOverrides = Partial<{
  id: string;
  email: string;
  name: string | null;
}>;

type EntryOverrides = Partial<{
  id: string;
  userId: string;
  gameId: string;
  status: GameStatus;
  userRating: number | null;
  notes: string | null;
  priority: number | null;
  addedAt: Date;
  updatedAt: Date;
  game: ReturnType<typeof makeGame>;
}>;

export function makeUser(overrides: UserOverrides = {}) {
  const id = overrides.id ?? makeCuid();

  return {
    id,
    email: overrides.email ?? `${id}@example.com`,
    name: overrides.name ?? "Player One",
  };
}

export function makeGame(overrides: GameOverrides = {}) {
  const id = overrides.id ?? makeCuid();

  return {
    id,
    externalId: overrides.externalId ?? `steam:${sequence}`,
    title: overrides.title ?? `Game ${sequence}`,
    slug: overrides.slug ?? `game-${sequence}`,
    coverUrl: overrides.coverUrl ?? "https://cdn.example.com/game.jpg",
    releaseDate: overrides.releaseDate ?? new Date("2024-01-01T00:00:00.000Z"),
    genres: overrides.genres ?? ["Action"],
    platforms: overrides.platforms ?? ["PC"],
    rating: overrides.rating ?? 8.5,
  };
}

export function makeEntry(overrides: EntryOverrides = {}) {
  const game = overrides.game ?? makeGame();

  return {
    id: overrides.id ?? makeCuid(),
    userId: overrides.userId ?? makeCuid(),
    gameId: overrides.gameId ?? game.id,
    status: overrides.status ?? "BACKLOG",
    userRating: overrides.userRating ?? null,
    notes: overrides.notes ?? null,
    priority: overrides.priority ?? null,
    addedAt: overrides.addedAt ?? new Date("2024-01-02T00:00:00.000Z"),
    updatedAt: overrides.updatedAt ?? new Date("2024-01-03T00:00:00.000Z"),
    game,
  };
}
