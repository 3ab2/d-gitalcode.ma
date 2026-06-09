"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import { MessageStatusBadge } from "@/components/messages/MessageStatusBadge";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { usePolling } from "@/hooks/usePolling";
import { formatDate } from "@/lib/utils";

interface MessageReply {
  id: string;
  content: string;
  createdAt: string;
  admin: { name: string | null; email: string };
}

interface MessageDetail {
  id: string;
  subject: string;
  content: string;
  status: "OPEN" | "REPLIED";
  createdAt: string;
  user: { name: string | null; email: string };
  replies: MessageReply[];
}

export default function AdminMessageDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [message, setMessage] = useState<MessageDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessage = useCallback(async () => {
    const res = await fetch(`/api/admin/messages/${id}`);
    if (res.ok) {
      setMessage(await res.json());
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchMessage();
  }, [fetchMessage]);

  usePolling(fetchMessage, 10000);

  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;

    setSending(true);
    setError(null);

    const res = await fetch(`/api/admin/messages/${id}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: reply }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to send reply");
      setSending(false);
      return;
    }

    setReply("");
    await fetchMessage();
    setSending(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center h-64 items-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-green border-t-transparent" />
      </div>
    );
  }

  if (!message) {
    return (
      <div className="text-center py-16">
        <p className="text-white/50">Message not found.</p>
        <Link href="/admin/messages" className="text-brand-green text-sm mt-4 inline-block">
          Back to inbox
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/messages"
        className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-brand-green mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to messages
      </Link>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{message.subject}</h1>
          <p className="text-sm text-white/50 mt-1">
            {message.user.name || "Client"} — {message.user.email}
          </p>
          <p className="text-xs text-white/30 mt-1">{formatDate(message.createdAt)}</p>
        </div>
        <MessageStatusBadge
          status={message.status}
          labels={{ open: "Open", replied: "Replied" }}
        />
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 mb-6">
        <p className="text-xs text-white/40 mb-2">Client message</p>
        <p className="text-white/80 whitespace-pre-wrap">{message.content}</p>
      </div>

      {message.replies.length > 0 && (
        <div className="space-y-3 mb-8">
          <h2 className="text-sm font-medium text-white/70">Your replies</h2>
          {message.replies.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-brand-purple/20 bg-brand-purple/5 p-4"
            >
              <p className="text-xs text-brand-purple mb-2">
                {item.admin.name || "Admin"} — {formatDate(item.createdAt)}
              </p>
              <p className="text-sm text-white/80 whitespace-pre-wrap">{item.content}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={sendReply} className="border-t border-white/10 pt-6 space-y-4">
        <h2 className="text-sm font-medium text-white">Reply to client</h2>
        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}
        <Textarea
          id="reply"
          label="Your reply"
          rows={5}
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          required
          minLength={1}
        />
        <Button type="submit" isLoading={sending} size="sm">
          <Send className="h-4 w-4" />
          Send reply
        </Button>
      </form>
    </div>
  );
}
