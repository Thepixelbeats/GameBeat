"use server";

import { revalidatePath } from "next/cache";

import {
  initialBacklogActionState,
  type BacklogActionState,
} from "@/features/backlog/action-state";
import {
  addBacklogEntry,
  removeBacklogEntry,
  updateBacklogEntry,
} from "@/services/backlog/mutations";

const revalidatedPaths = [
  "/backlog",
  "/dashboard",
  "/tonight",
  "/stats",
  "/recommendations",
] as const;

function revalidateGameFlowPaths() {
  for (const path of revalidatedPaths) {
    revalidatePath(path);
  }
}

async function resolveActionState(
  mutation: () => Promise<{ ok: boolean; message?: string }>,
  successMessage: string
): Promise<BacklogActionState> {
  try {
    const result = await mutation();

    if (!result.ok) {
      return {
        status: "error",
        message: result.message ?? "Something went wrong.",
      };
    }

    revalidateGameFlowPaths();

    return {
      status: "success",
      message: successMessage,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error && error.message
          ? error.message
          : "Something went wrong. Please try again.",
    };
  }
}

export async function addBacklogEntryAction(
  previousState: BacklogActionState = initialBacklogActionState,
  formData: FormData
) {
  void previousState;

  return resolveActionState(
    () => addBacklogEntry(formData),
    "Game added to your backlog."
  );
}

export async function updateBacklogEntryAction(
  previousState: BacklogActionState = initialBacklogActionState,
  formData: FormData
) {
  void previousState;

  return resolveActionState(
    () => updateBacklogEntry(formData),
    "Backlog entry updated."
  );
}

export async function removeBacklogEntryAction(
  previousState: BacklogActionState = initialBacklogActionState,
  formData: FormData
) {
  void previousState;

  return resolveActionState(
    () => removeBacklogEntry(formData),
    "Game removed from your backlog."
  );
}
