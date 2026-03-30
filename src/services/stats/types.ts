import type { GameStatus } from "@/lib/db/prisma-client";

export type StatsGenreDistributionItem = {
  genre: string;
  count: number;
  percentage: number;
};

export type StatsStatusBreakdownItem = {
  status: GameStatus;
  label: string;
  count: number;
  percentage: number;
};

export type StatsGamingDna = {
  title: string;
  summary: string;
  traits: string[];
};

export type StatsPageData = {
  playerName: string;
  trackedGamesCount: number;
  backlogSize: number;
  backlogQueuedCount: number;
  playingCount: number;
  completedCount: number;
  completionRate: number;
  completionBaseCount: number;
  backlogHoursEstimate: number;
  genreDistribution: StatsGenreDistributionItem[];
  statusBreakdown: StatsStatusBreakdownItem[];
  gamingDna: StatsGamingDna;
  hasTrackedGames: boolean;
};
