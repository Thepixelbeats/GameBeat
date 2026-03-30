import type { GameStatus } from "@/lib/db/prisma-client";

import { listUserBacklogEntries } from "@/lib/db/backlog";
import { listRecommendationCandidateGames } from "@/lib/db/recommendations";
import { getCurrentUser } from "@/services/auth/get-current-user";
import { tonightFiltersSchema } from "@/lib/validations/tonight";
import type {
  TonightFilters,
  TonightMood,
  TonightPageData,
  TonightSessionLength,
  TonightSuggestion,
} from "@/services/tonight/types";

const HIGHLY_RATED_THRESHOLD = 8;
const TONIGHT_SUGGESTION_LIMIT = 3;
const TASTE_GENRE_LIMIT = 4;

type QueryValue = string | string[] | undefined;

type EntryRecord = Awaited<ReturnType<typeof listUserBacklogEntries>>[number];
type CandidateGameRecord = Awaited<
  ReturnType<typeof listRecommendationCandidateGames>
>[number];

type TasteProfile = {
  favoriteGenres: string[];
  genreScores: Map<string, number>;
};

type PoolGame = {
  id: string;
  title: string;
  coverUrl: string | null;
  releaseDate: string | null;
  genres: string[];
  platforms: string[];
  rating: number | null;
  source: "TRACKED" | "DISCOVER";
  status: GameStatus | null;
  priority: number | null;
  userRating: number | null;
  notes: string | null;
};

type ScoreReason = {
  score: number;
  text: string;
};

type ScoredSuggestion = TonightSuggestion & {
  score: number;
  multiplayerSignal: number;
};

const sessionLengthLabels: Record<TonightSessionLength, string> = {
  short: "short session",
  medium: "steady evening block",
  long: "longer session",
};

const moodLabels: Record<TonightMood, string> = {
  chill: "relaxed pace",
  focused: "focused mood",
  intense: "high-energy mood",
  story: "story-first mood",
};

const SESSION_GENRE_WEIGHTS: Record<
  TonightSessionLength,
  Record<string, number>
> = {
  short: {
    Roguelike: 24,
    "Card Game": 22,
    Action: 10,
    Shooter: 10,
    Strategy: 10,
    Platformer: 8,
    RPG: -10,
    "Open World": -14,
  },
  medium: {
    Action: 12,
    Strategy: 12,
    "Turn-Based Strategy": 12,
    Metroidvania: 10,
    Roguelike: 10,
    RPG: 8,
    "Open World": 2,
  },
  long: {
    RPG: 20,
    "Open World": 18,
    "Turn-Based Strategy": 14,
    Strategy: 10,
    Metroidvania: 8,
    "Card Game": -4,
    Roguelike: -6,
  },
};

const MOOD_GENRE_WEIGHTS: Record<TonightMood, Record<string, number>> = {
  chill: {
    "Card Game": 18,
    Strategy: 16,
    "Turn-Based Strategy": 16,
    Metroidvania: 8,
    RPG: 6,
  },
  focused: {
    Strategy: 20,
    "Turn-Based Strategy": 20,
    "Card Game": 14,
    Metroidvania: 12,
    Roguelike: 8,
  },
  intense: {
    Action: 20,
    Shooter: 20,
    Roguelike: 16,
    Platformer: 10,
  },
  story: {
    RPG: 20,
    "Open World": 18,
    Metroidvania: 8,
    Action: 6,
  },
};

const SOLO_GENRE_WEIGHTS: Record<string, number> = {
  RPG: 18,
  "Open World": 16,
  Metroidvania: 12,
  "Turn-Based Strategy": 10,
  Strategy: 8,
  "Card Game": 6,
};

const MULTIPLAYER_GENRE_WEIGHTS: Record<string, number> = {
  Shooter: 16,
  Action: 10,
  Strategy: 10,
  "Turn-Based Strategy": 6,
  "Card Game": 6,
};

