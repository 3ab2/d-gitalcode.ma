"use client";

import type { ComponentType } from "react";
import { Mail, MessageSquare, Phone, User, Wrench } from "lucide-react";
import { getLeadRequestedService, type LeadResponseInput } from "@/lib/lead-response";
import { isDeliverableClientEmail } from "@/lib/email";

interface LeadDetailInfoProps {
  lead: LeadResponseInput & {
    message: string;
    sourcePage?: string | null;
    createdAt?: string;
  };
  formatDate?: (value: string) => string;
}

function InfoRow({
  icon: Icon,
  label,
  value,
  muted,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex gap-3 py-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-white/30" aria-hidden />
      <div className="min-w-0 flex-1">
        <dt className="text-xs text-white/40">{label}</dt>
        <dd
          className={`mt-0.5 text-sm break-words ${muted ? "text-white/40 italic" : "text-white/80"}`}
        >
          {value}
        </dd>
      </div>
    </div>
  );
}

export function LeadDetailInfo({ lead, formatDate }: LeadDetailInfoProps) {
  const service = getLeadRequestedService(lead);
  const hasEmail = isDeliverableClientEmail(lead.email);
  const hasPhone = Boolean(lead.phone?.trim());

  return (
    <dl className="divide-y divide-white/5 rounded-xl border border-white/10 bg-white/[0.02] px-4">
      <InfoRow icon={User} label="Name" value={lead.name} />
      <InfoRow
        icon={Mail}
        label="Email"
        value={hasEmail ? lead.email : "Not provided"}
        muted={!hasEmail}
      />
      <InfoRow
        icon={Phone}
        label="Phone"
        value={hasPhone ? lead.phone!.trim() : "Not provided"}
        muted={!hasPhone}
      />
      <InfoRow icon={Wrench} label="Requested service" value={service} />
      <div className="flex gap-3 py-3">
        <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-white/30" aria-hidden />
        <div className="min-w-0 flex-1">
          <dt className="text-xs text-white/40">Message</dt>
          <dd className="mt-1 whitespace-pre-wrap text-sm text-white/70">{lead.message}</dd>
        </div>
      </div>
      {(lead.sourcePage || lead.createdAt) && (
        <div className="space-y-1 py-3 text-xs text-white/35">
          {lead.sourcePage && <p>Source: {lead.sourcePage}</p>}
          {lead.createdAt && formatDate && <p>Received: {formatDate(lead.createdAt)}</p>}
        </div>
      )}
    </dl>
  );
}
