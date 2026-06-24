import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

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

  const taken = lot.shares.reduce((s: number, sh: { nbShares: number }) => s + sh.nbShares, 0);
  if (taken + nbShares > lot.totalShares) {
    return NextResponse.json({ error: "Pas assez de parts disponibles" }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  const stripeSession = await getStripe().checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: { name: `${lot.title} — ${nbShares} part${nbShares > 1 ? "s" : ""}` },
          unit_amount: Math.round(lot.pricePerShare * 100),
        },
        quantity: nbShares,
      },
    ],
    mode: "payment",
    success_url: `${appUrl}/lots/${lotId}?payment=success`,
    cancel_url: `${appUrl}/lots/${lotId}?payment=cancel`,
    metadata: { lotId, userId: session.user.id, nbShares: String(nbShares) },
  });

  return NextResponse.json({ url: stripeSession.url });
}