const MULTIPLAYER_TITLE_KEYWORDS = [
  "risk of rain",
  "monster hunter",
  "helldivers",
  "diablo",
  "fortnite",
  "apex",
  "overcooked",
  "rocket league",
  "mario kart",
  "valorant",
  "destiny",
  "warframe",
];

const PLAYABLE_STATUSES = new Set<GameStatus>([
  "PLAYING",
  "BACKLOG",
  "WISHLIST",
]);

function getQueryValue(value: QueryValue) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function parseFilters(rawFilters: Record<string, QueryValue>): TonightFilters {
  return tonightFiltersSchema.parse({
    sessionLength: getQueryValue(rawFilters.sessionLength),
    mood: getQueryValue(rawFilters.mood),
    playStyle: getQueryValue(rawFilters.playStyle),
  });
}

function isCompleted(entry: EntryRecord) {
  return entry.status === "COMPLETED";
}

function isHighlyRated(entry: EntryRecord) {
  return (
    typeof entry.userRating === "number" &&
    entry.userRating >= HIGHLY_RATED_THRESHOLD
  );
}

function buildTasteProfile(entries: EntryRecord[]): TasteProfile {
  const genreScores = new Map<string, number>();

  for (const entry of entries) {
    if (!isCompleted(entry) && !isHighlyRated(entry)) {
      continue;
    }

    for (const genre of entry.game.genres) {
      const currentScore = genreScores.get(genre) ?? 0;
      const completedBonus = isCompleted(entry) ? 3 : 0;
      const ratingBonus = isHighlyRated(entry) ? 4 : 0;

      genreScores.set(genre, currentScore + completedBonus + ratingBonus);
    }
  }

  const favoriteGenres = [...genreScores.entries()]
    .sort((left, right) => {
      if (right[1] !== left[1]) {
        return right[1] - left[1];
      }

      return left[0].localeCompare(right[0]);
    })
    .slice(0, TASTE_GENRE_LIMIT)
    .map(([genre]) => genre);

  return {
    favoriteGenres,
    genreScores,
  };
}

function serializeTrackedPool(entries: EntryRecord[]): PoolGame[] {
  return entries
    .filter((entry) => PLAYABLE_STATUSES.has(entry.status))
    .map((entry) => ({
      id: entry.game.id,
      title: entry.game.title,
      coverUrl: entry.game.coverUrl,
      releaseDate: entry.game.releaseDate?.toISOString() ?? null,
      genres: entry.game.genres,
      platforms: entry.game.platforms,
      rating: entry.game.rating,
      source: "TRACKED",
      status: entry.status,
      priority: entry.priority,
      userRating: entry.userRating,
      notes: entry.notes,
    }));
}

function serializeFallbackPool(games: CandidateGameRecord[]): PoolGame[] {
  return games.map((game) => ({
    id: game.id,
    title: game.title,
    coverUrl: game.coverUrl,
    releaseDate: game.releaseDate?.toISOString() ?? null,
    genres: game.genres,
    platforms: game.platforms,
    rating: game.rating,
    source: "DISCOVER",
    status: null,
    priority: null,
    userRating: null,
    notes: null,
  }));
}

function getGenreWeight(genres: string[], weights: Record<string, number>) {
  return genres.reduce((total, genre) => total + (weights[genre] ?? 0), 0);
}

function getNotesWeight(notes: string | null, filters: TonightFilters) {
  if (!notes) {
    return 0;
  }

  const normalizedNotes = notes.toLowerCase();
  let score = 0;

  if (filters.sessionLength === "short" && normalizedNotes.includes("short")) {
    score += 10;
  }

  if (
    filters.sessionLength === "long" &&
    (normalizedNotes.includes("long") || normalizedNotes.includes("weekend"))
  ) {
    score += 10;
  }

  if (filters.mood === "chill" && normalizedNotes.includes("relax")) {
    score += 8;
  }

  if (filters.mood === "focused" && normalizedNotes.includes("focus")) {
    score += 8;
  }

  if (
    filters.mood === "intense" &&
    (normalizedNotes.includes("combat") || normalizedNotes.includes("intense"))
  ) {
    score += 8;
  }

  if (filters.mood === "story" && normalizedNotes.includes("story")) {
    score += 8;
  }

  return score;
}

