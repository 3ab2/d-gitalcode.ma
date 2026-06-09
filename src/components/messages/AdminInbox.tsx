"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Send, Search } from "lucide-react";
import { ChatBubble } from "@/components/messages/ChatBubble";
import { usePolling } from "@/hooks/usePolling";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Conversation {
  userId: string;
  user: { id: string; name: string | null; email: string };
  lastPreview: string;
  lastActivityAt: string;
  unreadCount: number;
  messageCount: number;
}

interface ThreadItem {
  type: "client" | "admin";
  id: string;
  content: string;
  createdAt: string;
  adminName?: string | null;
}

export function AdminInbox() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [thread, setThread] = useState<ThreadItem[]>([]);
  const [selectedUser, setSelectedUser] = useState<Conversation["user"] | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchConversations = useCallback(async () => {
    const res = await fetch("/api/admin/conversations");
    if (res.ok) {
      setConversations(await res.json());
    }
    setLoadingList(false);
  }, []);

  useEffect(() => {
    if (!selectedId && conversations.length > 0) {
      setSelectedId(conversations[0].userId);
    }
  }, [conversations, selectedId]);

  const fetchThread = useCallback(async (userId: string) => {
    setLoadingThread(true);
    const res = await fetch(`/api/admin/conversations/${userId}`);
    if (res.ok) {
      const data = await res.json();
      setThread(data.thread);
      setSelectedUser(data.user);
    }
    setLoadingThread(false);
  }, []);

  usePolling(fetchConversations, 5000);

  useEffect(() => {
    if (selectedId) fetchThread(selectedId);
  }, [selectedId, fetchThread]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [thread]);

  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId || !draft.trim() || sending) return;

    setSending(true);
    const res = await fetch(`/api/admin/conversations/${selectedId}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: draft.trim() }),
    });

    if (res.ok) {
      setDraft("");
      await Promise.all([fetchThread(selectedId), fetchConversations()]);
    }
    setSending(false);
  };

  const filtered = conversations.filter((c) => {
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      c.user.email.toLowerCase().includes(q) ||
      (c.user.name?.toLowerCase().includes(q) ?? false) ||
      c.lastPreview.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex h-[calc(100vh-6rem)] min-h-[560px] rounded-2xl border border-white/10 overflow-hidden bg-brand-card/30">
      <aside className="w-full max-w-sm shrink-0 border-r border-white/10 flex flex-col bg-brand-dark/40">
        <div className="p-4 border-b border-white/10">
          <h1 className="text-lg font-bold text-white">Inbox</h1>
          <p className="text-xs text-white/45 mt-0.5">Client conversations</p>
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clients…"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/35 focus:border-brand-green/40 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingList ? (
            <div className="flex justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-green border-t-transparent" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-white/40 text-center py-12">No conversations</p>
          ) : (
            filtered.map((conv) => (
              <button
                key={conv.userId}
                type="button"
                onClick={() => setSelectedId(conv.userId)}
                className={cn(
                  "w-full text-left px-4 py-3 border-b border-white/5 transition-colors hover:bg-white/[0.03]",
                  selectedId === conv.userId && "bg-brand-green/10 border-l-2 border-l-brand-green"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-white truncate">
                      {conv.user.name || "Client"}
                    </p>
                    <p className="text-xs text-white/40 truncate">{conv.user.email}</p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="shrink-0 h-5 min-w-5 rounded-full bg-brand-green px-1.5 text-[10px] font-bold text-brand-dark flex items-center justify-center">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/50 mt-2 line-clamp-2">{conv.lastPreview}</p>
                <p className="text-[10px] text-white/30 mt-1">
                  {formatDate(conv.lastActivityAt)}
                </p>
              </button>
            ))
          )}
        </div>
      </aside>

      <section className="flex flex-1 flex-col min-w-0">
        {!selectedId ? (
          <div className="flex flex-1 items-center justify-center text-white/40 text-sm">
            Select a conversation
          </div>
        ) : (
          <>
            <div className="shrink-0 border-b border-white/10 px-5 py-4">
              <p className="font-semibold text-white">{selectedUser?.name || "Client"}</p>
              <p className="text-xs text-white/45">{selectedUser?.email}</p>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {loadingThread ? (
                <div className="flex justify-center py-12">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-green border-t-transparent" />
                </div>
              ) : thread.length === 0 ? (
                <p className="text-center text-sm text-white/40 py-12">No messages yet</p>
              ) : (
                thread.map((item) => (
                  <ChatBubble
                    key={item.id}
                    align={item.type === "client" ? "left" : "right"}
                    variant={item.type === "client" ? "client" : "support"}
                    content={item.content}
                    createdAt={item.createdAt}
                    author={
                      item.type === "client"
                        ? selectedUser?.name || "Client"
                        : item.adminName || "You"
                    }
                  />
                ))
              )}
            </div>

            <form
              onSubmit={sendReply}
              className="shrink-0 border-t border-white/10 p-4 flex gap-2 bg-white/[0.02]"
            >
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type your reply…"
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-brand-green/40 focus:outline-none"
              />
              <Button type="submit" isLoading={sending} disabled={!draft.trim()} className="shrink-0 px-4">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
