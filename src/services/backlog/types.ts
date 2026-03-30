import type { GameStatus } from "@/lib/db/prisma-client";

export type BacklogViewMode = "grid" | "list";

export type BacklogSortOption =
  | "recent"
  | "title"
  | "priority"
  | "rating"
  | "status";

export type BacklogFilterStatus = GameStatus | "ALL";

export type BacklogGameRecord = {
  id: string;
  externalId: string;
  title: string;
  slug: string | null;
  coverUrl: string | null;
  releaseDate: string | null;
  genres: string[];
  platforms: string[];
  rating: number | null;
};

export type BacklogEntry = {
  id: string;
  status: GameStatus;
  userRating: number | null;
  notes: string | null;
  priority: number | null;
  addedAt: string;
  updatedAt: string;
  game: BacklogGameRecord;
};

export type BacklogPageData = {
  availableGames: BacklogGameRecord[];
  entries: BacklogEntry[];
  statusCounts: Record<GameStatus, number>;
};