function getTasteWeight(genres: string[], tasteProfile: TasteProfile) {
  return genres.reduce(
    (total, genre) => total + (tasteProfile.genreScores.get(genre) ?? 0) * 6,
    0
  );
}

function getMultiplayerSignal(game: PoolGame) {
  const normalizedTitle = game.title.toLowerCase();

  const genreSignal = getGenreWeight(game.genres, MULTIPLAYER_GENRE_WEIGHTS);
  const titleSignal = MULTIPLAYER_TITLE_KEYWORDS.some((keyword) =>
    normalizedTitle.includes(keyword)
  )
    ? 18
    : 0;
  const noteSignal = game.notes?.toLowerCase().includes("co-op") ? 12 : 0;

  return genreSignal + titleSignal + noteSignal;
}

function buildSourceReason(game: PoolGame) {
  if (game.status === "PLAYING") {
    return {
      score: 24,
      text: "already in your current rotation",
    };
  }

  if (game.status === "BACKLOG" && typeof game.priority === "number") {
    return {
      score: 20 - Math.min(game.priority, 5),
      text: `priority #${game.priority} backlog pick`,
    };
  }

  if (game.status === "BACKLOG") {
    return {
      score: 12,
      text: "clean backlog option for tonight",
    };
  }

  if (game.status === "WISHLIST") {
    return {
      score: 4,
      text: "wishlist wildcard if you want something fresh",
    };
  }

  return {
    score: 2,
    text: "strong discovery fallback",
  };
}

function buildSessionReason(game: PoolGame, filters: TonightFilters) {
  const score =
    getGenreWeight(game.genres, SESSION_GENRE_WEIGHTS[filters.sessionLength]) +
    getNotesWeight(game.notes, filters);

  return {
    score,
    text: `fits a ${sessionLengthLabels[filters.sessionLength]}`,
  };
}

function buildMoodReason(game: PoolGame, filters: TonightFilters) {
  const score = getGenreWeight(game.genres, MOOD_GENRE_WEIGHTS[filters.mood]);

  return {
    score,
    text: `matches a ${moodLabels[filters.mood]}`,
  };
}

function buildPlayStyleReason(
  game: PoolGame,
  filters: TonightFilters,
  multiplayerSignal: number
) {
  if (filters.playStyle === "solo") {
    return {
      score: getGenreWeight(game.genres, SOLO_GENRE_WEIGHTS) + 6,
      text: "easy to settle into solo",
    };
  }

  return {
    score: multiplayerSignal,
    text:
      multiplayerSignal >= 12
        ? "best multiplayer-leaning fit we found"
        : "can still work if tonight turns social",
  };
}

function buildTasteReason(
  game: PoolGame,
  tasteProfile: TasteProfile
): ScoreReason {
  const matchingGenres = game.genres.filter((genre) =>
    tasteProfile.favoriteGenres.includes(genre)
  );
  const score = getTasteWeight(game.genres, tasteProfile);

  if (matchingGenres.length === 0) {
    return {
      score,
      text: "still aligns with your recent taste profile",
    };
  }

  return {
    score,
    text: `lines up with your ${matchingGenres.slice(0, 2).join(" and ")} taste`,
  };
}

function buildCriticReason(game: PoolGame) {
  const score =
    typeof game.rating === "number" ? Math.round(game.rating * 4) : 0;

  return {
    score,
    text:
      typeof game.rating === "number"
        ? `${game.rating.toFixed(1)} critic score helps close the case`
        : "worth a shot even without critic data",
  };
}

function capitalize(value: string) {
  if (value.length === 0) {
    return value;
  }

  return value[0].toUpperCase() + value.slice(1);
}

