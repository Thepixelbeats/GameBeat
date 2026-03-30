import { StatsView } from "@/features/stats/stats-view";
import { getStatsPageData } from "@/services/stats/get-stats-page-data";

export default async function StatsPage() {
  const data = await getStatsPageData();

  return <StatsView data={data} />;
}
