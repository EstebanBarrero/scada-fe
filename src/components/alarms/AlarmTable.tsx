import { format } from "date-fns";
import type { Alarm, AlarmFilters, Meta } from "../../types/alarm";

interface Props {
  alarms: Alarm[];
  meta: Meta;
  filters: AlarmFilters;
  onFiltersChange: (f: AlarmFilters) => void;
  isLoading: boolean;
}

const CRITICALITY_BADGE: Record<string, string> = {
  CRITICAL: "badge-critical",
  HIGH: "badge-high",
  MEDIUM: "badge-medium",
  LOW: "badge-low",
  UNKNOWN: "badge-unknown",
};

const STATUS_COLOR: Record<string, string> = {
  ACTIVE: "text-red-400",
  ACKNOWLEDGED: "text-yellow-400",
  CLEARED: "text-green-400",
};

export default function AlarmTable({
  alarms,
  meta,
  filters,
  onFiltersChange,
  isLoading,
}: Props) {
  const setPage = (page: number) => onFiltersChange({ ...filters, page });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>
          {meta.total.toLocaleString()} alarms — page {meta.page} of{" "}
          {meta.pages}
        </span>
        <select
          className="select text-xs"
          value={filters.size ?? 50}
          onChange={(e) =>
            onFiltersChange({ ...filters, size: Number(e.target.value), page: 1 })
          }
        >
          {[25, 50, 100, 200].map((n) => (
            <option key={n} value={n}>
              {n} / page
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-800">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-400 bg-gray-900 uppercase tracking-wider">
            <tr>
              {["ID", "Timestamp", "Tag", "Criticality", "Value", "Status", "Source"].map(
                (h) => (
                  <th key={h} className="px-4 py-3 whitespace-nowrap">
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  Loading…
                </td>
              </tr>
            ) : alarms.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No alarms found
                </td>
              </tr>
            ) : (
              alarms.map((alarm) => (
                <tr
                  key={alarm.id}
                  className="hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-4 py-2 text-gray-500">{alarm.id}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-300">
                    {format(new Date(alarm.timestamp), "yyyy-MM-dd HH:mm:ss")}
                  </td>
                  <td className="px-4 py-2 font-mono text-blue-300">
                    {alarm.tag?.name ?? alarm.raw_tag}
                  </td>
                  <td className="px-4 py-2">
                    <span className={CRITICALITY_BADGE[alarm.criticality] ?? "badge-unknown"}>
                      {alarm.criticality}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-300">
                    {alarm.value != null
                      ? `${alarm.value} ${alarm.unit ?? ""}`
                      : "—"}
                  </td>
                  <td
                    className={`px-4 py-2 text-xs font-semibold ${
                      STATUS_COLOR[alarm.status] ?? "text-gray-400"
                    }`}
                  >
                    {alarm.status}
                  </td>
                  <td className="px-4 py-2 text-gray-500 text-xs">
                    {alarm.source ?? "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center gap-2">
        <button
          className="btn-secondary"
          disabled={meta.page <= 1}
          onClick={() => setPage(1)}
        >
          «
        </button>
        <button
          className="btn-secondary"
          disabled={meta.page <= 1}
          onClick={() => setPage(meta.page - 1)}
        >
          ‹
        </button>
        <span className="text-xs text-gray-400 px-3">
          {meta.page} / {meta.pages}
        </span>
        <button
          className="btn-secondary"
          disabled={meta.page >= meta.pages}
          onClick={() => setPage(meta.page + 1)}
        >
          ›
        </button>
        <button
          className="btn-secondary"
          disabled={meta.page >= meta.pages}
          onClick={() => setPage(meta.pages)}
        >
          »
        </button>
      </div>
    </div>
  );
}