function buildReason(reasons: ScoreReason[]) {
  const positiveReasons = reasons
    .filter((reason) => reason.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 3)
    .map((reason) => reason.text);

  if (positiveReasons.length === 0) {
    return "A reasonable fit for tonight from the games we could score.";
  }

  return `${capitalize(positiveReasons.join(", "))}.`;
}

function scoreGame(
  game: PoolGame,
  filters: TonightFilters,
  tasteProfile: TasteProfile
): ScoredSuggestion {
  const multiplayerSignal = getMultiplayerSignal(game);
  const reasons = [
    buildSourceReason(game),
    buildSessionReason(game, filters),
    buildMoodReason(game, filters),
    buildPlayStyleReason(game, filters, multiplayerSignal),
    buildTasteReason(game, tasteProfile),
    buildCriticReason(game),
  ];
  const trackedBias = game.source === "TRACKED" ? 28 : 0;
  const userRatingBonus =
    typeof game.userRating === "number" ? game.userRating * 3 : 0;
  const score =
    trackedBias +
    userRatingBonus +
    reasons.reduce((total, reason) => total + reason.score, 0);

  return {
    id: game.id,
    title: game.title,
    coverUrl: game.coverUrl,
    releaseDate: game.releaseDate,
    genres: game.genres,
    platforms: game.platforms,
    rating: game.rating,
    reason: buildReason(reasons),
    sourceLabel:
      game.status === "PLAYING"
        ? "Playing now"
        : game.status === "BACKLOG"
          ? "Backlog"
          : game.status === "WISHLIST"
            ? "Wishlist"
            : "Discovery",
    status: game.status,
    score,
    multiplayerSignal,
  };
}

function sortSuggestions(left: ScoredSuggestion, right: ScoredSuggestion) {
  if (right.score !== left.score) {
    return right.score - left.score;
  }

  if ((right.rating ?? -1) !== (left.rating ?? -1)) {
    return (right.rating ?? -1) - (left.rating ?? -1);
  }

  return left.title.localeCompare(right.title);
}

function getMultiplayerNote(
  filters: TonightFilters,
  suggestions: ScoredSuggestion[]
) {
  if (filters.playStyle !== "multiplayer") {
    return null;
  }

  const strongestSignal = suggestions.reduce(
    (bestScore, suggestion) =>
      Math.max(bestScore, suggestion.multiplayerSignal),
    0
  );

  if (strongestSignal >= 12) {
    return null;
  }

  return "Multiplayer matching is still heuristic-based until GameFlow stores co-op metadata directly.";
}

export async function getTonightPageData(
  rawFilters: Record<string, QueryValue> = {}
): Promise<TonightPageData> {
  const filters = parseFilters(rawFilters);
  const user = await getCurrentUser();
  const [entries, fallbackGames] = await Promise.all([
    listUserBacklogEntries(user.id),
    listRecommendationCandidateGames(user.id),
  ]);

  const tasteProfile = buildTasteProfile(entries);
  const trackedPool = serializeTrackedPool(entries);
  const fallbackPool =
    trackedPool.length < TONIGHT_SUGGESTION_LIMIT
      ? serializeFallbackPool(fallbackGames)
      : [];
  const suggestionPool = [...trackedPool, ...fallbackPool];
  const scoredSuggestions = suggestionPool
    .map((game) => scoreGame(game, filters, tasteProfile))
    .sort(sortSuggestions);
  const topSuggestions = scoredSuggestions.slice(0, TONIGHT_SUGGESTION_LIMIT);

  const suggestions = topSuggestions.map((candidate) => {
    const { score, multiplayerSignal, ...suggestion } = candidate;
    void score;
    void multiplayerSignal;

    return suggestion;
  });

  return {
    playerName: user.name?.trim() || "Player One",
    filters,
    favoriteGenres: tasteProfile.favoriteGenres,
    trackedOptionsCount: entries.filter((entry) =>
      PLAYABLE_STATUSES.has(entry.status)
    ).length,
    suggestions,
    multiplayerNote: getMultiplayerNote(filters, topSuggestions),
  };
}
