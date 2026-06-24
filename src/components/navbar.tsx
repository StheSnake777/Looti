"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, MapPin, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-zinc-100">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight text-amber-500">
          looti
        </Link>

        <nav className="hidden sm:flex items-center gap-1">
          <Link
            href="/lots"
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              pathname.startsWith("/lots") && !pathname.includes("nouveau")
                ? "bg-zinc-100 text-zinc-900"
                : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
            )}
          >
            <MapPin size={15} />
            Explorer
          </Link>
          <Link
            href="/mes-lots"
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              pathname === "/mes-lots"
                ? "bg-zinc-100 text-zinc-900"
                : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
            )}
          >
            Mes lots
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/lots/nouveau"
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
          >
            <Plus size={15} />
            Poster
          </Link>
          <Link
            href="/profil"
            className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition-colors"
          >
            <User size={16} className="text-zinc-600" />
          </Link>
        </div>
      </div>
    </header>
  );
}
