import type { GameStatus } from "@/lib/db/prisma-client";

export type DashboardStat = {
  label: string;
  value: string;
  hint: string;
};

export type DashboardRecentGame = {
  id: string;
  title: string;
  coverUrl: string | null;
  status: GameStatus;
  addedAt: string;
  genres: string[];
  platforms: string[];
  rating: number | null;
};

export type DashboardQuickAction = {
  label: string;
  description: string;
  href: string;
};

export type DashboardTonightPlaceholder = {
  title: string;
  description: string;
};

export type DashboardPageData = {
  playerName: string;
  trackedGamesCount: number;
  hasTrackedGames: boolean;
  stats: DashboardStat[];
  recentGames: DashboardRecentGame[];
  quickActions: DashboardQuickAction[];
  tonight: DashboardTonightPlaceholder;
};
