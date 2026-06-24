import { prisma } from "@/lib/prisma";

type NotifType = "LOT_JOINED" | "LOT_FULL" | "NEW_MESSAGE";

export async function createNotification(
  userId: string,
  type: NotifType,
  content: string,
  lotId?: string
) {
  return prisma.notification.create({
    data: { userId, type, content, lotId },
  });
}

export async function notifyLotParticipants(
  lotId: string,
  excludeUserId: string,
  type: NotifType,
  content: string
) {
  const lot = await prisma.lot.findUnique({
    where: { id: lotId },
    include: { shares: { select: { userId: true } } },
  });
  if (!lot) return;

  const userIds = [
    lot.creatorId,
    ...lot.shares.map((s) => s.userId),
  ].filter((id) => id !== excludeUserId);

  const unique = [...new Set(userIds)];
  if (unique.length === 0) return;

  await prisma.notification.createMany({
    data: unique.map((userId) => ({ userId, type, content, lotId })),
  });
}
