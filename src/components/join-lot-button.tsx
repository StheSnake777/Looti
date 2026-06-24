"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";

type Props = {
  lotId: string;
  left: number;
  isAuthenticated: boolean;
  isCreator: boolean;
  myShare: { nbShares: number; paymentMethod: string } | null;
  pricePerShare: number;
};

export function JoinLotButton({ lotId, left, isAuthenticated, isCreator, myShare, pricePerShare }: Props) {
  const router = useRouter();
  const [nbShares, setNbShares] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "STRIPE">("CASH");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isCreator) {
    return (
      <div className="bg-zinc-50 rounded-xl px-4 py-3 text-sm text-zinc-500 text-center">
        Tu es le créateur de ce lot
      </div>
    );
  }

  if (myShare) {
    return (
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 text-sm text-emerald-700 text-center">
        ✓ Tu as réservé {myShare.nbShares} part{myShare.nbShares > 1 ? "s" : ""} ·{" "}
        {myShare.paymentMethod === "CASH" ? "Cash au pickup" : "Payé par carte"}
      </div>
    );
  }

  if (left === 0) {
    return (
      <div className="bg-zinc-100 rounded-xl px-4 py-3 text-sm text-zinc-400 text-center">
        Ce lot est complet
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <button
        onClick={() => router.push("/auth/connexion")}
        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
      >
        Se connecter pour rejoindre
      </button>
    );
  }

  async function handleJoin() {
    setIsLoading(true);
    setError(null);

    if (paymentMethod === "STRIPE") {
      const res = await fetch(`/api/lots/${lotId}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nbShares }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError(data.error ?? "Erreur Stripe");
      setIsLoading(false);
      return;
    }

    const res = await fetch(`/api/lots/${lotId}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nbShares, paymentMethod: "CASH" }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Erreur");
      setIsLoading(false);
      return;
    }

    router.refresh();
  }

  const total = pricePerShare * nbShares;

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <div className="text-red-600 text-xs bg-red-50 px-3 py-2 rounded-lg">{error}</div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-zinc-500">Nombre de parts</label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setNbShares((n) => Math.max(1, n - 1))}
            className="w-9 h-9 rounded-lg border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 text-lg"
          >
            −
          </button>
          <span className="text-lg font-semibold w-8 text-center">{nbShares}</span>
          <button
            type="button"
            onClick={() => setNbShares((n) => Math.min(left, n + 1))}
            className="w-9 h-9 rounded-lg border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 text-lg"
          >
            +
          </button>
          <span className="text-sm text-zinc-400 ml-1">= {formatPrice(total)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-zinc-500">Paiement</label>
        <div className="grid grid-cols-2 gap-2">
          {(["CASH", "STRIPE"] as const).map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => setPaymentMethod(method)}
              className={`py-2 text-sm font-medium rounded-xl border transition-colors ${
                paymentMethod === method
                  ? "bg-amber-500 border-amber-500 text-white"
                  : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              {method === "CASH" ? "💵 Cash" : "💳 Carte"}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleJoin}
        disabled={isLoading}
        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 text-sm"
      >
        {isLoading ? "Traitement..." : `Rejoindre · ${formatPrice(total)}`}
      </button>
    </div>
  );
}
