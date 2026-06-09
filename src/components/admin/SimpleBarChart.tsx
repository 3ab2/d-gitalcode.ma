"use client";

interface BarChartProps {
  data: Record<string, number>;
  title?: string;
  color?: string;
}

export function SimpleBarChart({ data, title, color = "bg-brand-green" }: BarChartProps) {
  const entries = Object.entries(data).sort(([a], [b]) => a.localeCompare(b)).slice(-14);
  const max = Math.max(...entries.map(([, v]) => v), 1);

  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        {title && <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>}
        <p className="text-sm text-white/40">No data yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      {title && <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>}
      <div className="flex items-end gap-1.5 h-32">
        {entries.map(([day, value]) => (
          <div key={day} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={`w-full rounded-t ${color} transition-all`}
              style={{ height: `${(value / max) * 100}%`, minHeight: value > 0 ? "4px" : "0" }}
              title={`${day}: ${value}`}
            />
            <span className="text-[9px] text-white/30 rotate-0 truncate w-full text-center">
              {day.slice(5)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
