import { prisma } from "@/lib/db";

export async function listStatsEntriesForUser(userId: string) {
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
