"use client";

import { useRouter, usePathname } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import { useTransition } from "react";

export function SearchBar({
  defaultVille,
  defaultQ,
}: {
  defaultVille?: string;
  defaultQ?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const q = fd.get("q") as string;
    const ville = fd.get("ville") as string;
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (ville) params.set("ville", ville);
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <div className="relative flex-1">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
        />
        <input
          name="q"
          defaultValue={defaultQ}
          placeholder="Rechercher un lot..."
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
        />
      </div>
      <div className="relative sm:w-52">
        <MapPin
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
        />
        <input
          name="ville"
          defaultValue={defaultVille}
          placeholder="Ville ou quartier..."
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors disabled:opacity-60"
      >
        Rechercher
      </button>
    </form>
  );
}
