import { prisma } from "@/lib/db";

export async function findUserById(userId: string) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
}

export async function updateUserName(userId: string, name: string | null) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name,
    },
  });
}
