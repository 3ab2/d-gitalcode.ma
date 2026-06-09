"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Send } from "lucide-react";
import { ChatBubble } from "@/components/messages/ChatBubble";
import { usePolling } from "@/hooks/usePolling";
import { Button } from "@/components/ui/Button";

interface ThreadItem {
  type: "client" | "admin";
  id: string;
  content: string;
  createdAt: string;
  adminName?: string | null;
}

export function SupportChat() {
  const { t } = useTranslation();
  const [thread, setThread] = useState<ThreadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchThread = useCallback(async () => {
    const res = await fetch("/api/messages/thread");
    if (res.ok) {
      const data = await res.json();
      setThread(data.thread);
    }
    setLoading(false);
  }, []);

  usePolling(fetchThread, 5000);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [thread]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || sending) return;

    setSending(true);
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text }),
    });

    if (res.ok) {
      setDraft("");
      await fetchThread();
    }
    setSending(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-green border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-8rem)] max-h-[720px] rounded-2xl border border-white/10 bg-brand-dark/50 overflow-hidden">
      <div className="shrink-0 border-b border-white/10 px-5 py-4 bg-white/[0.02]">
        <h1 className="font-semibold text-white">{t("support.title")}</h1>
        <p className="text-xs text-white/45 mt-0.5">{t("support.subtitle")}</p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {thread.length === 0 ? (
          <p className="text-center text-sm text-white/40 py-12">{t("support.empty")}</p>
        ) : (
          thread.map((item) => (
            <ChatBubble
              key={item.id}
              align={item.type === "client" ? "right" : "left"}
              variant={item.type === "client" ? "client" : "support"}
              content={item.content}
              createdAt={item.createdAt}
              author={item.type === "admin" ? item.adminName || "D-GITALCODE" : undefined}
            />
          ))
        )}
      </div>

      <form
        onSubmit={sendMessage}
        className="shrink-0 border-t border-white/10 p-4 flex gap-2 bg-white/[0.02]"
      >
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t("support.placeholder")}
          className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-brand-green/40 focus:outline-none"
          aria-label={t("support.placeholder")}
        />
        <Button type="submit" isLoading={sending} disabled={!draft.trim()} className="shrink-0 px-4">
          <Send className="h-4 w-4" />
          <span className="sr-only">{t("support.send")}</span>
        </Button>
      </form>
    </div>
  );
}
