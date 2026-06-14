"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Mail, MessageCircle, Trash2, X, Users, TrendingUp, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useCurrency } from "@/components/providers/PublicSettingsProvider";
import type { BudgetRange } from "@/lib/contact-validation";
import { LeadDetailInfo } from "@/components/admin/LeadDetailInfo";
import { LeadResponseActions } from "@/components/admin/LeadResponseActions";
import { Badge } from "@/components/ui/Badge";

type SubmissionStatus = "NEW" | "IN_PROGRESS" | "READ" | "REPLIED" | "CLOSED";

interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  budgetRange: string | null;
  sourcePage: string | null;
  serviceInterest: string | null;
  type: string;
  method: string;
  serviceName: string | null;
  status: SubmissionStatus;
  createdAt: string;
}

interface LeadStats {
  newLeads: number;
  inProgress: number;
  closedToday: number;
  totalToday: number;
}

const statusColors: Record<SubmissionStatus, "green" | "purple" | "default"> = {
  NEW: "green",
  IN_PROGRESS: "purple",
  READ: "default",
  REPLIED: "purple",
  CLOSED: "default",
};

const STATUS_OPTIONS: SubmissionStatus[] = [
  "NEW",
  "IN_PROGRESS",
  "READ",
  "REPLIED",
  "CLOSED",
];

