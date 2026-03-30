import { RecommendationsView } from "@/features/recommendations/recommendations-view";
import { analyticsEventNames } from "@/lib/analytics/events";
import { trackServerEvent } from "@/lib/analytics/server";
import { getRecommendationsPageData } from "@/services/recommendations/get-recommendations-page-data";

export default async function RecommendationsPage() {
  const data = await getRecommendationsPageData();

  await trackServerEvent(analyticsEventNames.recommendationsViewed, {
    recommendations_count: data.recommendations.length,
    completed_games_count: data.completedGamesCount,
    highly_rated_games_count: data.highlyRatedGamesCount,
    favorite_genres_count: data.favoriteGenres.length,
  });

  return <RecommendationsView data={data} />;
}
