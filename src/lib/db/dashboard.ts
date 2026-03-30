import { prisma } from "@/lib/db";

export async function countTrackedGamesForUser(userId: string) {
  return prisma.userGameEntry.count({
    where: {
      userId,
    },
  });
}

export async function countCompletedGamesForUser(userId: string) {
  return prisma.userGameEntry.count({
    where: {
      userId,
      status: "COMPLETED",
    },
  });
}

export async function getAverageUserRatingForUser(userId: string) {
  const result = await prisma.userGameEntry.aggregate({
    where: {
      userId,
      userRating: {
        not: null,
      },
    },
    _avg: {
      userRating: true,
    },
  });

  return result._avg.userRating;
}

export async function listRecentlyAddedEntriesForUser(
  userId: string,
  limit = 4
) {
  return prisma.userGameEntry.findMany({
    where: {
      userId,
    },
    include: {
      game: true,
    },
    orderBy: [{ addedAt: "desc" }],
    take: limit,
  });
}
