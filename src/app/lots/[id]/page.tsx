import { notFound } from "next/navigation";
import Image from "next/image";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate, sharesLeft } from "@/lib/utils";
import { MapPin, Clock, Users } from "lucide-react";
import { JoinLotButton } from "@/components/join-lot-button";
import { LotChat } from "@/components/lot-chat";

export default async function LotPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  const lot = await prisma.lot.findUnique({
    where: { id },
    include: {
      creator: { select: { id: true, name: true, avatar: true } },
      shares: {
        include: { user: { select: { id: true, name: true, avatar: true } } },
      },
      messages: {
        include: { sender: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!lot) notFound();

  const takenShares = lot.shares.reduce((sum: number, s) => sum + s.nbShares, 0);
  const left = sharesLeft(lot.totalShares, takenShares);
  const progressPct = (takenShares / lot.totalShares) * 100;

  const userId = session?.user?.id ?? null;
  const myShare = userId ? lot.shares.find((s) => s.userId === userId) : null;
  const isCreator = userId === lot.creatorId;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Main */}
      <div className="lg:col-span-3 flex flex-col gap-6">
        {/* Photo */}
        <div className="relative h-64 rounded-2xl overflow-hidden bg-zinc-100">
          {lot.photo ? (
            <Image src={lot.photo} alt={lot.title} fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-6xl">🛍️</div>
          )}
        </div>

        {/* Header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold">{lot.title}</h1>
            <span
              className={`text-sm font-medium px-3 py-1 rounded-full flex-shrink-0 ${
                lot.status === "OPEN"
                  ? "bg-emerald-50 text-emerald-600"
                  : lot.status === "FULL"
                  ? "bg-amber-50 text-amber-600"
                  : "bg-zinc-100 text-zinc-500"
              }`}
            >
              {lot.status === "OPEN" ? "Ouvert" : lot.status === "FULL" ? "Complet" : "Terminé"}
            </span>
          </div>

          {lot.description && (
            <p className="text-zinc-500 text-sm leading-relaxed">{lot.description}</p>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
            {(lot.city || lot.neighborhood) && (
              <div className="flex items-center gap-1.5">
                <MapPin size={14} />
                {lot.neighborhood ?? lot.city}
              </div>
            )}
            {lot.pickupDeadline && (
              <div className="flex items-center gap-1.5">
                <Clock size={14} />
                Avant le {formatDate(lot.pickupDeadline)}
              </div>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Users size={15} className="text-zinc-400" />
              {takenShares}/{lot.totalShares} parts prises
            </div>
            <span className="text-sm font-medium text-amber-600">
              {left > 0 ? `${left} disponible${left > 1 ? "s" : ""}` : "Complet"}
            </span>
          </div>
          <div className="h-2 rounded-full bg-zinc-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-amber-400 transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {lot.shares.map((share) => (
              <div
                key={share.id}
                className="flex items-center gap-1.5 bg-zinc-50 rounded-full px-3 py-1.5 text-xs"
              >
                {share.user.avatar ? (
                  <Image
                    src={share.user.avatar}
                    alt={share.user.name}
                    width={16}
                    height={16}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-amber-200 flex items-center justify-center text-xs font-medium text-amber-700">
                    {share.user.name[0]}
                  </div>
                )}
                {share.user.name} × {share.nbShares}
              </div>
            ))}
          </div>
        </div>

        {/* Chat */}
        <LotChat
          lotId={lot.id}
          messages={lot.messages.map((m) => ({
            id: m.id,
            content: m.content,
            createdAt: m.createdAt.toISOString(),
            sender: m.sender,
          }))}
          currentUserId={userId}
        />
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        <div className="bg-white border border-zinc-100 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-3xl font-bold text-amber-500">{formatPrice(lot.pricePerShare)}</p>
            <p className="text-sm text-zinc-400">par part · total {formatPrice(lot.totalPrice)}</p>
          </div>

          <div className="text-sm text-zinc-600 bg-zinc-50 rounded-xl px-4 py-3">
            <strong>Point de rencontre :</strong> {lot.meetingPoint}
          </div>

          <JoinLotButton
            lotId={lot.id}
            left={left}
            isAuthenticated={!!userId}
            isCreator={isCreator}
            myShare={myShare ? { nbShares: myShare.nbShares, paymentMethod: myShare.paymentMethod } : null}
            pricePerShare={lot.pricePerShare}
          />
        </div>

        <div className="bg-white border border-zinc-100 rounded-2xl p-5 flex items-center gap-3">
          {lot.creator.avatar ? (
            <Image
              src={lot.creator.avatar}
              alt={lot.creator.name}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center font-semibold text-amber-600">
              {lot.creator.name[0]}
            </div>
          )}
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium">{lot.creator.name}</p>
            <p className="text-xs text-zinc-400">Posté le {formatDate(lot.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
