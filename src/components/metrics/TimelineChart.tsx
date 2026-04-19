import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { useState } from "react";
import { GlassCard } from "../ui/glass-card";
import { useTimeline } from "../../hooks/useMetrics";
import type { TimelineInterval } from "../../types/metrics";
import { cn } from "../../lib/utils";

const SERIES = [
  { key: "Total",    color: "#3b82f6" }, // blue
  { key: "Critical", color: "#f43f5e" }, // rose
  { key: "High",     color: "#f97316" }, // orange
] as const;

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/95 backdrop-blur border border-white/10 rounded-xl px-3 py-2.5 text-xs shadow-2xl min-w-[140px]">
      <p className="text-slate-400 mb-2 font-medium">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-slate-400">{p.name}</span>
          </span>
          <span className="font-bold tabular-nums" style={{ color: p.color }}>
            {p.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

function CustomLegend() {
  return (
    <div className="flex items-center justify-center gap-5 mt-2">
      {SERIES.map(({ key, color }) => (
        <span key={key} className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <span className="w-4 h-0.5 rounded-full" style={{ backgroundColor: color }} />
          {key}
        </span>
      ))}
    </div>
  );
}

export default function TimelineChart() {
  const [interval, setInterval] = useState<TimelineInterval>("day");
  const { data, isLoading } = useTimeline(interval);

  const chartData = data?.data?.map((d) => ({
    date: interval === "day" ? d.bucket.slice(0, 10) : d.bucket.slice(0, 16),
    Total: d.count,
    Critical: d.critical_count,
    High: d.high_count,
  })) ?? [];

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <h3 className="text-slate-100 font-semibold text-sm">Alarm Timeline</h3>
        </div>

        <div className="flex gap-1 p-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">
          {(["day", "hour"] as TimelineInterval[]).map((i) => (
            <button
              key={i}
              onClick={() => setInterval(i)}
              className={cn(
                "text-xs px-3 py-1 rounded-md font-medium transition-all duration-200 capitalize",
                interval === i
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  : "text-slate-500 hover:text-slate-300"
              )}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="mt-2 h-64 bg-white/[0.03] rounded-xl animate-pulse" />
      ) : (
        <>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: "#64748b", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickCount={6}
              />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={36}
                tickFormatter={(v) => v.toLocaleString()}
              />
              <Tooltip content={<CustomTooltip />} />
              {SERIES.map(({ key, color }) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
          <CustomLegend />
        </>
      )}
    </GlassCard>
  );
}
