import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart2 } from "lucide-react";
import { GlassCard } from "../ui/glass-card";
import { useTopTags } from "../../hooks/useMetrics";

// Color scale: high alarm count = rose/red, low = slate/blue
const BAR_COLORS = [
  "#f43f5e", // rose   — rank 1 (highest)
  "#f97316", // orange — rank 2
  "#f59e0b", // amber  — rank 3
  "#eab308", // yellow — rank 4
  "#22d3ee", // cyan   — rank 5
  "#3b82f6", // blue   — rank 6
  "#6366f1", // indigo — rank 7
  "#8b5cf6", // violet — rank 8
  "#64748b", // slate  — rank 9
  "#475569", // slate darker — rank 10
];

interface TooltipPayload {
  value: number;
  payload: { name: string };
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/90 backdrop-blur border border-white/10 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-slate-300 font-medium mb-0.5">{payload[0].payload.name}</p>
      <p className="text-blue-300 font-bold tabular-nums">
        {payload[0].value.toLocaleString()} alarms
      </p>
    </div>
  );
}

export default function TopTagsChart() {
  const { data, isLoading, error } = useTopTags(10);

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorState />;

  // Sorted descending by alarm_count (API should return this, but ensure it)
  const sorted = [...(data?.data ?? [])].sort((a, b) => b.alarm_count - a.alarm_count);

  const chartData = sorted.map((d) => ({
    name: d.tag_name,
    count: d.alarm_count,
  }));

  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
          <BarChart2 className="w-3.5 h-3.5 text-rose-400" />
        </div>
        <div>
          <h3 className="text-slate-100 font-semibold text-sm">Top 10 Tags by Alarm Count</h3>
          <p className="text-slate-500 text-[11px] mt-0.5">Most frequent alarm sources</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 0, right: 48, bottom: 0, left: 8 }}
          barCategoryGap="20%"
        >
          <XAxis
            type="number"
            tick={{ fill: "#64748b", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => v.toLocaleString()}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={84}
            tick={{ fill: "#94a3b8", fontSize: 11, fontFamily: "monospace" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={18}>
            {chartData.map((_, idx) => (
              <Cell key={idx} fill={BAR_COLORS[idx] ?? "#475569"} fillOpacity={0.85} />
            ))}
            <LabelList
              dataKey="count"
              position="right"
              style={{ fill: "#94a3b8", fontSize: 10 }}
              formatter={(v: number) => v.toLocaleString()}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </GlassCard>
  );
}

function Skeleton() {
  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-white/[0.05] animate-pulse" />
        <div className="h-4 w-40 bg-white/[0.05] rounded animate-pulse" />
      </div>
      <div className="mt-2 h-64 bg-white/[0.03] rounded-xl animate-pulse" />
    </GlassCard>
  );
}

function ErrorState() {
  return (
    <GlassCard>
      <h3 className="text-slate-100 font-semibold text-sm mb-2">Top Tags by Alarm Count</h3>
      <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
        Failed to load data
      </div>
    </GlassCard>
  );
}
