import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { GlassCard } from "../ui/glass-card";
import { cn } from "../../lib/utils";
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
  HIGH:     "badge-high",
  MEDIUM:   "badge-medium",
  LOW:      "badge-low",
  UNKNOWN:  "badge-unknown",
};

const STATUS_COLOR: Record<string, string> = {
  ACTIVE:       "text-rose-400",
  ACKNOWLEDGED: "text-amber-400",
  CLEARED:      "text-emerald-400",
};

export default function AlarmTable({ alarms, meta, filters, onFiltersChange, isLoading }: Props) {
  const setPage = (page: number) => onFiltersChange({ ...filters, page });

  return (
    <div className="space-y-3">
      {/* Meta + page-size row */}
      <div className="flex items-center justify-between gap-4 px-1">
        <p className="text-xs text-slate-500 whitespace-nowrap">
          <span className="font-semibold text-slate-200">{meta.total.toLocaleString()}</span>
          {" alarms · page "}
          <span className="font-semibold text-slate-200">{meta.page}</span>
          {" of "}
          <span className="font-semibold text-slate-200">{meta.pages}</span>
        </p>

        <label className="flex items-center gap-2 text-xs text-slate-500 whitespace-nowrap">
          Rows per page
          <select
            value={filters.size ?? 50}
            onChange={(e) => onFiltersChange({ ...filters, size: Number(e.target.value), page: 1 })}
            className="bg-white/[0.05] border border-white/[0.08] text-slate-300 rounded-lg px-2 py-1
                       text-xs focus:outline-none focus:border-blue-500/50 cursor-pointer
                       dark:[color-scheme:dark] transition-all duration-200"
          >
            {[25, 50, 100, 200].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Table */}
      <GlassCard padding="sm" className="overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["ID", "Timestamp", "Tag", "Criticality", "Value", "Status", "Source"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-slate-500 font-semibold uppercase tracking-wider text-[10px]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center text-slate-500 py-12">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-400 rounded-full animate-spin" />
                      Loading…
                    </div>
                  </td>
                </tr>
              ) : alarms.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-slate-500 py-12">
                    No alarms found
                  </td>
                </tr>
              ) : (
                alarms.map((alarm) => (
                  <tr
                    key={alarm.id}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-2.5 text-slate-600 font-mono">{alarm.id}</td>
                    <td className="px-4 py-2.5 text-slate-400 whitespace-nowrap font-mono">
                      {format(new Date(alarm.timestamp), "yyyy-MM-dd HH:mm:ss")}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-blue-300">
                      {alarm.tag?.name ?? alarm.raw_tag}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={CRITICALITY_BADGE[alarm.criticality] ?? "badge-unknown"}>
                        {alarm.criticality}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-400 tabular-nums">
                      {alarm.value != null ? `${alarm.value} ${alarm.unit ?? ""}`.trim() : "—"}
                    </td>
                    <td className={cn("px-4 py-2.5 font-semibold", STATUS_COLOR[alarm.status] ?? "text-slate-400")}>
                      {alarm.status}
                    </td>
                    <td className="px-4 py-2.5 text-slate-600">
                      {alarm.source ?? "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-1">
        <button
          className="btn-page"
          disabled={meta.page <= 1}
          onClick={() => setPage(1)}
          title="First page"
        >
          <ChevronFirst className="w-3.5 h-3.5" />
        </button>
        <button
          className="btn-page"
          disabled={meta.page <= 1}
          onClick={() => setPage(meta.page - 1)}
          title="Previous page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* Page number pills */}
        <div className="flex items-center gap-1 mx-1">
          {Array.from({ length: Math.min(meta.pages, 5) }, (_, i) => {
            // Show pages around current
            let page: number;
            if (meta.pages <= 5) {
              page = i + 1;
            } else if (meta.page <= 3) {
              page = i + 1;
            } else if (meta.page >= meta.pages - 2) {
              page = meta.pages - 4 + i;
            } else {
              page = meta.page - 2 + i;
            }
            return (
              <button
                key={page}
                onClick={() => setPage(page)}
                className={cn(
                  "w-7 h-7 rounded-lg text-xs font-medium transition-all duration-200",
                  page === meta.page
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.05]"
                )}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          className="btn-page"
          disabled={meta.page >= meta.pages}
          onClick={() => setPage(meta.page + 1)}
          title="Next page"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
        <button
          className="btn-page"
          disabled={meta.page >= meta.pages}
          onClick={() => setPage(meta.pages)}
          title="Last page"
        >
          <ChevronLast className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
