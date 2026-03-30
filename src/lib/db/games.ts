import type { Game, Prisma } from "@/lib/db/prisma-client";

import { prisma } from "@/lib/db";

export async function listGameRecords() {
  return prisma.game.findMany({
    orderBy: [{ title: "asc" }],
  });
}

export async function findGameRecordById(gameId: string) {
  return prisma.game.findUnique({
    where: {
      id: gameId,
    },
  });
}

export async function upsertGameRecord(
  data: Pick<
    Prisma.GameUncheckedCreateInput,
    | "externalId"
    | "title"
    | "slug"
    | "coverUrl"
    | "releaseDate"
    | "genres"
    | "platforms"
    | "rating"
  >
) {
  return prisma.game.upsert({
    where: {
      externalId: data.externalId,
    },
    update: {
      title: data.title,
      slug: data.slug,
      coverUrl: data.coverUrl,
      releaseDate: data.releaseDate,
      genres: data.genres,
      platforms: data.platforms,
      rating: data.rating,
    },
    create: data,
  });
}

export function serializeGameRecord(game: Game) {
  return {
    ...game,
    releaseDate: game.releaseDate?.toISOString() ?? null,
  };
}
