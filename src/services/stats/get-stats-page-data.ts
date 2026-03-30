import type { GameStatus } from "@/lib/db/prisma-client";

import { listStatsEntriesForUser } from "@/lib/db/stats";
import { getCurrentUser } from "@/services/auth/get-current-user";
import type {
  StatsGamingDna,
  StatsGenreDistributionItem,
  StatsPageData,
  StatsStatusBreakdownItem,
} from "@/services/stats/types";

const ACTIVE_BACKLOG_STATUSES = new Set<GameStatus>(["BACKLOG", "PLAYING"]);
const COMPLETION_BASE_STATUSES = new Set<GameStatus>([
  "BACKLOG",
  "PLAYING",
  "COMPLETED",
  "DROPPED",
]);
const HIGHLY_RATED_THRESHOLD = 8;
const DEFAULT_GAME_HOURS = 18;
const GENRE_DISTRIBUTION_LIMIT = 6;
const DNA_GENRE_LIMIT = 3;

const HOURS_BY_GENRE: Record<string, number> = {
  Action: 14,
  "Card Game": 16,
  Horror: 12,
  Metroidvania: 22,
  "Open World": 42,
  Platformer: 14,
  RPG: 38,
  Roguelike: 20,
  Shooter: 16,
  Strategy: 24,
  "Turn-Based Strategy": 30,
};

const STATUS_LABELS: Record<GameStatus, string> = {
  BACKLOG: "Backlog",
  PLAYING: "Playing",
  COMPLETED: "Completed",
  DROPPED: "Dropped",
  WISHLIST: "Wishlist",
};

const STATUS_ORDER: GameStatus[] = [
  "BACKLOG",
  "PLAYING",
  "COMPLETED",
  "DROPPED",
  "WISHLIST",
];

const listFormatter = new Intl.ListFormat("en", {
  style: "long",
  type: "conjunction",
});

type StatsEntryRecord = Awaited<ReturnType<typeof listStatsEntriesForUser>>[number];

function isCompleted(entry: StatsEntryRecord) {
  return entry.status === "COMPLETED";
}

function isHighlyRated(entry: StatsEntryRecord) {
  return typeof entry.userRating === "number" &&
    entry.userRating >= HIGHLY_RATED_THRESHOLD;
}

function sortGenreCounts(
  left: StatsGenreDistributionItem,
  right: StatsGenreDistributionItem
) {
  if (right.count !== left.count) {
    return right.count - left.count;
  }

  return left.genre.localeCompare(right.genre);
}

function buildGenreCounts(entries: StatsEntryRecord[]) {
  const counts = new Map<string, number>();

  for (const entry of entries) {
    for (const genre of entry.game.genres) {
      counts.set(genre, (counts.get(genre) ?? 0) + 1);
    }
  }

  return counts;
}

function buildGenreDistribution(entries: StatsEntryRecord[]) {
  if (entries.length === 0) {
    return [];
  }

  const totalGames = entries.length;

  return [...buildGenreCounts(entries).entries()]
    .map(
      ([genre, count]): StatsGenreDistributionItem => ({
        genre,
        count,
        percentage: Math.round((count / totalGames) * 100),
      })
    )
    .sort(sortGenreCounts)
    .slice(0, GENRE_DISTRIBUTION_LIMIT);
}

function buildStatusBreakdown(entries: StatsEntryRecord[]) {
  const totalGames = entries.length;
  const statusCounts = entries.reduce<Record<GameStatus, number>>(
    (accumulator, entry) => {
      accumulator[entry.status] += 1;
      return accumulator;
    },
    {
      BACKLOG: 0,
      PLAYING: 0,
      COMPLETED: 0,
      DROPPED: 0,
      WISHLIST: 0,
    }
  );

  return STATUS_ORDER.map(
    (status): StatsStatusBreakdownItem => ({
      status,
      label: STATUS_LABELS[status],
      count: statusCounts[status],
      percentage:
        totalGames > 0 ? Math.round((statusCounts[status] / totalGames) * 100) : 0,
    })
  );
}

function getEstimatedHoursForGame(entry: StatsEntryRecord) {
  const matchedHours = entry.game.genres
    .map((genre) => HOURS_BY_GENRE[genre])
    .filter((value): value is number => typeof value === "number");

  if (matchedHours.length === 0) {
    return DEFAULT_GAME_HOURS;
  }

  const averageHours =
    matchedHours.reduce((total, value) => total + value, 0) / matchedHours.length;

  return Math.round(averageHours);
}

function getTopGenres(entries: StatsEntryRecord[]) {
  return [...buildGenreCounts(entries).entries()]
    .map(([genre, count]) => ({
      genre,
      count,
    }))
    .sort((left, right) => {
      if (right.count !== left.count) {
        return right.count - left.count;
      }

      return left.genre.localeCompare(right.genre);
    })
    .slice(0, DNA_GENRE_LIMIT)
    .map(({ genre }) => genre);
}

function includesAny(genres: string[], candidates: string[]) {
  return candidates.some((candidate) => genres.includes(candidate));
}

