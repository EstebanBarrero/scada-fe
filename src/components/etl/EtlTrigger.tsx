import { CheckCircle, Play, RefreshCw, XCircle, Zap } from "lucide-react";
import { GlassCard } from "../ui/glass-card";
import { useEtl } from "../../hooks/useEtl";
import type { ETLRunResponse } from "../../types/metrics";
import { cn } from "../../lib/utils";

type StatusKey = "success" | "partial" | "failed";

const STATUS_CONFIG: Record<StatusKey, { icon: typeof CheckCircle; color: string; bg: string; border: string; label: string }> = {
  success: {
    icon: CheckCircle,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    label: "SUCCESS",
  },
  partial: {
    icon: RefreshCw,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    label: "PARTIAL",
  },
  failed: {
    icon: XCircle,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    label: "FAILED",
  },
};

const STATS = (r: ETLRunResponse) => [
  { label: "Raw Ingested",    value: r.raw_count,       color: "text-blue-400" },
  { label: "Loaded",          value: r.loaded_count,    color: "text-emerald-400" },
  { label: "Dupes Removed",   value: r.duplicate_count, color: "text-amber-400" },
  { label: "Rejected",        value: r.rejected_count,  color: "text-rose-400" },
];

export default function EtlTrigger() {
  const { mutate, isPending, data, error, isSuccess } = useEtl();
  const result = data as ETLRunResponse | undefined;
  const statusCfg = result ? STATUS_CONFIG[result.status as StatusKey] : null;

  return (
    <GlassCard glow="blue">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Zap className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-slate-100 font-semibold text-sm">ETL Pipeline</h3>
            <p className="text-slate-500 text-xs mt-0.5">Ingest → Clean → Normalize → Load</p>
          </div>
        </div>

        <button
          onClick={() => mutate()}
          disabled={isPending}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
            isPending
              ? "bg-slate-700/50 text-slate-400 cursor-not-allowed border border-white/[0.06]"
              : "bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 hover:shadow-glow-blue active:scale-95"
          )}
        >
          {isPending ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Play className="w-3.5 h-3.5" />
          )}
          {isPending ? "Running…" : "Run ETL"}
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mt-4 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-rose-300 text-sm flex items-start gap-2">
          <XCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-400" />
          <span>{String(error)}</span>
        </div>
      )}

      {/* Success result */}
      {isSuccess && result && statusCfg && (
        <>
          <div className="mt-5 h-px bg-white/[0.06]" />

          {/* Status + duration */}
          <div className="mt-4 flex items-center gap-3">
            <span className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border",
              statusCfg.bg, statusCfg.color, statusCfg.border
            )}>
              <statusCfg.icon className="w-3 h-3" />
              {statusCfg.label}
            </span>
            <span className="text-slate-500 text-xs">
              {result.duration_seconds}s · {new Date(result.completed_at).toLocaleTimeString()}
            </span>
          </div>

          {/* Stats grid */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STATS(result).map(({ label, value, color }) => (
              <div
                key={label}
                className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 text-center"
              >
                <div className={cn("text-2xl font-bold tabular-nums", color)}>
                  {value.toLocaleString()}
                </div>
                <div className="text-slate-500 text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>

          {/* Warnings */}
          {result.errors.length > 0 && (
            <div className="mt-4 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
              <p className="text-xs font-semibold text-amber-400 mb-2">
                Warnings ({result.errors.length})
              </p>
              <ul className="text-xs text-amber-300/80 space-y-0.5 max-h-24 overflow-y-auto">
                {result.errors.map((e, i) => (
                  <li key={i}>· {e}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </GlassCard>
  );
}
