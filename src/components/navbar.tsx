"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Plus, MapPin, User, Heart, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationBell } from "@/components/notification-bell";

export function Navbar() {
  const pathname = usePathname();
  const { status } = useSession();

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
          <Link
            href="/asso"
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              pathname === "/asso"
                ? "bg-zinc-100 text-zinc-900"
                : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
            )}
          >
            <Heart size={15} />
            Associations
          </Link>
          <Link
            href="/faq"
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              pathname === "/faq"
                ? "bg-zinc-100 text-zinc-900"
                : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
            )}
          >
            <HelpCircle size={15} />
            FAQ
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
          <NotificationBell isAuthenticated={status === "authenticated"} />
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
