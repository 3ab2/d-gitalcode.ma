"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Plus, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MessageStatusBadge } from "@/components/messages/MessageStatusBadge";
import { usePolling } from "@/hooks/usePolling";
import { formatDate } from "@/lib/utils";
import { type Locale } from "@/lib/i18n/settings";

interface MessageReply {
  id: string;
  content: string;
  createdAt: string;
  admin: { name: string | null; email: string };
}

interface ClientMessage {
  id: string;
  subject: string;
  content: string;
  status: "OPEN" | "REPLIED";
  createdAt: string;
  replies: MessageReply[];
}

export default function MessagesPage() {
  const { t } = useTranslation();
  const params = useParams();
  const locale = (params.locale as Locale) || "fr";
  const basePath = `/${locale}`;

  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    const res = await fetch("/api/messages");
    if (res.ok) {
      setMessages(await res.json());
    }
    setLoading(false);
  }, []);

  usePolling(fetchMessages, 10000);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-green border-t-transparent" />
      </div>
    );
  }

  return (
    <section className="py-10 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">{t("messages.title")}</h1>
            <p className="text-sm text-white/50 mt-1">{t("messages.subtitle")}</p>
          </div>
          <Link href={`${basePath}/messages/new`}>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              {t("messages.new")}
            </Button>
          </Link>
        </div>

        {messages.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center">
            <MessageSquare className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/50">{t("messages.empty")}</p>
            <Link href={`${basePath}/messages/new`} className="inline-block mt-6">
              <Button variant="outline" size="sm">
                {t("messages.new")}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const isExpanded = expandedId === message.id;
              return (
                <article
                  key={message.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : message.id)}
                    className="w-full text-left p-5 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="font-semibold text-white truncate">{message.subject}</h2>
                        <p className="text-sm text-white/50 mt-1 line-clamp-2">{message.content}</p>
                        <p className="text-xs text-white/30 mt-2">{formatDate(message.createdAt)}</p>
                      </div>
                      <MessageStatusBadge
                        status={message.status}
                        labels={{ open: t("messages.statusOpen"), replied: t("messages.statusReplied") }}
                      />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-white/10 p-5 space-y-4">
                      <div className="rounded-xl bg-brand-green/5 border border-brand-green/20 p-4">
                        <p className="text-xs text-brand-green mb-1">{t("messages.you")}</p>
                        <p className="text-sm text-white/80 whitespace-pre-wrap">{message.content}</p>
                      </div>

                      {message.replies.length === 0 ? (
                        <p className="text-sm text-white/40 italic">{t("messages.awaitingReply")}</p>
                      ) : (
                        message.replies.map((reply) => (
                          <div
                            key={reply.id}
                            className="rounded-xl bg-brand-purple/5 border border-brand-purple/20 p-4"
                          >
                            <p className="text-xs text-brand-purple mb-1">
                              {t("messages.adminReply")} — {reply.admin.name || "D-GITALCODE"}
                            </p>
                            <p className="text-sm text-white/80 whitespace-pre-wrap">{reply.content}</p>
                            <p className="text-xs text-white/30 mt-2">{formatDate(reply.createdAt)}</p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
