"use server";

import { revalidatePath } from "next/cache";

import { analyticsEventNames } from "@/lib/analytics/events";
import { trackServerEvent } from "@/lib/analytics/server";
import { addSearchGameToBacklogSchema } from "@/lib/validations/games";
import { addSearchGameToBacklog } from "@/services/backlog/add-search-game-to-backlog";

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

export async function addSearchGameToBacklogAction(input: unknown) {
  const parsed = addSearchGameToBacklogSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      inBacklog: false,
      message: parsed.error.issues[0]?.message ?? "Invalid game data.",
    };
  }

  try {
    const result = await addSearchGameToBacklog(parsed.data);

    if (result.ok) {
      await trackServerEvent(analyticsEventNames.backlogGameAdded, {
        source: "discover",
        source_kind: "search_result",
      });
      revalidateGameFlowPaths();
    }

    if (result.ok) {
      return {
        ok: true,
        inBacklog: true,
        message: "Added to your backlog.",
      };
    }

    return {
      ok: false,
      inBacklog: result.message === "That game is already in your backlog.",
      message: result.message,
    };
  } catch {
    return {
      ok: false,
      inBacklog: false,
      message: "We couldn't save that game right now. Please try again.",
    };
  }
}
