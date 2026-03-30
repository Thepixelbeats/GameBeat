import { prisma } from "@/lib/db";

export async function listRecommendationSignalEntries(userId: string) {
  return prisma.userGameEntry.findMany({
    where: {
      userId,
    },
    include: {
      game: true,
    },
  });
}

export async function listRecommendationCandidateGames(userId: string) {
  return prisma.game.findMany({
    where: {
      userEntries: {
        none: {
          userId,
        },
      },
    },
    orderBy: [{ title: "asc" }],
  });
}
