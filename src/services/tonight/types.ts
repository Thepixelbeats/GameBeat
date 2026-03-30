import type { GameStatus } from "@/lib/db/prisma-client";

export type TonightSessionLength = "short" | "medium" | "long";
export type TonightMood = "chill" | "focused" | "intense" | "story";
export type TonightPlayStyle = "solo" | "multiplayer";

export type TonightFilters = {
  sessionLength: TonightSessionLength;
  mood: TonightMood;
  playStyle: TonightPlayStyle;
};

export type TonightSuggestion = {
  id: string;
  title: string;
  coverUrl: string | null;
  releaseDate: string | null;
  genres: string[];
  platforms: string[];
  rating: number | null;
  reason: string;
  sourceLabel: string;
  status: GameStatus | null;
};

export type TonightPageData = {
  playerName: string;
  filters: TonightFilters;
  favoriteGenres: string[];
  trackedOptionsCount: number;
  suggestions: TonightSuggestion[];
  multiplayerNote: string | null;
};
