import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: lotId } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { content } = await req.json();
  if (!content?.trim()) return NextResponse.json({ error: "Message vide" }, { status: 400 });

  const message = await prisma.message.create({
    data: { lotId, senderId: session.user.id, content: content.trim() },
    include: { sender: { select: { id: true, name: true, avatar: true } } },
  });

  return NextResponse.json({
    ...message,
    createdAt: message.createdAt.toISOString(),
  });
}
