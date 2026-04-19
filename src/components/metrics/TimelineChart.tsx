import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import { GlassCard } from "../ui/glass-card";
import { useTimeline } from "../../hooks/useMetrics";
import type { TimelineInterval } from "../../types/metrics";
import { cn } from "../../lib/utils";

// ── Helpers ──────────────────────────────────────────────────────────────────

function shortLabel(bucket: string, interval: TimelineInterval) {
  const d = new Date(bucket);
  return interval === "hour"
    ? format(d, "d/M HH:mm")   // "15/1 14:00"
    : format(d, "MMM d");       // "Jan 15"
}

// Show ~7 X-axis labels regardless of data density
function xInterval(len: number) {
  if (len <= 7) return 0;
  return Math.floor(len / 7);
}

// ── Shared axis style ───────────────────────────��───────────────────────��─────

const tickStyle = { fill: "#64748b", fontSize: 10 };
const gridStyle = { stroke: "rgba(255,255,255,0.04)", strokeDasharray: "3 3" };

// ── Tooltips ──────────────────────────────────────────────────────────────────

function VolumeTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/95 backdrop-blur border border-white/10 rounded-xl px-3 py-2 text-xs shadow-2xl">
      <p className="text-slate-400 mb-1 font-medium">{label}</p>
      <p className="font-bold text-blue-400">{payload[0].value.toLocaleString()} alarms</p>
    </div>
  );
}

function SeverityTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const colorMap: Record<string, string> = { Critical: "#f43f5e", High: "#f97316" };
  return (
    <div className="bg-slate-900/95 backdrop-blur border border-white/10 rounded-xl px-3 py-2.5 text-xs shadow-2xl min-w-[130px]">
      <p className="text-slate-400 mb-2 font-medium">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colorMap[p.name] }} />
            <span className="text-slate-400">{p.name}</span>
          </span>
          <span className="font-bold tabular-nums" style={{ color: colorMap[p.name] }}>
            {p.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────���─────────────────────────────��─

export default function TimelineChart() {
  const [interval, setInterval] = useState<TimelineInterval>("day");
  const { data, isLoading } = useTimeline(interval);

  const chartData = useMemo(() =>
    (data?.data ?? []).map((d) => ({
      label: shortLabel(d.bucket, interval),
      Total: d.count,
      Critical: d.critical_count,
      High: d.high_count,
    })),
    [data, interval]
  );

  const gap = xInterval(chartData.length);
  const maxTotal = Math.max(...chartData.map((d) => d.Total), 1);

  return (
    <GlassCard>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <h3 className="text-slate-100 font-semibold text-sm">Alarm Timeline</h3>
        </div>

        {/* Day / Hour toggle */}
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
        <div className="space-y-4">
          <div className="h-36 bg-white/[0.03] rounded-xl animate-pulse" />
          <div className="h-36 bg-white/[0.03] rounded-xl animate-pulse" />
        </div>
      ) : chartData.length === 0 ? (
        <div className="h-40 flex items-center justify-center text-slate-500 text-sm">
          No data — run ETL to generate timeline data
        </div>
      ) : (
        <div className="space-y-6">

          {/* ── Panel 1: Total volume ── */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-500/70 inline-block" />
              <p className="text-xs text-slate-400 font-medium">
                Total alarms per {interval}
                <span className="ml-2 text-slate-600 font-normal">
                  peak: {maxTotal.toLocaleString()}
                </span>
              </p>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={chartData} margin={{ top: 2, right: 4, bottom: 0, left: 0 }} barCategoryGap="25%">
                <CartesianGrid vertical={false} {...gridStyle} />
                <XAxis
                  dataKey="label"
                  tick={tickStyle}
                  axisLine={false}
                  tickLine={false}
                  interval={gap}
                />
                <YAxis
                  tick={tickStyle}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                  tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)}
                />
                <Tooltip content={<VolumeTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="Total" radius={[3, 3, 0, 0]} maxBarSize={20}>
                  {chartData.map((d, i) => (
                    <Cell
                      key={i}
                      fill="#3b82f6"
                      fillOpacity={d.Critical > 0 ? 0.85 : 0.35}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p className="text-[10px] text-slate-600 mt-1 text-center">
              Brighter bars = periods with critical alarms
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/[0.05]" />

          {/* ── Panel 2: Critical + High severity ── */}
          <div>
            <div className="flex items-center gap-4 mb-3">
              <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <span className="w-3 h-0.5 rounded-full bg-rose-500 inline-block" />
                Critical
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <span className="w-3 h-0.5 rounded-full bg-orange-400 inline-block" />
                High
              </span>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={chartData} margin={{ top: 2, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="gradCritical" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#f43f5e" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gradHigh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#f97316" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} {...gridStyle} />
                <XAxis
                  dataKey="label"
                  tick={tickStyle}
                  axisLine={false}
                  tickLine={false}
                  interval={gap}
                />
                <YAxis
                  tick={tickStyle}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                  tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)}
                  allowDecimals={false}
                />
                <Tooltip content={<SeverityTooltip />} />
                <Area
                  type="monotone"
                  dataKey="Critical"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  fill="url(#gradCritical)"
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0, fill: "#f43f5e" }}
                />
                <Area
                  type="monotone"
                  dataKey="High"
                  stroke="#f97316"
                  strokeWidth={2}
                  fill="url(#gradHigh)"
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0, fill: "#f97316" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

        </div>
      )}
    </GlassCard>
  );
}
