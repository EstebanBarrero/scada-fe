import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTopTags } from "../../hooks/useMetrics";

export default function TopTagsChart() {
  const { data, isLoading, error } = useTopTags(10);

  if (isLoading) return <ChartSkeleton title="Top Tags by Alarm Count" />;
  if (error) return <ChartError title="Top Tags by Alarm Count" />;

  const chartData = data?.data.map((d) => ({
    name: d.tag_name,
    count: d.alarm_count,
    area: d.area ?? "Unknown",
  }));

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">
        Top Tags by Alarm Count
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis type="number" tick={{ fill: "#9ca3af", fontSize: 11 }} />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: "#9ca3af", fontSize: 11 }}
            width={70}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151" }}
            labelStyle={{ color: "#f3f4f6" }}
          />
          <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function ChartSkeleton({ title }: { title: string }) {
  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">{title}</h3>
      <div className="h-60 bg-gray-800 rounded animate-pulse" />
    </div>
  );
}

function ChartError({ title }: { title: string }) {
  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">{title}</h3>
      <div className="h-60 flex items-center justify-center text-gray-500 text-sm">
        Failed to load
      </div>
    </div>
  );
}
