import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Webhook signature invalide" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { lotId, userId, nbShares } = session.metadata!;

    const lot = await prisma.lot.findUnique({
      where: { id: lotId },
      include: { shares: { select: { nbShares: true } } },
    });
    if (!lot) return NextResponse.json({ ok: true });

    await prisma.lotShare.create({
      data: {
        lotId,
        userId,
        nbShares: Number(nbShares),
        paymentMethod: "STRIPE",
        paymentStatus: "PAID",
        stripePaymentIntentId: session.payment_intent as string,
      },
    });

    const taken = lot.shares.reduce((s: number, sh: { nbShares: number }) => s + sh.nbShares, 0) + Number(nbShares);
    if (taken >= lot.totalShares) {
      await prisma.lot.update({ where: { id: lotId }, data: { status: "FULL" } });
    }
  }

  return NextResponse.json({ ok: true });
}
