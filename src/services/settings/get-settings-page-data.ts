import { getCurrentUser } from "@/services/auth/get-current-user";
import type { SettingsPageData } from "@/services/settings/types";

export async function getSettingsPageData(): Promise<SettingsPageData> {
  const user = await getCurrentUser();

  return {
    email: user.email,
    displayName: user.name?.trim() || null,
    createdAt: user.createdAt.toISOString(),
    emailVerifiedAt: user.emailVerified?.toISOString() ?? null,
  };
}
