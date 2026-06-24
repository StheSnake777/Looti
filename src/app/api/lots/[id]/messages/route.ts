import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notifyLotParticipants } from "@/lib/notifications";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: lotId } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { content } = await req.json();
  if (!content?.trim()) return NextResponse.json({ error: "Message vide" }, { status: 400 });

  const message = await prisma.message.create({
    data: { lotId, senderId: session.user.id, content: content.trim() },
    include: { sender: { select: { id: true, name: true, avatar: true } } },
  });

  const lot = await prisma.lot.findUnique({ where: { id: lotId }, select: { title: true } });
  await notifyLotParticipants(
    lotId,
    session.user.id,
    "NEW_MESSAGE",
    `${message.sender.name} : "${content.trim().slice(0, 60)}${content.length > 60 ? "…" : ""}" — lot "${lot?.title}"`
  );

  return NextResponse.json({ ...message, createdAt: message.createdAt.toISOString() });
}
