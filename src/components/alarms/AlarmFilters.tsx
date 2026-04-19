import { Filter, Search, X } from "lucide-react";
import { GlassCard } from "../ui/glass-card";
import { cn } from "../../lib/utils";
import type { AlarmFilters, Criticality } from "../../types/alarm";

interface Props {
  filters: AlarmFilters;
  onChange: (f: AlarmFilters) => void;
}

const CRITICALITY_OPTIONS: { value: Criticality; color: string; glow: string }[] = [
  { value: "CRITICAL", color: "text-rose-400 border-rose-500/40 bg-rose-500/10 data-[active=true]:bg-rose-500/25 data-[active=true]:border-rose-500/60", glow: "data-[active=true]:shadow-[0_0_10px_rgba(244,63,94,0.3)]" },
  { value: "HIGH",     color: "text-orange-400 border-orange-500/40 bg-orange-500/10 data-[active=true]:bg-orange-500/25 data-[active=true]:border-orange-500/60", glow: "data-[active=true]:shadow-[0_0_10px_rgba(249,115,22,0.3)]" },
  { value: "MEDIUM",   color: "text-amber-400 border-amber-500/40 bg-amber-500/10 data-[active=true]:bg-amber-500/25 data-[active=true]:border-amber-500/60", glow: "" },
  { value: "LOW",      color: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10 data-[active=true]:bg-emerald-500/25 data-[active=true]:border-emerald-500/60", glow: "" },
  { value: "UNKNOWN",  color: "text-slate-400 border-slate-500/40 bg-slate-500/10 data-[active=true]:bg-slate-500/25 data-[active=true]:border-slate-500/60", glow: "" },
];

export default function AlarmFiltersPanel({ filters, onChange }: Props) {
  const update = (patch: Partial<AlarmFilters>) =>
    onChange({ ...filters, ...patch, page: 1 });

  const toggleCriticality = (val: Criticality) => {
    const current = filters.criticality ?? [];
    const next = current.includes(val)
      ? current.filter((v) => v !== val)
      : [...current, val];
    update({ criticality: next.length > 0 ? next : undefined });
  };

  const hasFilters = !!(
    filters.start_date ||
    filters.end_date ||
    filters.tag ||
    (filters.criticality && filters.criticality.length > 0)
  );

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <h3 className="text-slate-100 font-semibold text-sm">Filters</h3>
        </div>
        {hasFilters && (
          <button
            onClick={() => onChange({ page: 1, size: filters.size })}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Start date */}
        <div>
          <label className="text-xs text-slate-500 block mb-1.5 font-medium">Start Date</label>
          <input
            type="datetime-local"
            value={filters.start_date?.slice(0, 16) ?? ""}
            onChange={(e) =>
              update({
                start_date: e.target.value
                  ? new Date(e.target.value).toISOString()
                  : undefined,
              })
            }
          />
        </div>

        {/* End date */}
        <div>
          <label className="text-xs text-slate-500 block mb-1.5 font-medium">End Date</label>
          <input
            type="datetime-local"
            value={filters.end_date?.slice(0, 16) ?? ""}
            onChange={(e) =>
              update({
                end_date: e.target.value
                  ? new Date(e.target.value).toISOString()
                  : undefined,
              })
            }
          />
        </div>

        {/* Tag search */}
        <div>
          <label className="text-xs text-slate-500 block mb-1.5 font-medium">Tag</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
            <input
              type="text"
              placeholder="e.g. FIC-101"
              value={filters.tag ?? ""}
              onChange={(e) => update({ tag: e.target.value || undefined })}
              className="glass-input pl-9"
            />
          </div>
        </div>
      </div>

      {/* Criticality toggle chips */}
      <div className="mt-4">
        <label className="text-xs text-slate-500 block mb-2 font-medium">Criticality</label>
        <div className="flex flex-wrap gap-2">
          {CRITICALITY_OPTIONS.map(({ value, color, glow }) => {
            const active = (filters.criticality ?? []).includes(value);
            return (
              <button
                key={value}
                data-active={active}
                onClick={() => toggleCriticality(value)}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-semibold border transition-all duration-200",
                  color,
                  glow
                )}
              >
                {value}
              </button>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
}
