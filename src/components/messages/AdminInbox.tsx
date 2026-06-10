"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Send, Search } from "lucide-react";
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

interface ThreadAttachment {
  id: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  createdAt: string;
  uploadedById: string;
  uploadedByName?: string | null;
}

interface ThreadItem {
  type: "client" | "admin";
  id: string;
  content: string;
  createdAt: string;
  adminName?: string | null;
  attachments?: ThreadAttachment[];
}

export function AdminInbox() {
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [thread, setThread] = useState<ThreadItem[]>([]);
  const [selectedUser, setSelectedUser] = useState<Conversation["user"] | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");
  const [showThread, setShowThread] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchConversations = useCallback(async () => {
    const res = await fetch("/api/admin/conversations");
    if (res.ok) {
      setConversations(await res.json());
    }
    setLoadingList(false);
  }, []);

  useEffect(() => {
    const userFromQuery = searchParams.get("user");
    if (userFromQuery) {
      setSelectedId(userFromQuery);
      setShowThread(true);
      return;
    }
    if (!selectedId && conversations.length > 0) {
      setSelectedId(conversations[0].userId);
    }
  }, [conversations, selectedId, searchParams]);

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

  const selectConversation = (userId: string) => {
    setSelectedId(userId);
    setShowThread(true);
  };

  return (
    <div className="flex h-[calc(100dvh-7rem)] min-h-[480px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-brand-card/30 md:h-[calc(100vh-6rem)] md:min-h-[560px] md:flex-row">
      <aside
        className={cn(
          "flex w-full shrink-0 flex-col border-white/10 bg-brand-dark/40 md:max-w-sm md:border-r",
          showThread ? "hidden md:flex" : "flex flex-1 md:flex-none"
        )}
      >
        <div className="border-b border-white/10 p-4">
          <h1 className="text-lg font-bold text-white">Support</h1>
          <p className="mt-0.5 text-xs text-white/45">Client support requests</p>
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
            <p className="py-12 text-center text-sm text-white/40">No support requests yet</p>
          ) : (
            filtered.map((conv) => (
              <button
                key={conv.userId}
                type="button"
                onClick={() => selectConversation(conv.userId)}
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

      <section
        className={cn(
          "flex min-w-0 flex-1 flex-col",
          !showThread && "hidden md:flex"
        )}
      >
        {!selectedId ? (
          <div className="flex flex-1 items-center justify-center text-sm text-white/40">
            Select a client
          </div>
        ) : (
          <>
            <div className="flex shrink-0 items-center gap-3 border-b border-white/10 px-4 py-4 md:px-5">
              <button
                type="button"
                onClick={() => setShowThread(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/60 hover:bg-white/5 md:hidden"
                aria-label="Back to list"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="min-w-0">
                <p className="truncate font-semibold text-white">
                  {selectedUser?.name || "Client"}
                </p>
                <p className="truncate text-xs text-white/45">{selectedUser?.email}</p>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {loadingThread ? (
                <div className="flex justify-center py-12">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-green border-t-transparent" />
                </div>
              ) : thread.length === 0 ? (
                <p className="py-12 text-center text-sm text-white/40">No chat history yet</p>
              ) : (
                thread.map((item) => (
                  <ChatBubble
                    key={item.id}
                    align={item.type === "client" ? "left" : "right"}
                    variant={item.type === "client" ? "client" : "support"}
                    content={item.content}
                    createdAt={item.createdAt}
                    attachments={item.attachments ?? []}
                    showAttachmentMeta={item.type === "client"}
                    author={
                      item.type === "client" ? selectedUser?.name || "Client" : undefined
                    }
                    supportLabel={
                      item.type === "admin" ? item.adminName || "You" : undefined
                    }
                    avatarLabel={
                      item.type === "client"
                        ? (selectedUser?.name || selectedUser?.email || "CL").slice(0, 2)
                        : undefined
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
