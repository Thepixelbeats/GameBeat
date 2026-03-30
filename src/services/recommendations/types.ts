export type RecommendationGame = {
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

export type Recommendation = RecommendationGame & {
  explanation: string;
  matchedGenres: string[];
};

export type RecommendationsPageData = {
  playerName: string;
  completedGamesCount: number;
  highlyRatedGamesCount: number;
  favoriteGenres: string[];
  recommendations: Recommendation[];
};
