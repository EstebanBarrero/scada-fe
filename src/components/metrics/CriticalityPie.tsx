import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useByCriticality } from "../../hooks/useMetrics";

const COLORS: Record<string, string> = {
  CRITICAL: "#dc2626",
  HIGH: "#ea580c",
  MEDIUM: "#ca8a04",
  LOW: "#16a34a",
  UNKNOWN: "#6b7280",
};

export default function CriticalityPie() {
  const { data, isLoading, error } = useByCriticality();

  if (isLoading) return <Skeleton />;
  if (error)
    return (
      <div className="card h-64 flex items-center justify-center text-gray-500 text-sm">
        Failed to load
      </div>
    );

  const chartData = data?.data.map((d) => ({
    name: d.criticality,
    value: d.count,
    pct: d.percentage,
  }));

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">
        Alarms by Criticality
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ name, pct }) => `${name} ${pct}%`}
            labelLine={false}
          >
            {chartData?.map((entry) => (
              <Cell
                key={entry.name}
                fill={COLORS[entry.name] ?? "#6b7280"}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151" }}
            formatter={(val: number, name: string) => [val.toLocaleString(), name]}
          />
          <Legend
            formatter={(value) => (
              <span style={{ color: "#9ca3af", fontSize: 12 }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">
        Alarms by Criticality
      </h3>
      <div className="h-60 bg-gray-800 rounded animate-pulse" />
    </div>
  );
}
