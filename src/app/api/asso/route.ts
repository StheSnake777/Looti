import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("ville");

  const assos = await prisma.association.findMany({
    where: city ? { city: { contains: city, mode: "insensitive" } } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(assos);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, city, neighborhood, description, needs, contact, website } = body;

  if (!name || !city) {
    return NextResponse.json({ error: "Nom et ville obligatoires" }, { status: 400 });
  }

  const asso = await prisma.association.create({
    data: { name, city, neighborhood, description, needs, contact, website },
  });

  return NextResponse.json(asso, { status: 201 });
}
