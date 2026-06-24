import Link from "next/link";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Je vis seul·e, est-ce que Looti est fait pour moi ?",
    a: "Absolument — c'est même le cas d'usage idéal. Seul·e, tu ne peux pas rentabiliser un lot de 6 yaourts ou une barquette de 2 kg de viande. Sur Looti, tu prends 1 ou 2 parts, tu paies moins cher, et le reste va à tes voisins au lieu de finir à la poubelle.",
  },
  {
    q: "On est 3 à la maison, les lots de 4 ou 6 ne tombent jamais juste…",
    a: "C'est exactement pour ça qu'on a créé Looti. Tu poses le lot, tu gardes 3 parts, et tu laisses 1 ou 3 parts disponibles pour tes voisins. Chacun prend ce dont il a besoin — pas de calcul, pas de gaspillage.",
  },
  {
    q: "Comment éviter d'acheter le lot pour rien si personne ne rejoint ?",
    a: "La meilleure pratique : concerte-toi avec tes voisins AVANT d'acheter. Poste le lot sur Looti depuis le magasin, attends que les parts soient réservées, puis passe en caisse. Tu peux aussi utiliser la discussion du lot pour prévenir tes voisins habituels. Certains utilisateurs ont des groupes de 4-5 voisins de confiance qui se signalent mutuellement avant chaque passage.",
  },
  {
    q: "Qui fait l'achat ? Comment s'organiser ?",
    a: "Deux façons de faire. La première : une personne est désignée pour acheter le lot (à tour de rôle si vous le faites souvent), et les autres viennent récupérer leur part au point de rencontre. La deuxième, plus sympa : vous allez au supermarché ensemble, vous faites le lot ensemble, et vous partagez le repas après. Plusieurs voisins nous ont dit que c'est devenu leur routine du samedi matin.",
  },
  {
    q: "Il me reste plus de parts que prévu, que faire ?",
    a: "Si tu as payé Stripe, les parts non réclamées peuvent être proposées à prix réduit via un nouveau lot. Si tu as du surplus alimentaire et que tu veux faire une bonne action, pense aux banques alimentaires et associations de ton quartier — tu trouveras leurs besoins du moment dans la section Associations.",
  },
  {
    q: "Peut-on suggérer à des personnes aisées de donner leur surplus ?",
    a: "Oui, et on encourage ça. Si tu peux te permettre de prendre un lot entier mais que tu n'en as besoin que d'une partie, tu peux acheter le lot, garder ta part, et donner le reste à une association locale. C'est une façon simple de transformer un achat malin en geste solidaire. Retrouve les associations près de chez toi dans la section dédiée.",
  },
  {
    q: "Le paiement est-il sécurisé ?",
    a: "Pour les paiements par carte, on utilise Stripe — le même système que Netflix ou Airbnb. Tes coordonnées bancaires ne transitent jamais par Looti. Pour les échanges en cash, c'est au moment du pickup, en main propre.",
  },
  {
    q: "Que se passe-t-il si quelqu'un ne vient pas récupérer sa part ?",
    a: "Pour l'instant, on fait confiance à la communauté. C'est pourquoi on recommande de partir de voisins que tu connais. Les paiements par carte sécurisent l'engagement — une personne qui a payé a plus intérêt à venir. Le système de notation à venir permettra de signaler les no-shows.",
  },
];

export default function FaqPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold">Questions fréquentes</h1>
        <p className="text-zinc-500">
          Tout ce qu&apos;il faut savoir pour bien utiliser Looti et ne plus jamais gaspiller.
        </p>
      </div>

      {/* Highlight card */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col gap-3">
        <p className="font-semibold text-amber-800">💡 Le conseil numéro 1</p>
        <p className="text-amber-700 text-sm leading-relaxed">
          Concertez-vous avec vos voisins <strong>avant</strong> d&apos;acheter le lot. Postez-le depuis
          le magasin, attendez que les parts soient réservées, puis passez en caisse. Vous évitez
          tout risque de vous retrouver avec trop.
        </p>
      </div>

      {/* FAQ items */}
      <div className="flex flex-col gap-3">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="group bg-white border border-zinc-100 rounded-2xl overflow-hidden"
          >
            <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none font-medium text-sm hover:bg-zinc-50 transition-colors">
              {faq.q}
              <ChevronDown
                size={16}
                className="flex-shrink-0 text-zinc-400 group-open:rotate-180 transition-transform"
              />
            </summary>
            <div className="px-5 pb-5 text-sm text-zinc-500 leading-relaxed border-t border-zinc-50 pt-4">
              {faq.a}
            </div>
          </details>
        ))}
      </div>

      {/* CTA associations */}
      <div className="bg-zinc-50 rounded-2xl p-6 flex flex-col gap-3 text-center">
        <p className="font-semibold">Tu veux aller plus loin ?</p>
        <p className="text-zinc-500 text-sm">
          Découvre les associations et banques alimentaires près de chez toi qui ont des besoins spécifiques.
        </p>
        <Link
          href="/asso"
          className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded-full transition-colors text-sm"
        >
          Voir les associations
        </Link>
      </div>
    </div>
  );
}
