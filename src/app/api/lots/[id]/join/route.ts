import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: lotId } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { nbShares } = await req.json();

  const lot = await prisma.lot.findUnique({
    where: { id: lotId },
    include: { shares: { select: { nbShares: true } } },
  });

  if (!lot) return NextResponse.json({ error: "Lot introuvable" }, { status: 404 });
  if (lot.status !== "OPEN") return NextResponse.json({ error: "Lot non disponible" }, { status: 400 });
  if (lot.creatorId === session.user.id) {
    return NextResponse.json({ error: "Tu es le créateur de ce lot" }, { status: 400 });
  }

  const taken = lot.shares.reduce((s: number, sh: { nbShares: number }) => s + sh.nbShares, 0);
  if (taken + nbShares > lot.totalShares) {
    return NextResponse.json({ error: "Pas assez de parts disponibles" }, { status: 400 });
  }

  const share = await prisma.lotShare.create({
    data: { lotId, userId: session.user.id, nbShares, paymentMethod: "CASH", paymentStatus: "PENDING" },
  });

  if (taken + nbShares >= lot.totalShares) {
    await prisma.lot.update({ where: { id: lotId }, data: { status: "FULL" } });
  }

  return NextResponse.json(share, { status: 201 });
}
