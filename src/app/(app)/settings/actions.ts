"use server";

import { revalidatePath } from "next/cache";

import {
  initialSettingsActionState,
  type SettingsActionState,
} from "@/features/settings/action-state";
import { updateSettingsProfile } from "@/services/settings/update-settings-profile";

export async function updateSettingsProfileAction(
  previousState: SettingsActionState = initialSettingsActionState,
  formData: FormData
): Promise<SettingsActionState> {
  void previousState;

  try {
    const result = await updateSettingsProfile(formData);

    if (!result.ok) {
      return {
        status: "error",
        message: result.message,
      };
    }

    revalidatePath("/settings");

    return {
      status: "success",
      message: "Display name updated.",
    };
  } catch {
    return {
      status: "error",
      message: "We couldn't save your settings right now. Please try again.",
    };
  }
}
