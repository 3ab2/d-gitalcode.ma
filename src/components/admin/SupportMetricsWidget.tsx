"use client";

import { Clock, Headphones, Inbox, MessageSquare, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import type { SupportMetrics } from "@/lib/analytics/support-metrics";

export function SupportMetricsWidget({ support }: { support: SupportMetrics }) {
  return (
    <section className="mb-8">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">Support Metrics</h2>
        <p className="text-sm text-white/45">Live support inbox performance</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Open Messages"
          value={support.openMessages}
          icon={Headphones}
          color="green"
        />
        <StatCard
          title="Unread"
          value={support.unreadMessages}
          icon={Inbox}
          color="purple"
        />
        <StatCard
          title="Today"
          value={support.messagesToday}
          icon={MessageSquare}
          trend="new messages"
        />
        <StatCard
          title="This Week"
          value={support.messagesThisWeek}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Avg Response"
          value={
            support.avgResponseTimeMinutes !== null
              ? `${support.avgResponseTimeMinutes}m`
              : "—"
          }
          icon={Clock}
          color="purple"
          trend="first reply"
        />
      </div>
    </section>
  );
}
