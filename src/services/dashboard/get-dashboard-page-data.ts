import { listUserBacklogCountsByStatus } from "@/lib/db/backlog";
import {
  countCompletedGamesForUser,
  countTrackedGamesForUser,
  getAverageUserRatingForUser,
  listRecentlyAddedEntriesForUser,
} from "@/lib/db/dashboard";
import { getCurrentUser } from "@/services/auth/get-current-user";
import type {
  DashboardPageData,
  DashboardRecentGame,
} from "@/services/dashboard/types";

function formatAverageRating(value: number | null) {
  return value ? value.toFixed(1) : "N/A";
}

function serializeRecentGame(
  entry: Awaited<ReturnType<typeof listRecentlyAddedEntriesForUser>>[number]
): DashboardRecentGame {
  return {
    id: entry.id,
    title: entry.game.title,
    coverUrl: entry.game.coverUrl,
    status: entry.status,
    addedAt: entry.addedAt.toISOString(),
    genres: entry.game.genres,
    platforms: entry.game.platforms,
    rating: entry.game.rating,
  };
}

export async function getDashboardPageData(): Promise<DashboardPageData> {
  const user = await getCurrentUser();

  const [
    trackedGames,
    statusCounts,
    completedGames,
    averageRating,
    recentGames,
  ] = await Promise.all([
    countTrackedGamesForUser(user.id),
    listUserBacklogCountsByStatus(user.id),
    countCompletedGamesForUser(user.id),
    getAverageUserRatingForUser(user.id),
    listRecentlyAddedEntriesForUser(user.id),
  ]);

  return {
    playerName: user.name?.trim() || "Player One",
    trackedGamesCount: trackedGames,
    hasTrackedGames: trackedGames > 0,
    stats: [
      {
        label: "Tracked games",
        value: trackedGames.toString(),
        hint: `${statusCounts.WISHLIST} on the wishlist right now`,
      },
      {
        label: "Backlog focus",
        value: statusCounts.BACKLOG.toString(),
        hint: `${statusCounts.PLAYING} currently in rotation`,
      },
      {
        label: "Completed",
        value: completedGames.toString(),
        hint: "Finished and logged in your library",
      },
      {
        label: "Your average rating",
        value: formatAverageRating(averageRating),
        hint: "Based on games you have scored",
      },
    ],
    recentGames: recentGames.map(serializeRecentGame),
    quickActions: [
      {
        label: "Manage backlog",
        description:
          "Update status, priorities, and notes for your tracked list.",
        href: "/backlog",
      },
      {
        label: "Discover something new",
        description: "Browse fresh picks when you want a new obsession.",
        href: "/discover",
      },
      {
        label: "Open recommendations",
        description:
          "See your tailored list when you want a stronger starting point.",
        href: "/recommendations",
      },
      {
        label: "Open tonight",
        description: "Answer three quick prompts and get three picks.",
        href: "/tonight",
      },
    ],
    tonight: {
      title: "Tonight suggestions are ready",
      description:
        "Open the picker, set your session length, mood, and play style, then get three practical suggestions.",
    },
  };
}
