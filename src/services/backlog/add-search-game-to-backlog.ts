import { Prisma } from "@/lib/db/prisma-client";

import {
  countUserEntriesForGame,
  createUserBacklogEntry,
} from "@/lib/db/backlog";
import { upsertGameRecord } from "@/lib/db/games";
import type { AddSearchGameToBacklogInput } from "@/lib/validations/games";
import { getCurrentUser } from "@/services/auth/get-current-user";

type MutationResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      message: string;
    };

function isUniqueConstraintError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

export async function addSearchGameToBacklog(
  input: AddSearchGameToBacklogInput
): Promise<MutationResult> {
  const user = await getCurrentUser();
  const game = await upsertGameRecord({
    externalId: input.externalId,
    title: input.title,
    slug: createGameSlug(input.title),
    coverUrl: input.coverUrl ?? null,
    releaseDate: input.releaseDate ? new Date(input.releaseDate) : null,
    genres: input.genres,
    platforms: [],
    rating: null,
  });

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

function createGameSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
