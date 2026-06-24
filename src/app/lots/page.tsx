import { prisma } from "@/lib/prisma";
import { LotCard } from "@/components/lot-card";
import { SearchBar } from "@/components/search-bar";

export default async function LotsPage({
  searchParams,
}: {
  searchParams: Promise<{ ville?: string; q?: string }>;
}) {
  const { ville, q } = await searchParams;

  const lots = await prisma.lot.findMany({
    where: {
      status: "OPEN",
      ...(ville && { city: { contains: ville, mode: "insensitive" } }),
      ...(q && { title: { contains: q, mode: "insensitive" } }),
    },
    include: {
      creator: { select: { id: true, name: true, avatar: true } },
      shares: { select: { nbShares: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Lots disponibles</h1>
          <p className="text-zinc-500 text-sm">
            {lots.length} lot{lots.length > 1 ? "s" : ""} ouvert{lots.length > 1 ? "s" : ""} près de toi
          </p>
        </div>

        <SearchBar defaultVille={ville} defaultQ={q} />

        {lots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <p className="text-zinc-400 text-lg">Aucun lot pour le moment</p>
            <p className="text-zinc-400 text-sm">Sois le premier à en poster un !</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lots.map((lot) => {
              const takenShares = lot.shares.reduce((sum: number, s: { nbShares: number }) => sum + s.nbShares, 0);
              return (
                <LotCard
                  key={lot.id}
                  lot={lot}
                  takenShares={takenShares}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
