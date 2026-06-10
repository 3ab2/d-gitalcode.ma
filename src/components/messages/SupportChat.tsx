"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";
import {
  ArrowUp,
  Clock,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { ChatBubble } from "@/components/messages/ChatBubble";
import {
  AttachmentComposer,
  AttachmentPickerButtons,
  uploadMessageWithAttachments,
  useAttachmentDropZone,
  type PendingAttachment,
} from "@/components/messages/AttachmentComposer";
import type { MessageAttachment } from "@/components/messages/MessageAttachments";
import { usePolling } from "@/hooks/usePolling";
import { cn, formatChatTime } from "@/lib/utils";
import { type Locale } from "@/lib/i18n/settings";
import type { ClientConversationStatus } from "@/lib/messages-thread";

interface ThreadItem {
  type: "client" | "admin";
  id: string;
  content: string;
  createdAt: string;
  adminName?: string | null;
  attachments?: MessageAttachment[];
}

interface ThreadMeta {
  status: ClientConversationStatus;
  lastActivityAt: string | null;
  lastSupportReplyAt: string | null;
  unreadCount: number;
}

const SEEN_STORAGE_KEY = "dgitalcode-support-last-seen";

function getInitials(name?: string | null, email?: string | null): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`
      : parts[0].slice(0, 2);
  }
  return email?.slice(0, 2) ?? "ME";
}

function StatusPill({
  status,
  label,
}: {
  status: ClientConversationStatus;
  label: string;
}) {
  const styles: Record<ClientConversationStatus, string> = {
    open: "border-white/15 bg-white/[0.04] text-white/55",
    waiting: "border-amber-400/25 bg-amber-400/10 text-amber-200/90",
    replied: "border-brand-green/30 bg-brand-green/10 text-brand-green",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider",
        styles[status]
      )}
    >
      {label}
    </span>
  );
}

export function SupportChat() {
  const { t } = useTranslation();
  const params = useParams();
  const locale = (params.locale as Locale) || "fr";
  const localeTag = locale === "ar" ? "ar-MA" : locale === "en" ? "en-US" : "fr-FR";
  const { data: session } = useSession();

  const [thread, setThread] = useState<ThreadItem[]>([]);
  const [meta, setMeta] = useState<ThreadMeta>({
    status: "open",
    lastActivityAt: null,
    lastSupportReplyAt: null,
    unreadCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [pendingFiles, setPendingFiles] = useState<PendingAttachment[]>([]);
  const [sending, setSending] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [lastSeenId, setLastSeenId] = useState<string | null>(null);
  const [newMessageIds, setNewMessageIds] = useState<Set<string>>(new Set());

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const prevThreadLengthRef = useRef(0);
  const composerRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const userInitials = getInitials(session?.user?.name, session?.user?.email);

  const addPendingFromDrop = useCallback((incoming: FileList | File[]) => {
    const list = Array.from(incoming);
    setPendingFiles((prev) => {
      const next = [...prev];
      for (const file of list) {
        if (next.length >= 5) break;
        const previewUrl = file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : null;
        next.push({
          id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
          file,
          previewUrl,
        });
      }
      return next;
    });
  }, []);

  const dropZone = useAttachmentDropZone(addPendingFromDrop, sending);

  useEffect(() => {
    const stored = localStorage.getItem(SEEN_STORAGE_KEY);
    if (stored) setLastSeenId(stored);
  }, []);

  const markSeen = useCallback((items: ThreadItem[]) => {
    const last = items.at(-1);
    if (!last) return;
    setLastSeenId(last.id);
    localStorage.setItem(SEEN_STORAGE_KEY, last.id);
  }, []);

  const fetchThread = useCallback(async () => {
    const res = await fetch("/api/messages/thread");
    if (res.ok) {
      const data = await res.json();
      const items: ThreadItem[] = data.thread ?? [];
      const nextMeta: ThreadMeta = data.meta ?? {
        status: "open",
        lastActivityAt: null,
        lastSupportReplyAt: null,
        unreadCount: 0,
      };

      if (items.length > prevThreadLengthRef.current) {
        const added = items.slice(prevThreadLengthRef.current);
        setNewMessageIds((prev) => {
          const next = new Set(prev);
          added.forEach((item) => next.add(item.id));
          return next;
        });
      }
      prevThreadLengthRef.current = items.length;

      setThread(items);
      setMeta(nextMeta);
    }
    setLoading(false);
  }, []);

  usePolling(fetchThread, 5000);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      if (thread.length > 0) markSeen(thread);
    }
  }, [thread, markSeen]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, [draft]);

  const unreadFromThread = thread.filter(
    (item, index) =>
      item.type === "admin" &&
      (lastSeenId === null ||
        thread.findIndex((t) => t.id === lastSeenId) < index)
  ).length;

  const displayUnread = Math.max(meta.unreadCount, unreadFromThread);

  const canSend =
    (draft.trim().length > 0 || pendingFiles.length > 0) && !sending;

  const clearPendingFiles = () => {
    pendingFiles.forEach((f) => {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
    });
    setPendingFiles([]);
  };

  const sendMessage = async () => {
    const text = draft.trim();
    if ((!text && pendingFiles.length === 0) || sending) return;

    setSending(true);
    setUploadProgress(0);

    try {
      const files = pendingFiles.map((p) => p.file);
      const res =
        files.length > 0
          ? await uploadMessageWithAttachments(text, files, setUploadProgress)
          : await fetch("/api/messages", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ content: text }),
            });

      if (res.ok) {
        setDraft("");
        clearPendingFiles();
        if (textareaRef.current) textareaRef.current.style.height = "auto";
        await fetchThread();
      }
    } finally {
      setSending(false);
      setUploadProgress(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      sendMessage();
    }
  };

  const focusComposer = () => textareaRef.current?.focus();

  const statusLabel = {
    open: t("support.statusOpen"),
    waiting: t("support.statusWaiting"),
    replied: t("support.statusReplied"),
  }[meta.status];

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-brand-green border-t-transparent" />
          <p className="text-xs text-white/40">{t("support.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="support-chat-shell flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border-0 bg-brand-dark/40 shadow-2xl shadow-black/30 sm:rounded-2xl sm:border sm:border-white/10">
      <header className="z-10 shrink-0 border-b border-white/10 bg-brand-dark/95 px-4 py-4 backdrop-blur-xl sm:px-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-base font-semibold tracking-tight text-white sm:text-lg">
                {t("support.brandTitle")}
              </h1>
              {displayUnread > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-green px-1.5 text-[10px] font-bold text-brand-dark">
                  {displayUnread}
                </span>
              )}
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="inline-flex items-center gap-1.5 text-xs text-brand-green">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-green/60 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-green" />
                </span>
                {t("support.online")}
              </span>
              <span className="text-xs text-white/40">{t("support.responseTime")}</span>
            </div>
          </div>

          <StatusPill status={meta.status} label={statusLabel} />
        </div>

        {meta.lastSupportReplyAt && (
          <p className="mt-2 flex items-center gap-1.5 text-[11px] text-white/35">
            <Clock className="h-3 w-3 shrink-0" />
            {t("support.lastReply")}{" "}
            <span className="text-white/50">
              {formatChatTime(meta.lastSupportReplyAt, localeTag)}
            </span>
          </p>
        )}
      </header>

      <div
        ref={scrollRef}
        className="support-chat-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-5"
      >
        {thread.length === 0 ? (
          <div className="flex h-full min-h-[280px] flex-col items-center justify-center px-4 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-brand-green/15 to-brand-purple/10 shadow-lg shadow-brand-green/5">
              <Sparkles className="h-7 w-7 text-brand-green" />
            </div>
            <h2 className="text-lg font-semibold text-white">{t("support.emptyTitle")}</h2>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/45">
              {t("support.emptySubtitle")}
            </p>
            <button
              type="button"
              onClick={focusComposer}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-green px-5 py-2.5 text-sm font-semibold text-brand-dark shadow-lg shadow-brand-green/20 transition-all hover:bg-brand-green/90 hover:shadow-brand-green/30 active:scale-[0.98]"
            >
              <MessageCircle className="h-4 w-4" />
              {t("support.startConversation")}
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {thread.map((item) => (
              <ChatBubble
                key={item.id}
                align={item.type === "client" ? "right" : "left"}
                variant={item.type === "client" ? "client" : "support"}
                content={item.content}
                createdAt={item.createdAt}
                attachments={item.attachments ?? []}
                avatarLabel={item.type === "client" ? userInitials : undefined}
                locale={locale}
                animate={newMessageIds.has(item.id)}
              />
            ))}
          </div>
        )}
      </div>

      <form
        ref={composerRef}
        onSubmit={handleSubmit}
        className="support-chat-composer relative z-10 shrink-0 border-t border-white/10 bg-brand-dark/95 p-3 backdrop-blur-xl sm:p-4"
        {...dropZone.handlers}
      >
        {dropZone.dragOver && (
          <div className="pointer-events-none absolute inset-3 z-20 flex items-center justify-center rounded-2xl border-2 border-dashed border-brand-green/50 bg-brand-green/10 sm:inset-4">
            <p className="text-sm font-medium text-brand-green">
              {t("support.attachments.dropHere")}
            </p>
          </div>
        )}

        <AttachmentComposer
          files={pendingFiles}
          onChange={setPendingFiles}
          disabled={sending}
          fileInputRef={fileInputRef}
          cameraInputRef={cameraInputRef}
          hideButtons
        />

        {uploadProgress !== null && uploadProgress < 100 && (
          <div className="mb-2 h-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-brand-green transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}

        <div className="flex items-end gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-2 shadow-inner shadow-black/20 transition-colors focus-within:border-brand-green/30 focus-within:ring-1 focus-within:ring-brand-green/20">
          <AttachmentPickerButtons
            disabled={sending}
            fileCount={pendingFiles.length}
            onPickFiles={() => fileInputRef.current?.click()}
            onPickCamera={() => cameraInputRef.current?.click()}
          />
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("support.placeholder")}
            rows={1}
            className="max-h-[140px] min-h-[44px] flex-1 resize-none bg-transparent px-2 py-2.5 text-sm leading-relaxed text-white placeholder:text-white/35 focus:outline-none"
            aria-label={t("support.placeholder")}
          />
          <button
            type="submit"
            disabled={!canSend}
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all",
              canSend
                ? "bg-brand-green text-brand-dark shadow-md shadow-brand-green/25 hover:bg-brand-green/90 active:scale-95"
                : "bg-white/5 text-white/25"
            )}
            aria-label={t("support.send")}
          >
            {sending ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-dark/30 border-t-brand-dark" />
            ) : (
              <ArrowUp className="h-5 w-5" strokeWidth={2.5} />
            )}
          </button>
        </div>
        <p className="mt-2 hidden text-center text-[10px] text-white/30 sm:block">
          {t("support.sendHint")}
        </p>
      </form>
    </div>
  );
}
