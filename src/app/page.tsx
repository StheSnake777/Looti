import Link from "next/link";
import { ArrowRight, MapPin, Users, ShoppingBag, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-24 gap-6 bg-white border-b border-zinc-100">
        <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 text-sm font-medium px-3 py-1.5 rounded-full border border-amber-200">
          <Zap size={14} />
          Économise jusqu&apos;à 40% sur tes courses
        </div>
        <h1 className="text-5xl font-bold tracking-tight max-w-2xl leading-tight">
          Les gros lots au bon prix,{" "}
          <span className="text-amber-500">partagés entre voisins</span>
        </h1>
        <p className="text-lg text-zinc-500 max-w-xl">
          Un lot de 6 pâtes fraîches mais t&apos;en veux que 2 ? Poste le lot, tes voisins prennent
          le reste. Tout le monde gagne.
        </p>
        <div className="flex items-center gap-3 mt-2">
          <Link
            href="/lots"
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-full transition-colors"
          >
            Explorer les lots <ArrowRight size={16} />
          </Link>
          <Link
            href="/lots/nouveau"
            className="flex items-center gap-2 bg-white hover:bg-zinc-50 text-zinc-900 font-semibold px-6 py-3 rounded-full border border-zinc-200 transition-colors"
          >
            Poster un lot
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">Comment ça marche ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: ShoppingBag,
                title: "Tu trouves un bon lot",
                desc: "Au supermarché, en drive ou en ligne — tu repères un lot avantageux mais trop grand pour toi.",
              },
              {
                icon: Users,
                title: "Tu le postes sur Looti",
                desc: "Ajoute une photo, le prix total, le nombre de parts disponibles et un point de rencontre.",
              },
              {
                icon: MapPin,
                title: "Tes voisins rejoignent",
                desc: "Les gens près de chez toi prennent les parts restantes. Cash ou carte, comme vous voulez.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center">
                  <Icon size={24} className="text-amber-500" />
                </div>
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-amber-500 py-16 px-4 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Prêt à partager ton premier lot ?</h2>
        <p className="text-amber-100 mb-8 max-w-md mx-auto">
          Rejoins ta communauté locale et arrête de jeter ce que tu ne consommes pas.
        </p>
        <Link
          href="/lots/nouveau"
          className="inline-flex items-center gap-2 bg-white text-amber-600 font-semibold px-6 py-3 rounded-full hover:bg-amber-50 transition-colors"
        >
          Poster un lot <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
