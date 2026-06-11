"use client";

import { useEffect, useState } from "react";
import {
  MessageSquare, FileText, Briefcase, FolderOpen, Eye, TrendingUp, Inbox,
} from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { SimpleBarChart } from "@/components/admin/SimpleBarChart";
import { BlogAnalyticsWidget } from "@/components/admin/BlogAnalyticsWidget";
import type { BlogAnalyticsSummary } from "@/lib/analytics/aggregate-blog";

interface Analytics {
  totalSubmissions: number;
  newSubmissions: number;
  newToday: number;
  whatsappClicks: number;
  formSubmissions: number;
  blogViews: number;
  totalServices: number;
  totalProjects: number;
  totalBlogPosts: number;
  publishedBlogPosts: number;
  submissionsByDay: Record<string, number>;
  eventsByDay: Record<string, number>;
  mostRequestedServices: { name: string; count: number }[];
  submissionsByStatus: { status: string; count: number }[];
  blog?: BlogAnalyticsSummary;
}

interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId?: string;
  userEmail?: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [data, setData] = useState<Analytics | null>(null);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/analytics").then((r) => r.json()),
      fetch("/api/admin/audit-log?limit=10").then((r) => r.json()),
    ]).then(([analytics, auditLogs]) => {
      setData(analytics);
      setLogs(auditLogs);
      setLoading(false);
    }).catch(console.error);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-green border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
      <p className="text-sm text-white/50 mb-8">CMS overview and analytics</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Submissions" value={data?.totalSubmissions ?? 0} icon={MessageSquare} color="green" trend={`${data?.newToday ?? 0} today`} />
        <StatCard title="New Submissions" value={data?.newSubmissions ?? 0} icon={Inbox} color="green" />
        <StatCard title="Services" value={data?.totalServices ?? 0} icon={Briefcase} color="purple" />
        <StatCard title="Blog Posts" value={`${data?.publishedBlogPosts ?? 0}/${data?.totalBlogPosts ?? 0}`} icon={FileText} trend="published/total" />
        <StatCard title="Portfolio Projects" value={data?.totalProjects ?? 0} icon={FolderOpen} />
        <StatCard
          title="Blog Views"
          value={data?.blog?.totalViews ?? data?.blogViews ?? 0}
          icon={Eye}
          trend="analytics (30d)"
        />
        <StatCard title="WhatsApp Clicks" value={data?.whatsappClicks ?? 0} icon={TrendingUp} color="green" />
        <StatCard title="Form Submissions" value={data?.formSubmissions ?? 0} icon={MessageSquare} color="purple" />
      </div>

      {data?.blog && <BlogAnalyticsWidget blog={data.blog} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SimpleBarChart data={data?.submissionsByDay ?? {}} title="Submissions (last 30 days)" color="bg-brand-green" />
        <SimpleBarChart data={data?.eventsByDay ?? {}} title="Activity Events (last 30 days)" color="bg-brand-purple" />
      </div>

      {data?.mostRequestedServices && data.mostRequestedServices.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 mb-8">
          <h3 className="text-sm font-semibold text-white mb-4">Most Requested Services</h3>
          <div className="space-y-3">
            {data.mostRequestedServices.map((s) => (
              <div key={s.name} className="flex items-center justify-between">
                <span className="text-sm text-white/70">{s.name}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-brand-green rounded-full" style={{ width: `${(s.count / (data.mostRequestedServices[0]?.count || 1)) * 100}%` }} />
                  </div>
                  <span className="text-sm font-medium text-brand-green w-8 text-right">{s.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: "/admin/services", label: "Manage Services" },
              { href: "/admin/blog", label: "Write Blog Post" },
              { href: "/admin/portfolio", label: "Add Project" },
              { href: "/admin/submissions", label: "View Submissions" },
              { href: "/admin/social", label: "Social Links" },
            ].map((action) => (
              <a key={action.href} href={action.href} className="rounded-xl border border-white/10 p-3 text-center text-sm text-white/70 hover:text-brand-green hover:border-brand-green/30 transition-colors">
                {action.label}
              </a>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Recent Admin Activity</h3>
          {logs.length > 0 ? (
            <div className="space-y-2">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between text-sm py-2 border-b border-white/5 last:border-0">
                  <span className="text-white/60">
                    <span className="text-brand-green">{log.action}</span> {log.entity}
                    {log.entityId && <span className="text-white/30"> #{log.entityId.slice(0, 8)}</span>}
                  </span>
                  <span className="text-xs text-white/30">{new Date(log.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-white/40">No activity logged yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
