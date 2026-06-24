"use client";

import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";

type Notif = {
  id: string;
  type: string;
  content: string;
  lotId: string | null;
  read: boolean;
  createdAt: string;
};

export function NotificationBell({ isAuthenticated }: { isAuthenticated: boolean }) {
  const router = useRouter();
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unread = notifs.filter((n) => !n.read).length;

  useEffect(() => {
    if (!isAuthenticated) return;
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setNotifs(data));
  }, [isAuthenticated]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleOpen() {
    setOpen((o) => !o);
    if (!open && unread > 0) {
      await fetch("/api/notifications/read", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
      setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  }

  function handleClick(notif: Notif) {
    setOpen(false);
    if (notif.lotId) router.push(`/lots/${notif.lotId}`);
  }

  if (!isAuthenticated) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        className="relative w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition-colors"
      >
        <Bell size={16} className="text-zinc-600" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-80 bg-white border border-zinc-100 rounded-2xl shadow-lg overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-zinc-50 flex items-center justify-between">
            <span className="text-sm font-semibold">Notifications</span>
            {notifs.length > 0 && (
              <span className="text-xs text-zinc-400">{notifs.length} au total</span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifs.length === 0 ? (
              <div className="px-4 py-8 text-center text-zinc-400 text-sm">
                Aucune notification
              </div>
            ) : (
              notifs.map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => handleClick(notif)}
                  className={`w-full text-left px-4 py-3 hover:bg-zinc-50 transition-colors border-b border-zinc-50 last:border-0 flex flex-col gap-1 ${!notif.read ? "bg-amber-50/50" : ""}`}
                >
                  <span className="text-sm text-zinc-800 leading-snug">{notif.content}</span>
                  <span className="text-xs text-zinc-400">{formatDate(notif.createdAt)}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
