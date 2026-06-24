import { prisma } from "@/lib/prisma";
import { MapPin, Phone, Globe, Heart } from "lucide-react";
import { AssoForm } from "@/components/asso-form";

export default async function AssoPage() {
  const assos = await prisma.association.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col gap-12">
      {/* Header */}
      <div className="flex flex-col gap-3 max-w-2xl">
        <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 text-sm font-medium px-3 py-1.5 rounded-full w-fit border border-rose-100">
          <Heart size={14} />
          Solidarité alimentaire
        </div>
        <h1 className="text-3xl font-bold">Associations & banques alimentaires</h1>
        <p className="text-zinc-500 leading-relaxed">
          Tu as un surplus après un partage de lot ? Ces associations de ton quartier en ont besoin.
          Contacte-les directement — un coup de fil suffit souvent.
        </p>
      </div>

      {/* Conseil don */}
      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 flex flex-col gap-2">
        <p className="font-semibold text-rose-800 text-sm">Pour ceux qui peuvent se le permettre</p>
        <p className="text-rose-700 text-sm leading-relaxed">
          Si tu as les moyens d&apos;acheter un lot entier mais que tu n&apos;en as besoin que d&apos;une partie,
          pense à donner le surplus plutôt que de le partager à prix coûtant.
          C&apos;est un geste simple qui change vraiment la vie de certaines familles.
        </p>
      </div>

      {/* Liste assos */}
      <section className="flex flex-col gap-4">
        <h2 className="font-bold text-lg">
          {assos.length > 0
            ? `${assos.length} association${assos.length > 1 ? "s" : ""} référencée${assos.length > 1 ? "s" : ""}`
            : "Aucune association pour le moment"}
        </h2>

        {assos.length === 0 ? (
          <div className="bg-white border border-zinc-100 rounded-2xl p-8 text-center text-zinc-400 text-sm">
            Sois le premier à référencer une association de ton quartier.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {assos.map((asso) => (
              <div
                key={asso.id}
                className="bg-white border border-zinc-100 rounded-2xl p-5 flex flex-col gap-3"
              >
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold">{asso.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-zinc-400">
                    <MapPin size={11} />
                    {asso.neighborhood ? `${asso.neighborhood}, ` : ""}{asso.city}
                  </div>
                </div>

                {asso.description && (
                  <p className="text-sm text-zinc-500 leading-relaxed">{asso.description}</p>
                )}

                {asso.needs && (
                  <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
                    <p className="text-xs font-medium text-amber-700 mb-1">Besoins actuels</p>
                    <p className="text-sm text-amber-600">{asso.needs}</p>
                  </div>
                )}

                <div className="flex flex-col gap-1.5 pt-1 border-t border-zinc-50">
                  {asso.contact && (
                    <a
                      href={`tel:${asso.contact}`}
                      className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
                    >
                      <Phone size={12} />
                      {asso.contact}
                    </a>
                  )}
                  {asso.website && (
                    <a
                      href={asso.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
                    >
                      <Globe size={12} />
                      {asso.website.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Formulaire référencer une asso */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="font-bold text-lg">Référencer une association</h2>
          <p className="text-sm text-zinc-500">
            Tu connais une association qui a besoin de dons alimentaires ? Ajoute-la ici.
          </p>
        </div>
        <AssoForm />
      </section>
    </div>
  );
}
