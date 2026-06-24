import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { LotCard } from "@/components/lot-card";

export default async function MesLotsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/connexion");

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      lots: {
        include: {
          creator: { select: { id: true, name: true, avatar: true } },
          shares: { select: { nbShares: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      shares: {
        include: {
          lot: {
            include: {
              creator: { select: { id: true, name: true, avatar: true } },
              shares: { select: { nbShares: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!dbUser) redirect("/auth/connexion");

  const joinedLots = dbUser.shares.map((s) => s.lot);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-bold">Mes lots postés ({dbUser.lots.length})</h2>
        {dbUser.lots.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-zinc-400 text-sm">Tu n&apos;as pas encore posté de lot.</p>
            <Link
              href="/lots/nouveau"
              className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
            >
              Poster un lot
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dbUser.lots.map((lot) => {
              const takenShares = lot.shares.reduce((sum: number, s: { nbShares: number }) => sum + s.nbShares, 0);
              return <LotCard key={lot.id} lot={lot} takenShares={takenShares} />;
            })}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-bold">Lots rejoints ({joinedLots.length})</h2>
        {joinedLots.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-zinc-400 text-sm">Tu n&apos;as pas encore rejoint de lot.</p>
            <Link
              href="/lots"
              className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
            >
              Explorer les lots
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {joinedLots.map((lot) => {
              const takenShares = lot.shares.reduce((sum: number, s: { nbShares: number }) => sum + s.nbShares, 0);
              return <LotCard key={lot.id} lot={lot} takenShares={takenShares} />;
            })}
          </div>
        )}
      </section>
    </div>
  );
}
