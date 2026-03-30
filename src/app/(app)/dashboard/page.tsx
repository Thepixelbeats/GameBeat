import { DashboardView } from "@/features/dashboard/dashboard-view";
import { getDashboardPageData } from "@/services/dashboard/get-dashboard-page-data";

export default async function DashboardPage() {
  const data = await getDashboardPageData();

  return <DashboardView data={data} />;
}
