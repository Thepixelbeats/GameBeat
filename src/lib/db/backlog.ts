import type { GameStatus, Prisma } from "@/lib/db/prisma-client";

import { prisma } from "@/lib/db";

export async function listUserBacklogEntries(userId: string) {
  return prisma.userGameEntry.findMany({
    where: {
      userId,
    },
    include: {
      game: true,
    },
    orderBy: [{ addedAt: "desc" }],
  });
}

export async function createUserBacklogEntry(
  data: Prisma.UserGameEntryUncheckedCreateInput
) {
  return prisma.userGameEntry.create({
    data,
    include: {
      game: true,
    },
  });
}

export async function updateUserBacklogEntry(
  entryId: string,
  userId: string,
  data: Prisma.UserGameEntryUncheckedUpdateInput
) {
  const existingEntry = await prisma.userGameEntry.findFirst({
    where: {
      id: entryId,
      userId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!existingEntry) {
    throw new Error("Backlog entry not found.");
  }

  const entry = await prisma.userGameEntry.update({
    where: {
      id: existingEntry.id,
    },
    data,
    include: {
      game: true,
    },
  });

  return {
    previousStatus: existingEntry.status,
    entry,
  };
}

export async function deleteUserBacklogEntry(entryId: string, userId: string) {
  const existingEntry = await prisma.userGameEntry.findFirst({
    where: {
      id: entryId,
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!existingEntry) {
    throw new Error("Backlog entry not found.");
  }

  return prisma.userGameEntry.delete({
    where: {
      id: existingEntry.id,
    },
  });
}

export async function countUserEntriesForGame(userId: string, gameId: string) {
  return prisma.userGameEntry.count({
    where: {
      userId,
      gameId,
    },
  });
}

export async function listUserBacklogCountsByStatus(userId: string) {
  const grouped = await prisma.userGameEntry.groupBy({
    by: ["status"],
    where: {
      userId,
    },
    _count: {
      _all: true,
    },
  });

  return grouped.reduce<Record<GameStatus, number>>(
    (accumulator, item) => {
      accumulator[item.status] = item._count._all;
      return accumulator;
    },
    {
      BACKLOG: 0,
      PLAYING: 0,
      COMPLETED: 0,
      DROPPED: 0,
      WISHLIST: 0,
    }
  );
}
