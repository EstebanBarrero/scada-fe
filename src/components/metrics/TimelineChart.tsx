import { useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTimeline } from "../../hooks/useMetrics";
import type { TimelineInterval } from "../../types/metrics";

export default function TimelineChart() {
  const [interval, setInterval] = useState<TimelineInterval>("day");
  const { data, isLoading } = useTimeline(interval);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-300">
          Alarm Timeline
        </h3>
        <div className="flex gap-1">
          {(["day", "hour"] as TimelineInterval[]).map((i) => (
            <button
              key={i}
              onClick={() => setInterval(i)}
              className={`text-xs px-3 py-1 rounded ${
                interval === i
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-400 hover:bg-gray-600"
              }`}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="h-60 bg-gray-800 rounded animate-pulse" />
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data?.data ?? []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="bucket"
              tick={{ fill: "#9ca3af", fontSize: 10 }}
              tickFormatter={(v) => v.slice(0, 10)}
              interval="preserveStartEnd"
            />
            <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid #374151",
              }}
              labelStyle={{ color: "#f3f4f6" }}
            />
            <Legend
              formatter={(v) => (
                <span style={{ color: "#9ca3af", fontSize: 12 }}>{v}</span>
              )}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              dot={false}
              name="Total"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="critical_count"
              stroke="#dc2626"
              dot={false}
              name="Critical"
              strokeWidth={1.5}
            />
            <Line
              type="monotone"
              dataKey="high_count"
              stroke="#ea580c"
              dot={false}
              name="High"
              strokeWidth={1.5}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
