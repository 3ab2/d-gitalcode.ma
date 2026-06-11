"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Mail, MessageCircle, Send, Trash2, X } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

type SubmissionStatus = "NEW" | "READ" | "REPLIED" | "CLOSED";

interface Reply {
  id: string;
  subject: string;
  message: string;
  status: string;
  sentTo: string;
  createdAt: string;
  error?: string;
}

interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  type: string;
  method: string;
  serviceName: string | null;
  status: SubmissionStatus;
  createdAt: string;
  replies?: Reply[];
  _count?: { replies: number };
}

const statusColors: Record<SubmissionStatus, "green" | "purple" | "default"> = {
  NEW: "green", READ: "default", REPLIED: "purple", CLOSED: "default",
};

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selected, setSelected] = useState<Submission | null>(null);
  const [replyForm, setReplyForm] = useState({ subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);
    if (typeFilter) params.set("type", typeFilter);
    const res = await fetch(`/api/admin/submissions?${params}`);
    setSubmissions(await res.json());
    setLoading(false);
  }, [search, statusFilter, typeFilter]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      if (typeFilter) params.set("type", typeFilter);
      const res = await fetch(`/api/admin/submissions?${params}`);
      if (cancelled) return;
      setSubmissions(await res.json());
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [search, statusFilter, typeFilter]);

  const openDetail = async (sub: Submission) => {
    const res = await fetch(`/api/admin/submissions/${sub.id}`);
    const data = await res.json();
    setSelected(data);
    if (data.status === "NEW") {
      await fetch(`/api/admin/submissions/${sub.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "READ" }),
      });
      fetchSubmissions();
    }
    setReplyForm({
      subject: `Re: ${data.serviceName ? `Request for ${data.serviceName}` : "Your message to D-GITALCODE"}`,
      message: "",
    });
  };

  const updateStatus = async (id: string, status: SubmissionStatus) => {
    await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchSubmissions();
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setSending(true);
    setReplyError(null);

    const res = await fetch(`/api/admin/submissions/${selected.id}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(replyForm),
    });

    const data = await res.json().catch(() => null);

    if (res.ok) {
      const detailRes = await fetch(`/api/admin/submissions/${selected.id}`);
      setSelected(await detailRes.json());
      setReplyForm({ ...replyForm, message: "" });
      fetchSubmissions();
    } else {
      setReplyError(
        data?.message ||
          data?.error ||
          "Failed to send reply. Check server logs for details."
      );
      if (selected) {
        const detailRes = await fetch(`/api/admin/submissions/${selected.id}`);
        setSelected(await detailRes.json());
      }
    }

    setSending(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this submission?")) return;
    await fetch(`/api/admin/submissions/${id}`, { method: "DELETE" });
    setSelected(null);
    fetchSubmissions();
  };

  if (loading) return <div className="flex justify-center h-64 items-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-green border-t-transparent" /></div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Submissions Inbox</h1>
        <p className="text-sm text-white/50 mt-1">Contact requests and service inquiries</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 text-white text-sm" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          <option value="NEW">New</option>
          <option value="READ">Read</option>
          <option value="REPLIED">Replied</option>
          <option value="CLOSED">Closed</option>
        </select>
        <select className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white text-sm" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">All types</option>
          <option value="GENERAL">Contact</option>
          <option value="SERVICE_REQUEST">Service Request</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          {submissions.map((sub) => (
            <button key={sub.id} onClick={() => openDetail(sub)} className={`w-full text-left rounded-xl border p-4 transition-colors ${selected?.id === sub.id ? "border-brand-green/30 bg-brand-green/5" : sub.status === "NEW" ? "border-brand-green/20 bg-brand-green/5" : "border-white/10 bg-white/[0.02] hover:border-white/20"}`}>
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-white">{sub.name}</span>
                <Badge variant={statusColors[sub.status]}>{sub.status}</Badge>
              </div>
              <p className="text-sm text-white/50 mt-1 truncate">{sub.email}</p>
              {sub.serviceName && <p className="text-xs text-brand-green mt-1">{sub.serviceName}</p>}
              <p className="text-xs text-white/30 mt-2">{formatDate(sub.createdAt)}</p>
            </button>
          ))}
          {submissions.length === 0 && <p className="text-center text-white/50 py-16">No submissions found</p>}
        </div>

        {selected && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sticky top-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-white">{selected.name}</h3>
                <p className="text-sm text-white/50">{selected.email} {selected.phone && `• ${selected.phone}`}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-white/40 hover:text-white"><X className="h-5 w-5" /></button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant={selected.method === "WHATSAPP" ? "green" : "purple"}>
                {selected.method === "WHATSAPP" ? <><MessageCircle className="h-3 w-3 me-1" />WhatsApp</> : <><Mail className="h-3 w-3 me-1" />Form</>}
              </Badge>
              {selected.type === "SERVICE_REQUEST" && <Badge>Service Request</Badge>}
            </div>

            <p className="text-sm text-white/70 bg-white/5 rounded-xl p-4 mb-4">{selected.message}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {(["NEW", "READ", "REPLIED", "CLOSED"] as SubmissionStatus[]).map((s) => (
                <button key={s} onClick={() => updateStatus(selected.id, s)} className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${selected.status === s ? "border-brand-green/30 text-brand-green bg-brand-green/10" : "border-white/10 text-white/50 hover:text-white"}`}>{s}</button>
              ))}
              <button onClick={() => handleDelete(selected.id)} className="text-xs px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 ml-auto"><Trash2 className="h-3 w-3 inline me-1" />Delete</button>
            </div>

            {selected.replies && selected.replies.length > 0 && (
              <div className="mb-6 space-y-3">
                <h4 className="text-sm font-medium text-white/70">Conversation</h4>
                {selected.replies.map((reply) => (
                  <div key={reply.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                    <div className="flex items-center justify-between text-xs text-white/40 mb-1">
                      <span>{reply.subject}</span>
                      <Badge variant={reply.status === "SENT" ? "green" : "default"}>{reply.status}</Badge>
                    </div>
                    <p className="text-sm text-white/60">{reply.message}</p>
                    {reply.error && (
                      <p className="text-xs text-red-400 mt-2">{reply.error}</p>
                    )}
                    <p className="text-xs text-white/30 mt-2">{formatDate(reply.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={sendReply} className="space-y-3 border-t border-white/10 pt-4">
              <h4 className="text-sm font-medium text-white">Reply by email</h4>
              {replyError && (
                <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                  {replyError}
                </p>
              )}
              <Input id="subject" label="Subject" value={replyForm.subject} onChange={(e) => setReplyForm({ ...replyForm, subject: e.target.value })} required />
              <Textarea id="message" label="Message" rows={4} value={replyForm.message} onChange={(e) => setReplyForm({ ...replyForm, message: e.target.value })} required />
              <Button type="submit" isLoading={sending} size="sm"><Send className="h-4 w-4" /> Send Reply</Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
