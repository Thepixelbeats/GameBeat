import { BacklogScreen } from "@/features/backlog/backlog-screen";
import { getBacklogPageData } from "@/services/backlog/get-backlog-page-data";

export default async function BacklogPage() {
  const data = await getBacklogPageData();

  return <BacklogScreen data={data} />;
}
