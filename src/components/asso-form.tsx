"use client";

import { useState } from "react";

export function AssoForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const body = {
      name: fd.get("name"),
      city: fd.get("city"),
      neighborhood: fd.get("neighborhood"),
      description: fd.get("description"),
      needs: fd.get("needs"),
      contact: fd.get("contact"),
      website: fd.get("website"),
    };

    const res = await fetch("/api/asso", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Erreur");
      setIsSubmitting(false);
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-emerald-700 text-sm text-center">
        ✓ Association ajoutée — merci pour ta contribution !
      </div>
    );
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-white border border-zinc-200 hover:border-amber-300 hover:bg-amber-50 text-zinc-700 font-medium py-3 rounded-2xl transition-colors text-sm"
      >
        + Ajouter une association
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-zinc-100 rounded-2xl p-5 flex flex-col gap-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Nom de l&apos;association *</label>
          <input name="name" required className="border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Ville *</label>
          <input name="city" required className="border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Quartier</label>
        <input name="neighborhood" className="border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Description</label>
        <textarea name="description" rows={2} className="border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Besoins actuels</label>
        <textarea
          name="needs"
          rows={2}
          placeholder="ex: Pâtes, riz, conserves de légumes, produits bébé..."
          className="border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Téléphone</label>
          <input name="contact" type="tel" className="border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Site web</label>
          <input name="website" type="url" placeholder="https://" className="border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="flex-1 border border-zinc-200 text-zinc-600 font-medium py-2.5 rounded-xl text-sm hover:bg-zinc-50 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60"
        >
          {isSubmitting ? "Envoi..." : "Ajouter"}
        </button>
      </div>
    </form>
  );
}
