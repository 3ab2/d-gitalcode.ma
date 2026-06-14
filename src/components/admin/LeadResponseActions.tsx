"use client";

import { useCallback, useMemo, useState } from "react";
import { AlertCircle, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  buildLeadMailtoUrl,
  buildLeadWhatsAppUrl,
  canReplyViaEmail,
  canReplyViaWhatsApp,
  type LeadResponseInput,
} from "@/lib/lead-response";

interface LeadResponseActionsProps {
  lead: LeadResponseInput;
  onWhatsAppOpen?: () => void;
  onEmailOpen?: () => void;
}

export function LeadResponseActions({
  lead,
  onWhatsAppOpen,
  onEmailOpen,
}: LeadResponseActionsProps) {
  const [actionError, setActionError] = useState<string | null>(null);
  const [openingChannel, setOpeningChannel] = useState<"whatsapp" | "email" | null>(
    null
  );

  const whatsappAvailable = useMemo(() => canReplyViaWhatsApp(lead), [lead]);
  const emailAvailable = useMemo(() => canReplyViaEmail(lead), [lead]);

  const whatsappUrl = useMemo(
    () => (whatsappAvailable ? buildLeadWhatsAppUrl(lead) : null),
    [lead, whatsappAvailable]
  );

  const mailtoUrl = useMemo(
    () => (emailAvailable ? buildLeadMailtoUrl(lead) : null),
    [lead, emailAvailable]
  );

  const openExternalUrl = useCallback((url: string) => {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }, []);

  const handleWhatsAppReply = useCallback(() => {
    setActionError(null);

    if (!whatsappUrl) {
      setActionError(
        "No valid phone number on this lead. Add a phone number with country code to reply via WhatsApp."
      );
      return;
    }

    setOpeningChannel("whatsapp");
    try {
      openExternalUrl(whatsappUrl);
      onWhatsAppOpen?.();
    } catch {
      setActionError("Could not open WhatsApp. Please try again or copy the phone number manually.");
    } finally {
      setOpeningChannel(null);
    }
  }, [onWhatsAppOpen, openExternalUrl, whatsappUrl]);

  const handleEmailReply = useCallback(() => {
    setActionError(null);

    if (!mailtoUrl) {
      setActionError(
        "No valid email address on this lead. WhatsApp-only submissions cannot be replied to by email."
      );
      return;
    }

    setOpeningChannel("email");
    try {
      window.location.href = mailtoUrl;
      onEmailOpen?.();
    } catch {
      setActionError("Could not open your email client. Please try again.");
    } finally {
      setOpeningChannel(null);
    }
  }, [mailtoUrl, onEmailOpen]);

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="button"
          variant="whatsapp"
          size="sm"
          className="w-full sm:flex-1"
          disabled={!whatsappAvailable}
          isLoading={openingChannel === "whatsapp"}
          onClick={handleWhatsAppReply}
          aria-label="Reply via WhatsApp with a pre-filled message"
        >
          <MessageCircle className="h-4 w-4 shrink-0" />
          Reply via WhatsApp
        </Button>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="w-full sm:flex-1"
          disabled={!emailAvailable}
          isLoading={openingChannel === "email"}
          onClick={handleEmailReply}
          aria-label="Reply via email with a pre-filled draft"
        >
          <Mail className="h-4 w-4 shrink-0" />
          Reply via Email
        </Button>
      </div>

      {!whatsappAvailable && (
        <p className="text-xs text-white/40">
          WhatsApp reply unavailable — no valid phone number was submitted.
        </p>
      )}

      {!emailAvailable && (
        <p className="text-xs text-white/40">
          Email reply unavailable — no deliverable email address on this lead.
        </p>
      )}

      {actionError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}
    </div>
  );
}
