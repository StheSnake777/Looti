"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Send } from "lucide-react";
import { formatDate } from "@/lib/utils";

type Message = {
  id: string;
  content: string;
  createdAt: string;
  sender: { id: string; name: string; avatar: string | null };
};

export function LotChat({
  lotId,
  messages: initialMessages,
  currentUserId,
}: {
  lotId: string;
  messages: Message[];
  currentUserId: string | null;
}) {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || isSending) return;
    setIsSending(true);

    const res = await fetch(`/api/lots/${lotId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (res.ok) {
      const msg = await res.json();
      setMessages((prev) => [...prev, msg]);
      setContent("");
      router.refresh();
    }

    setIsSending(false);
  }

  return (
    <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden flex flex-col">
      <div className="px-5 py-4 border-b border-zinc-50">
        <h2 className="font-semibold text-sm">Discussion du lot</h2>
      </div>

      <div className="flex flex-col gap-3 p-5 max-h-80 overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-sm text-zinc-400 text-center py-4">
            Aucun message pour l&apos;instant. Lancez la discussion !
          </p>
        )}
        {messages.map((msg) => {
          const isMe = msg.sender.id === currentUserId;
          return (
            <div key={msg.id} className={`flex gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
              {msg.sender.avatar ? (
                <Image
                  src={msg.sender.avatar}
                  alt={msg.sender.name}
                  width={28}
                  height={28}
                  className="rounded-full flex-shrink-0"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-xs font-medium text-amber-700 flex-shrink-0">
                  {msg.sender.name[0]}
                </div>
              )}
              <div className={`flex flex-col gap-0.5 max-w-xs ${isMe ? "items-end" : ""}`}>
                <div
                  className={`text-sm px-3 py-2 rounded-2xl ${
                    isMe
                      ? "bg-amber-500 text-white rounded-tr-sm"
                      : "bg-zinc-100 text-zinc-900 rounded-tl-sm"
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-xs text-zinc-400">{formatDate(msg.createdAt)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {currentUserId ? (
        <form onSubmit={sendMessage} className="flex gap-2 p-4 border-t border-zinc-50">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Écrire un message..."
            className="flex-1 bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            type="submit"
            disabled={!content.trim() || isSending}
            className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-600 flex items-center justify-center text-white disabled:opacity-50 transition-colors"
          >
            <Send size={16} />
          </button>
        </form>
      ) : (
        <div className="px-5 py-4 border-t border-zinc-50 text-sm text-zinc-400 text-center">
          Connecte-toi pour participer à la discussion
        </div>
      )}
    </div>
  );
}
