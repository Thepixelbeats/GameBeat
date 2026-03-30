import { updateUserName } from "@/lib/db/users";
import { updateSettingsProfileSchema } from "@/lib/validations/settings";
import { getCurrentUser } from "@/services/auth/get-current-user";

type UpdateSettingsProfileResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      message: string;
    };

function getStringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

export async function updateSettingsProfile(
  input: FormData
): Promise<UpdateSettingsProfileResult> {
  const parsed = updateSettingsProfileSchema.safeParse({
    displayName: getStringValue(input.get("displayName")),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message:
        parsed.error.issues[0]?.message ??
        "Enter a display name between 2 and 40 characters, or leave it blank.",
    };
  }

  const user = await getCurrentUser();

  await updateUserName(user.id, parsed.data.displayName);

  return {
    ok: true,
  };
}
