import { NewLotForm } from "@/components/new-lot-form";

export default function NewLotPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-2xl font-bold">Poster un lot</h1>
        <p className="text-zinc-500 text-sm">
          Partage un lot avantageux avec tes voisins. Tu définis les parts, ils rejoignent.
        </p>
      </div>
      <NewLotForm />
    </div>
  );
}
