import {
  listRecommendationCandidateGames,
  listRecommendationSignalEntries,
} from "@/lib/db/recommendations";
import { getCurrentUser } from "@/services/auth/get-current-user";
import type {
  Recommendation,
  RecommendationGame,
  RecommendationsPageData,
} from "@/services/recommendations/types";

const HIGHLY_RATED_THRESHOLD = 8;
const COMPLETED_GENRE_WEIGHT = 3;
const HIGHLY_RATED_GENRE_WEIGHT = 4;
const TOP_RECOMMENDATION_LIMIT = 10;
const FAVORITE_GENRE_LIMIT = 5;

const listFormatter = new Intl.ListFormat("en", {
  style: "long",
  type: "conjunction",
});

type RecommendationSignalEntry = Awaited<
  ReturnType<typeof listRecommendationSignalEntries>
>[number];

type RecommendationCandidateGame = Awaited<
  ReturnType<typeof listRecommendationCandidateGames>
>[number];

type ScoredRecommendation = Recommendation & { score: number };

type GenrePreference = {
  genre: string;
  score: number;
  completedMatches: number;
  highlyRatedMatches: number;
  sourceTitles: string[];
};

function isCompleted(entry: RecommendationSignalEntry) {
  return entry.status === "COMPLETED";
}

function isHighlyRated(entry: RecommendationSignalEntry) {
  return (
    typeof entry.userRating === "number" &&
    entry.userRating >= HIGHLY_RATED_THRESHOLD
  );
}

function dedupeStrings(values: string[]) {
  return [...new Set(values)];
}

function sortGenrePreferences(left: GenrePreference, right: GenrePreference) {
  if (right.score !== left.score) {
    return right.score - left.score;
  }

  if (right.highlyRatedMatches !== left.highlyRatedMatches) {
    return right.highlyRatedMatches - left.highlyRatedMatches;
  }

  if (right.completedMatches !== left.completedMatches) {
    return right.completedMatches - left.completedMatches;
  }

  return left.genre.localeCompare(right.genre);
}

function buildGenrePreferences(entries: RecommendationSignalEntry[]) {
  const preferences = new Map<
    string,
    Omit<GenrePreference, "sourceTitles"> & { sourceTitles: Set<string> }
  >();

  for (const entry of entries) {
    const completed = isCompleted(entry);
    const highlyRated = isHighlyRated(entry);

    if (!completed && !highlyRated) {
      continue;
    }

    for (const genre of entry.game.genres) {
      const existingPreference = preferences.get(genre) ?? {
        genre,
        score: 0,
        completedMatches: 0,
        highlyRatedMatches: 0,
        sourceTitles: new Set<string>(),
      };

      if (completed) {
        existingPreference.score += COMPLETED_GENRE_WEIGHT;
        existingPreference.completedMatches += 1;
      }

      if (highlyRated) {
        existingPreference.score += HIGHLY_RATED_GENRE_WEIGHT;
        existingPreference.highlyRatedMatches += 1;
      }

      existingPreference.sourceTitles.add(entry.game.title);
      preferences.set(genre, existingPreference);
    }
  }

  return [...preferences.values()]
    .map((preference) => ({
      ...preference,
      sourceTitles: [...preference.sourceTitles].sort((left, right) =>
        left.localeCompare(right)
      ),
    }))
    .sort(sortGenrePreferences);
}

function serializeRecommendationGame(
  game: RecommendationCandidateGame
): RecommendationGame {
  return {
    id: game.id,
    externalId: game.externalId,
    title: game.title,
    slug: game.slug,
    coverUrl: game.coverUrl,
    releaseDate: game.releaseDate?.toISOString() ?? null,
    genres: game.genres,
    platforms: game.platforms,
    rating: game.rating,
  };
}

function buildRecommendationScore(
  rating: number | null,
  matchedPreferences: GenrePreference[]
) {
  const genreScore = matchedPreferences.reduce(
    (total, preference) => total + preference.score,
    0
  );
  const completedOverlapScore = matchedPreferences.reduce(
    (total, preference) => total + preference.completedMatches * 6,
    0
  );
  const highlyRatedOverlapScore = matchedPreferences.reduce(
    (total, preference) => total + preference.highlyRatedMatches * 8,
    0
  );
  const criticScore = typeof rating === "number" ? Math.round(rating * 10) : 0;

  return (
    genreScore * 20 +
    matchedPreferences.length * 14 +
    completedOverlapScore +
    highlyRatedOverlapScore +
    criticScore
  );
}

function buildExplanation(
  matchedPreferences: GenrePreference[],
  rating: number | null
) {
  if (matchedPreferences.length === 0) {
    if (typeof rating === "number") {
      return `Strong fallback pick on critic score alone at ${rating.toFixed(1)}.`;
    }

    return "Catalog fallback while your taste profile grows.";
  }

  const genreText = listFormatter.format(
    matchedPreferences.slice(0, 2).map((preference) => preference.genre)
  );
  const sourceTitles = dedupeStrings(
    matchedPreferences.flatMap((preference) => preference.sourceTitles)
  ).slice(0, 2);
  const sourceText =
    sourceTitles.length > 0
      ? ` like ${listFormatter.format(sourceTitles)}`
      : "";
  const ratingText =
    typeof rating === "number"
      ? ` plus a ${rating.toFixed(1)} critic score`
      : "";

  return `Lines up with your ${genreText} favorites${sourceText}${ratingText}.`;
}

function sortRecommendations(
  left: ScoredRecommendation,
  right: ScoredRecommendation
) {
  if (right.score !== left.score) {
    return right.score - left.score;
  }

  if ((right.rating ?? -1) !== (left.rating ?? -1)) {
    return (right.rating ?? -1) - (left.rating ?? -1);
  }

  return left.title.localeCompare(right.title);
}

export async function getRecommendationsPageData(): Promise<RecommendationsPageData> {
  const user = await getCurrentUser();
  const [signalEntries, candidateGames] = await Promise.all([
    listRecommendationSignalEntries(user.id),
    listRecommendationCandidateGames(user.id),
  ]);

  const genrePreferences = buildGenrePreferences(signalEntries);
  const recommendations: Recommendation[] = candidateGames
    .map((game) => {
      const serializedGame = serializeRecommendationGame(game);
      const matchedPreferences = genrePreferences.filter((preference) =>
        serializedGame.genres.includes(preference.genre)
      );

      return {
        ...serializedGame,
        explanation: buildExplanation(
          matchedPreferences,
          serializedGame.rating
        ),
        matchedGenres: matchedPreferences
          .map((preference) => preference.genre)
          .slice(0, 3),
        score: buildRecommendationScore(
          serializedGame.rating,
          matchedPreferences
        ),
      };
    })
    .sort(sortRecommendations)
    .slice(0, TOP_RECOMMENDATION_LIMIT)
    .map((candidate): Recommendation => {
      const { score, ...recommendation } = candidate;
      void score;

      return recommendation;
    });

  return {
    playerName: user.name?.trim() || "Player One",
    completedGamesCount: signalEntries.filter(isCompleted).length,
    highlyRatedGamesCount: signalEntries.filter(isHighlyRated).length,
    favoriteGenres: genrePreferences
      .slice(0, FAVORITE_GENRE_LIMIT)
      .map((preference) => preference.genre),
    recommendations,
  };
}
