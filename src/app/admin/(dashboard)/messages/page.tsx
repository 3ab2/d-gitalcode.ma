"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { MessageStatusBadge } from "@/components/messages/MessageStatusBadge";
import { usePolling } from "@/hooks/usePolling";
import { formatDate } from "@/lib/utils";

interface AdminMessage {
  id: string;
  subject: string;
  content: string;
  status: "OPEN" | "REPLIED";
  createdAt: string;
  user: { name: string | null; email: string };
  _count: { replies: number };
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"" | "OPEN" | "REPLIED">("");

  const fetchMessages = useCallback(async () => {
    const res = await fetch("/api/admin/messages");
    if (res.ok) {
      setMessages(await res.json());
    }
    setLoading(false);
  }, []);

  usePolling(fetchMessages, 10000);

  const filtered = filter
    ? messages.filter((m) => m.status === filter)
    : messages;

  const openCount = messages.filter((m) => m.status === "OPEN").length;

  if (loading) {
    return (
      <div className="flex justify-center h-64 items-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-green border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Client Messages</h1>
          <p className="text-sm text-white/50 mt-1">
            Internal helpdesk — {openCount} open
          </p>
        </div>
        <div className="flex gap-2">
          {(["", "OPEN", "REPLIED"] as const).map((status) => (
            <button
              key={status || "all"}
              type="button"
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                filter === status
                  ? "border-brand-green/40 bg-brand-green/10 text-brand-green"
                  : "border-white/10 text-white/50 hover:text-white"
              }`}
            >
              {status === "" ? "All" : status === "OPEN" ? "Open" : "Replied"}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center">
          <MessageSquare className="h-12 w-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/50">No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((message) => (
            <Link
              key={message.id}
              href={`/admin/messages/${message.id}`}
              className="block rounded-xl border border-white/10 bg-white/[0.02] p-4 hover:border-brand-green/30 hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-white truncate">{message.subject}</p>
                  <p className="text-sm text-white/50 mt-1">
                    {message.user.name || "Client"} — {message.user.email}
                  </p>
                  <p className="text-sm text-white/40 mt-2 line-clamp-2">{message.content}</p>
                  <p className="text-xs text-white/30 mt-2">{formatDate(message.createdAt)}</p>
                </div>
                <MessageStatusBadge
                  status={message.status}
                  labels={{ open: "Open", replied: "Replied" }}
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
