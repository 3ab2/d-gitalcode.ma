"use client";

import { BookOpen, Eye, FileText, MousePointerClick, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { SimpleBarChart } from "@/components/admin/SimpleBarChart";
import type { BlogAnalyticsSummary } from "@/lib/analytics/aggregate-blog";

function RankedList({
  title,
  items,
  maxCount,
  colorClass,
}: {
  title: string;
  items: { slug: string; title: string; count: number }[];
  maxCount: number;
  colorClass: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <h3 className="mb-4 text-sm font-semibold text-white">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-white/40">No data yet</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.slug} className="flex items-center justify-between gap-3">
              <span className="min-w-0 flex-1 truncate text-sm text-white/70" title={item.title}>
                {item.title}
              </span>
              <div className="flex shrink-0 items-center gap-3">
                <div className="h-2 w-24 overflow-hidden rounded-full bg-white/10 sm:w-32">
                  <div
                    className={`h-full rounded-full ${colorClass}`}
                    style={{
                      width: `${maxCount > 0 ? (item.count / maxCount) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className="w-8 text-right text-sm font-medium text-brand-green">
                  {item.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatCategory(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function BlogAnalyticsWidget({ blog }: { blog: BlogAnalyticsSummary }) {
  const maxViewed = blog.mostViewedArticles[0]?.count ?? 1;
  const maxRead = blog.mostReadArticles[0]?.count ?? 1;
  const maxCategory = blog.topCategories[0]?.count ?? 1;

  return (
    <section className="mb-8">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-white">Blog Analytics</h2>
          <p className="text-sm text-white/45">
            Traffic, engagement and conversion from blog articles (last 30 days)
          </p>
        </div>
        <div className="rounded-full border border-brand-green/30 bg-brand-green/10 px-4 py-1.5 text-sm font-medium text-brand-green">
          CTA conversion: {blog.ctaConversionRate}%
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Article Views" value={blog.totalViews} icon={Eye} color="green" />
        <StatCard title="Articles Read (80%+)" value={blog.totalReads} icon={BookOpen} color="purple" />
        <StatCard
          title="Quote Requests (Blog)"
          value={blog.quoteRequests}
          icon={MousePointerClick}
          color="green"
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SimpleBarChart
          data={blog.viewsByDay}
          title="Blog Views (last 30 days)"
          color="bg-brand-green"
        />
        <SimpleBarChart
          data={blog.readsByDay}
          title="Articles Read (last 30 days)"
          color="bg-brand-purple"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <RankedList
          title="Most Viewed Articles"
          items={blog.mostViewedArticles}
          maxCount={maxViewed}
          colorClass="bg-brand-green"
        />
        <RankedList
          title="Most Read Articles"
          items={blog.mostReadArticles}
          maxCount={maxRead}
          colorClass="bg-brand-purple"
        />
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
            <TrendingUp className="h-4 w-4 text-brand-green" />
            Top Categories
          </h3>
          {blog.topCategories.length === 0 ? (
            <p className="text-sm text-white/40">No data yet</p>
          ) : (
            <div className="space-y-3">
              {blog.topCategories.map((item) => (
                <div key={item.category} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-sm text-white/70">
                    <FileText className="h-3.5 w-3.5 text-white/30" />
                    {formatCategory(item.category)}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-white/10 sm:w-32">
                      <div
                        className="h-full rounded-full bg-brand-green"
                        style={{
                          width: `${(item.count / maxCategory) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="w-8 text-right text-sm font-medium text-brand-green">
                      {item.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