function SubmissionsInbox() {
  const searchParams = useSearchParams();
  const { formatBudgetRange } = useCurrency();
  const leadIdParam = searchParams.get("id");

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [stats, setStats] = useState<LeadStats>({
    newLeads: 0,
    inProgress: 0,
    closedToday: 0,
    totalToday: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selected, setSelected] = useState<Submission | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [deepLinkHandled, setDeepLinkHandled] = useState(false);

  const buildParams = useCallback(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);
    if (typeFilter) params.set("type", typeFilter);
    if (serviceFilter) params.set("service", serviceFilter);
    if (dateFrom) params.set("from", dateFrom);
    if (dateTo) params.set("to", dateTo);
    return params;
  }, [search, statusFilter, typeFilter, serviceFilter, dateFrom, dateTo]);

  const fetchStats = useCallback(async () => {
    const res = await fetch("/api/admin/submissions/stats");
    if (res.ok) setStats(await res.json());
  }, []);

  const fetchSubmissions = useCallback(async () => {
    const res = await fetch(`/api/admin/submissions?${buildParams()}`);
    setSubmissions(await res.json());
    setLoading(false);
    void fetchStats();
  }, [buildParams, fetchStats]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const res = await fetch(`/api/admin/submissions?${buildParams()}`);
      if (cancelled) return;
      setSubmissions(await res.json());
      setLoading(false);
      void fetchStats();
    })();
    return () => {
      cancelled = true;
    };
  }, [buildParams, fetchStats]);

  const openDetail = useCallback(async (sub: Submission) => {
    setDetailLoading(true);
    setDetailError(null);
    setSelected(sub);

    try {
      const res = await fetch(`/api/admin/submissions/${sub.id}`);
      if (!res.ok) {
        throw new Error("Could not load lead details.");
      }

      const data = await res.json();
      setSelected(data);

      if (data.status === "NEW") {
        await fetch(`/api/admin/submissions/${sub.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "IN_PROGRESS" }),
        });
        fetchSubmissions();
        setSelected({ ...data, status: "IN_PROGRESS" });
      }
    } catch {
      setDetailError("Failed to load lead details. Please try again.");
      setSelected(null);
    } finally {
      setDetailLoading(false);
    }
  }, [fetchSubmissions]);

  useEffect(() => {
    if (!leadIdParam || deepLinkHandled || submissions.length === 0) return;
    const match = submissions.find((sub) => sub.id === leadIdParam);
    if (!match) return;

    const timer = window.setTimeout(() => {
      void openDetail(match);
      setDeepLinkHandled(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [leadIdParam, submissions, deepLinkHandled, openDetail]);

  const updateStatus = async (id: string, status: SubmissionStatus) => {
    await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchSubmissions();
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this lead? This action cannot be undone.")) return;
    await fetch(`/api/admin/submissions/${id}`, { method: "DELETE" });
    setSelected(null);
    fetchSubmissions();
  };

  if (loading) {
    return (
      <div className="flex justify-center h-64 items-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-green border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Leads</h1>
          <p className="text-sm text-white/50 mt-1">
            Contact requests and service inquiries — CRM-lite
          </p>
        </div>
        {stats.newLeads > 0 && (
          <Badge variant="green" className="text-sm px-3 py-1">
            {stats.newLeads} new
          </Badge>
        )}
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "New", value: stats.newLeads, icon: Users },
          { label: "In progress", value: stats.inProgress, icon: TrendingUp },
          { label: "Today", value: stats.totalToday, icon: Calendar },
          { label: "Closed today", value: stats.closedToday, icon: Calendar },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
            >
              <div className="flex items-center gap-2 text-white/50 text-xs">
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </div>
              <p className="mt-1 text-2xl font-bold text-white">{item.value}</p>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 text-white text-sm"
            placeholder="Search name, email, message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>
        <select
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white text-sm"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All types</option>
          <option value="GENERAL">Contact</option>
          <option value="SERVICE_REQUEST">Service Request</option>
        </select>
        <input
          type="text"
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white text-sm min-w-[140px]"
          placeholder="Service filter"
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
        />
        <input
          type="date"
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white text-sm"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          title="From date"
        />
        <input
          type="date"
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white text-sm"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          title="To date"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          {submissions.map((sub) => (
            <button
              key={sub.id}
              onClick={() => openDetail(sub)}
              className={`w-full text-left rounded-xl border p-4 transition-colors ${
                selected?.id === sub.id
                  ? "border-brand-green/30 bg-brand-green/5"
                  : sub.status === "NEW"
                    ? "border-brand-green/20 bg-brand-green/5"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-white">{sub.name}</span>
                <Badge variant={statusColors[sub.status]}>
                  {sub.status.replace("_", " ")}
                </Badge>
              </div>
              <p className="text-sm text-white/50 mt-1 truncate">{sub.email}</p>
              {(sub.serviceName || sub.serviceInterest) && (
                <p className="text-xs text-brand-green mt-1">
                  {sub.serviceName || sub.serviceInterest}
                </p>
              )}
              {sub.sourcePage && (
                <p className="text-xs text-white/30 mt-1 truncate">via {sub.sourcePage}</p>
              )}
              <p className="text-xs text-white/30 mt-2">{formatDate(sub.createdAt)}</p>
            </button>
          ))}
          {submissions.length === 0 && (
            <p className="text-center text-white/50 py-16">No leads found</p>
          )}
        </div>

        {detailError && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {detailError}
          </div>
        )}

        {detailLoading && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 flex justify-center items-center min-h-[320px] sticky top-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-green border-t-transparent" />
          </div>
        )}

        {selected && !detailLoading && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sticky top-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-white">Lead details</h3>
                <p className="text-sm text-white/50 mt-1">{selected.name}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-white/40 hover:text-white"
                aria-label="Close lead details"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant={statusColors[selected.status]}>
                {selected.status.replace("_", " ")}
              </Badge>
              <Badge variant={selected.method === "WHATSAPP" ? "green" : "purple"}>
                {selected.method === "WHATSAPP" ? (
                  <>
                    <MessageCircle className="h-3 w-3 me-1" />
                    WhatsApp
                  </>
                ) : (
                  <>
                    <Mail className="h-3 w-3 me-1" />
                    Form
                  </>
                )}
              </Badge>
              {selected.type === "SERVICE_REQUEST" && <Badge>Service Request</Badge>}
              {selected.budgetRange && (
                <Badge variant="default">
                  Budget:{" "}
                  {formatBudgetRange(selected.budgetRange as BudgetRange, "en")}
                </Badge>
              )}
            </div>

            <LeadDetailInfo lead={selected} formatDate={formatDate} />

            <section className="mt-6 mb-6 space-y-3 border-t border-white/10 pt-6">
              <h4 className="text-sm font-medium text-white">Respond to lead</h4>
              <p className="text-xs text-white/40">
                Open WhatsApp or your email client with a professional pre-filled message.
              </p>
              <LeadResponseActions lead={selected} />
            </section>

            <div className="flex flex-wrap gap-2 mb-6">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(selected.id, s)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                    selected.status === s
                      ? "border-brand-green/30 text-brand-green bg-brand-green/10"
                      : "border-white/10 text-white/50 hover:text-white"
                  }`}
                >
                  {s.replace("_", " ")}
                </button>
              ))}
              <button
                onClick={() => handleDelete(selected.id)}
                className="text-xs px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 ml-auto"
              >
                <Trash2 className="h-3 w-3 inline me-1" />
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SubmissionsLoading() {
  return (
    <div className="flex justify-center h-64 items-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-green border-t-transparent" />
    </div>
  );
}

export default function SubmissionsPage() {
  return (
    <Suspense fallback={<SubmissionsLoading />}>
      <SubmissionsInbox />
    </Suspense>
  );
}
