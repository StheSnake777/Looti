import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, totalPrice, totalShares, meetingPoint, city, neighborhood, pickupDeadline, lat, lng } = body;

  if (!title || !totalPrice || !totalShares || !meetingPoint) {
    return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
  }

  const lot = await prisma.lot.create({
    data: {
      title,
      description,
      totalPrice,
      totalShares,
      pricePerShare: totalPrice / totalShares,
      meetingPoint,
      city,
      neighborhood,
      pickupDeadline: pickupDeadline ? new Date(pickupDeadline) : null,
      lat,
      lng,
      creatorId: session.user.id,
    },
  });

  return NextResponse.json({ id: lot.id }, { status: 201 });
}
