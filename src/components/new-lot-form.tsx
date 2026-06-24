"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Crosshair } from "lucide-react";

export function NewLotForm() {
  const router = useRouter();
  const [isLocating, setIsLocating] = useState(false);
  const [locationMode, setLocationMode] = useState<"gps" | "manual">("manual");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [totalPrice, setTotalPrice] = useState("");
  const [totalShares, setTotalShares] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pricePerShare =
    totalPrice && totalShares && Number(totalShares) > 0
      ? (Number(totalPrice) / Number(totalShares)).toFixed(2)
      : null;

  function locateMe() {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationMode("gps");
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        setError("Géolocalisation refusée, saisis ta ville manuellement.");
      }
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const body = {
      title: fd.get("title"),
      description: fd.get("description"),
      totalPrice: Number(fd.get("totalPrice")),
      totalShares: Number(fd.get("totalShares")),
      meetingPoint: fd.get("meetingPoint"),
      city: fd.get("city"),
      neighborhood: fd.get("neighborhood"),
      pickupDeadline: fd.get("pickupDeadline"),
      ...(coords ?? {}),
    };

    const res = await fetch("/api/lots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Une erreur est survenue.");
      setIsSubmitting(false);
      return;
    }

    const { id } = await res.json();
    router.push(`/lots/${id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Infos produit */}
      <section className="bg-white border border-zinc-100 rounded-2xl p-5 flex flex-col gap-4">
        <h2 className="font-semibold text-sm text-zinc-500 uppercase tracking-wide">Le lot</h2>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Titre *</label>
          <input
            name="title"
            required
            placeholder="ex: Pâtes fraîches Barilla x6"
            className="border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Description</label>
          <textarea
            name="description"
            rows={3}
            placeholder="Détails supplémentaires, état, marque..."
            className="border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Prix total (€) *</label>
            <input
              name="totalPrice"
              type="number"
              step="0.01"
              min="0"
              required
              value={totalPrice}
              onChange={(e) => setTotalPrice(e.target.value)}
              placeholder="12.90"
              className="border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Nombre de parts *</label>
            <input
              name="totalShares"
              type="number"
              min="2"
              required
              value={totalShares}
              onChange={(e) => setTotalShares(e.target.value)}
              placeholder="6"
              className="border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>

        {pricePerShare && (
          <div className="bg-amber-50 text-amber-700 text-sm px-4 py-2.5 rounded-xl font-medium">
            → {pricePerShare} € par part
          </div>
        )}
      </section>

      {/* Localisation */}
      <section className="bg-white border border-zinc-100 rounded-2xl p-5 flex flex-col gap-4">
        <h2 className="font-semibold text-sm text-zinc-500 uppercase tracking-wide">Lieu</h2>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={locateMe}
            disabled={isLocating}
            className="flex items-center gap-2 text-sm border border-zinc-200 rounded-xl px-4 py-2.5 hover:bg-zinc-50 transition-colors disabled:opacity-60"
          >
            <Crosshair size={15} className={isLocating ? "animate-spin" : ""} />
            {isLocating ? "Localisation..." : coords ? "GPS ✓" : "Utiliser ma position"}
          </button>
          <button
            type="button"
            onClick={() => setLocationMode("manual")}
            className="flex items-center gap-2 text-sm border border-zinc-200 rounded-xl px-4 py-2.5 hover:bg-zinc-50 transition-colors"
          >
            <MapPin size={15} />
            Saisir manuellement
          </button>
        </div>

        {(locationMode === "manual" || !coords) && (
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Ville</label>
              <input
                name="city"
                placeholder="Paris"
                className="border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Quartier</label>
              <input
                name="neighborhood"
                placeholder="Oberkampf"
                className="border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Point de rencontre *</label>
          <input
            name="meetingPoint"
            required
            placeholder="ex: Devant le Monoprix rue de la Roquette"
            className="border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Date limite de retrait</label>
          <input
            name="pickupDeadline"
            type="datetime-local"
            className="border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </section>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3.5 rounded-full transition-colors disabled:opacity-60 text-sm"
      >
        {isSubmitting ? "Publication..." : "Publier le lot"}
      </button>
    </form>
  );
}
