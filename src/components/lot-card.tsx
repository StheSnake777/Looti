import Link from "next/link";
import Image from "next/image";
import { MapPin, Users } from "lucide-react";
import { formatPrice, sharesLeft } from "@/lib/utils";
import { LotStatus } from "@/generated/prisma/enums";

type LotCardProps = {
  lot: {
    id: string;
    title: string;
    photo: string | null;
    pricePerShare: number;
    totalShares: number;
    status: LotStatus;
    city: string | null;
    neighborhood: string | null;
    creator: { name: string; avatar: string | null };
  };
  takenShares: number;
};

export function LotCard({ lot, takenShares }: LotCardProps) {
  const left = sharesLeft(lot.totalShares, takenShares);
  const progressPct = (takenShares / lot.totalShares) * 100;

  return (
    <Link
      href={`/lots/${lot.id}`}
      className="group flex flex-col bg-white rounded-2xl border border-zinc-100 hover:border-zinc-200 hover:shadow-md transition-all overflow-hidden"
    >
      <div className="relative h-44 bg-zinc-100">
        {lot.photo ? (
          <Image src={lot.photo} alt={lot.title} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl">🛍️</div>
        )}
        <div className="absolute top-2 right-2 bg-white text-amber-600 font-bold text-sm px-2.5 py-1 rounded-full shadow-sm">
          {formatPrice(lot.pricePerShare)} / part
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-zinc-900 group-hover:text-amber-600 transition-colors line-clamp-1">
            {lot.title}
          </h3>
          {(lot.city || lot.neighborhood) && (
            <div className="flex items-center gap-1 text-xs text-zinc-400">
              <MapPin size={12} />
              {lot.neighborhood ?? lot.city}
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="flex flex-col gap-1.5">
          <div className="h-1.5 rounded-full bg-zinc-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-amber-400 transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center gap-1">
              <Users size={11} />
              {takenShares}/{lot.totalShares} parts prises
            </div>
            <span className={left === 0 ? "text-red-400" : "text-emerald-500 font-medium"}>
              {left === 0 ? "Complet" : `${left} dispo`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1 border-t border-zinc-50">
          {lot.creator.avatar ? (
            <Image
              src={lot.creator.avatar}
              alt={lot.creator.name}
              width={20}
              height={20}
              className="rounded-full"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-xs font-medium text-amber-600">
              {lot.creator.name[0]}
            </div>
          )}
          <span className="text-xs text-zinc-400">{lot.creator.name}</span>
        </div>
      </div>
    </Link>
  );
}