function buildDnaTitle(topGenres: string[]) {
  if (
    includesAny(topGenres, ["Strategy", "Turn-Based Strategy", "Card Game"]) &&
    includesAny(topGenres, ["Roguelike", "Action"])
  ) {
    return "Systems-first run chaser";
  }

  if (includesAny(topGenres, ["RPG", "Open World"])) {
    return "Long-form world explorer";
  }

  if (includesAny(topGenres, ["Strategy", "Turn-Based Strategy", "Card Game"])) {
    return "Tactical systems thinker";
  }

  if (includesAny(topGenres, ["Roguelike", "Action", "Shooter"])) {
    return "Momentum-driven action hunter";
  }

  if (includesAny(topGenres, ["Metroidvania", "Platformer"])) {
    return "Precision-first explorer";
  }

  return "Taste profile in progress";
}

function buildCompletionTrait(completionRate: number) {
  if (completionRate >= 60) {
    return "High follow-through";
  }

  if (completionRate >= 35) {
    return "Balanced finisher";
  }

  return "Exploration-heavy queue";
}

function buildSessionTrait(topGenres: string[]) {
  if (includesAny(topGenres, ["Roguelike", "Card Game", "Action"])) {
    return "Short-session friendly";
  }

  if (includesAny(topGenres, ["RPG", "Open World"])) {
    return "Long-session lean";
  }

  if (includesAny(topGenres, ["Strategy", "Turn-Based Strategy"])) {
    return "Mastery over spectacle";
  }

  return "Mixed session profile";
}

function buildGamingDna(
  playerName: string,
  signalEntries: StatsEntryRecord[],
  trackedEntries: StatsEntryRecord[],
  completionRate: number,
  completedCount: number,
  completionBaseCount: number
): StatsGamingDna {
  const sourceEntries = signalEntries.length > 0 ? signalEntries : trackedEntries;
  const topGenres = getTopGenres(sourceEntries);

  if (trackedEntries.length === 0) {
    return {
      title: "Taste profile waiting on data",
      summary:
        "Add a few games to your library and the stats page will start turning your backlog into genre and completion insights.",
      traits: ["No tracked games yet"],
    };
  }

  const genreText =
    topGenres.length > 0 ? listFormatter.format(topGenres) : "a wide mix of genres";
  const completionSentence =
    completionBaseCount > 0
      ? completionRate >= 50
        ? `${playerName} tends to finish what they start, clearing ${completedCount} of ${completionBaseCount} non-wishlist entries so far.`
        : `${playerName} explores broadly, with ${completedCount} of ${completionBaseCount} non-wishlist entries completed so far.`
      : "Move a few games out of the wishlist and completion habits will start to show up here.";
  const ratingSentence =
    signalEntries.length > 0
      ? "Your strongest ratings and completions are already shaping a clear taste profile."
      : "A few ratings or completions will sharpen this profile beyond the games you have simply tracked.";

  return {
    title: buildDnaTitle(topGenres),
    summary: `${playerName} gravitates toward ${genreText}. ${completionSentence} ${ratingSentence}`,
    traits: [...topGenres, buildCompletionTrait(completionRate), buildSessionTrait(topGenres)]
      .filter((value, index, values) => values.indexOf(value) === index)
      .slice(0, 5),
  };
}

export async function getStatsPageData(): Promise<StatsPageData> {
  const user = await getCurrentUser();
  const entries = await listStatsEntriesForUser(user.id);

  const activeBacklogEntries = entries.filter((entry) =>
    ACTIVE_BACKLOG_STATUSES.has(entry.status)
  );
  const completionBaseEntries = entries.filter((entry) =>
    COMPLETION_BASE_STATUSES.has(entry.status)
  );
  const completedCount = entries.filter(isCompleted).length;
  const completionBaseCount = completionBaseEntries.length;
  const completionRate =
    completionBaseCount > 0
      ? Math.round((completedCount / completionBaseCount) * 100)
      : 0;
  const signalEntries = entries.filter(
    (entry) => isCompleted(entry) || isHighlyRated(entry)
  );

  return {
    playerName: user.name?.trim() || "Player One",
    trackedGamesCount: entries.length,
    backlogSize: activeBacklogEntries.length,
    backlogQueuedCount: entries.filter((entry) => entry.status === "BACKLOG").length,
    playingCount: entries.filter((entry) => entry.status === "PLAYING").length,
    completedCount,
    completionRate,
    completionBaseCount,
    backlogHoursEstimate: activeBacklogEntries.reduce(
      (total, entry) => total + getEstimatedHoursForGame(entry),
      0
    ),
    genreDistribution: buildGenreDistribution(entries),
    statusBreakdown: buildStatusBreakdown(entries),
    gamingDna: buildGamingDna(
      user.name?.trim() || "Player One",
      signalEntries,
      entries,
      completionRate,
      completedCount,
      completionBaseCount
    ),
    hasTrackedGames: entries.length > 0,
  };
}
