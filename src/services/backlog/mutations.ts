import { Prisma } from "@/lib/db/prisma-client";

import { analyticsEventNames } from "@/lib/analytics/events";
import { trackServerEvent } from "@/lib/analytics/server";
import {
  countUserEntriesForGame,
  createUserBacklogEntry,
  deleteUserBacklogEntry,
  updateUserBacklogEntry,
} from "@/lib/db/backlog";
import { findGameRecordById } from "@/lib/db/games";
import {
  addBacklogEntrySchema,
  removeBacklogEntrySchema,
  updateBacklogEntrySchema,
} from "@/lib/validations/backlog";
import { getCurrentUser } from "@/services/auth/get-current-user";

type MutationResult =
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

function isUniqueConstraintError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

export async function addBacklogEntry(
  input: FormData
): Promise<MutationResult> {
  const parsed = addBacklogEntrySchema.safeParse({
    gameId: getStringValue(input.get("gameId")),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Choose a game record before adding it to your backlog.",
    };
  }

  const user = await getCurrentUser();
  const game = await findGameRecordById(parsed.data.gameId);

  if (!game) {
    return {
      ok: false,
      message: "That game record no longer exists.",
    };
  }

  const existingCount = await countUserEntriesForGame(user.id, game.id);

  if (existingCount > 0) {
    return {
      ok: false,
      message: "That game is already in your backlog.",
    };
  }

  try {
    await createUserBacklogEntry({
      userId: user.id,
      gameId: game.id,
    });

    await trackServerEvent(analyticsEventNames.backlogGameAdded, {
      source: "backlog",
      source_kind: "database_record",
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        ok: false,
        message: "That game is already in your backlog.",
      };
    }

    throw error;
  }

  return {
    ok: true,
  };
}

export async function updateBacklogEntry(
  input: FormData
): Promise<MutationResult> {
  const parsed = updateBacklogEntrySchema.safeParse({
    entryId: getStringValue(input.get("entryId")),
    status: getStringValue(input.get("status")),
    userRating: getStringValue(input.get("userRating")),
    notes: getStringValue(input.get("notes")),
    priority: getStringValue(input.get("priority")),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message:
        "Update failed. Check status, rating, notes, and priority values.",
    };
  }

  const user = await getCurrentUser();

  try {
    const result = await updateUserBacklogEntry(parsed.data.entryId, user.id, {
      status: parsed.data.status,
      userRating: parsed.data.userRating ?? null,
      notes: parsed.data.notes ?? null,
      priority: parsed.data.priority ?? null,
    });

    if (result.previousStatus !== result.entry.status) {
      await trackServerEvent(analyticsEventNames.backlogStatusUpdated, {
        from_status: result.previousStatus,
        to_status: result.entry.status,
        source: "backlog",
      });
    }
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Backlog entry not found."
    ) {
      return {
        ok: false,
        message: "That backlog entry no longer exists. Refresh and try again.",
      };
    }

    throw error;
  }

  return {
    ok: true,
  };
}

export async function removeBacklogEntry(
  input: FormData
): Promise<MutationResult> {
  const parsed = removeBacklogEntrySchema.safeParse({
    entryId: getStringValue(input.get("entryId")),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Remove failed. Refresh and try again.",
    };
  }

  const user = await getCurrentUser();

  try {
    await deleteUserBacklogEntry(parsed.data.entryId, user.id);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Backlog entry not found."
    ) {
      return {
        ok: false,
        message: "That backlog entry was already removed.",
      };
    }

    throw error;
  }

  return {
    ok: true,
  };
}
