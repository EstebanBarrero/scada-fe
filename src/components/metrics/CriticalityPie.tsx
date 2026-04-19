import { DonutChart, Legend } from "@tremor/react";
import { PieChart } from "lucide-react";
import { GlassCard } from "../ui/glass-card";
import { useByCriticality } from "../../hooks/useMetrics";

const TREMOR_COLORS: Record<string, string> = {
  CRITICAL: "rose",
  HIGH: "orange",
  MEDIUM: "amber",
  LOW: "emerald",
  UNKNOWN: "slate",
};

export default function CriticalityPie() {
  const { data, isLoading, error } = useByCriticality();

  if (isLoading) return <Skeleton />;
  if (error) return (
    <GlassCard>
      <h3 className="text-slate-100 font-semibold text-sm mb-2">Alarms by Criticality</h3>
      <div className="h-52 flex items-center justify-center text-slate-500 text-sm">Failed to load</div>
    </GlassCard>
  );

  const chartData = data?.data?.map((d) => ({
    name: d.criticality,
    value: d.count,
    pct: d.percentage,
  })) ?? [];

  const colors = chartData.map((d) => TREMOR_COLORS[d.name] ?? "slate");

  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
          <PieChart className="w-3.5 h-3.5 text-rose-400" />
        </div>
        <h3 className="text-slate-100 font-semibold text-sm">Alarms by Criticality</h3>
      </div>
      <DonutChart
        className="mt-2 h-48"
        data={chartData}
        category="value"
        index="name"
        colors={colors as any}
        valueFormatter={(v) => v.toLocaleString()}
        showAnimation
        showLabel
      />
      <Legend
        className="mt-3 justify-center"
        categories={chartData.map((d) => `${d.name} (${d.pct}%)`)}
        colors={colors as any}
      />
    </GlassCard>
  );
}

function Skeleton() {
  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-white/[0.05] animate-pulse" />
        <div className="h-4 w-44 bg-white/[0.05] rounded animate-pulse" />
      </div>
      <div className="mt-2 h-48 flex items-center justify-center">
        <div className="w-44 h-44 rounded-full bg-white/[0.03] animate-pulse" />
      </div>
    </GlassCard>
  );
}
