import { SettingsView } from "@/features/settings/settings-view";
import { getSettingsPageData } from "@/services/settings/get-settings-page-data";

export default async function SettingsPage() {
  const data = await getSettingsPageData();

  return <SettingsView data={data} />;
}
