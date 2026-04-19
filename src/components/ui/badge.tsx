import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type BadgeVariant = "critical" | "high" | "medium" | "low" | "unknown" | "success" | "warning" | "info";

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  critical: "bg-rose-500/15 text-rose-400 border-rose-500/30 shadow-[0_0_8px_rgba(244,63,94,0.2)]",
  high:     "bg-orange-500/15 text-orange-400 border-orange-500/30 shadow-[0_0_8px_rgba(249,115,22,0.2)]",
  medium:   "bg-amber-500/15 text-amber-400 border-amber-500/30",
  low:      "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  unknown:  "bg-slate-500/15 text-slate-400 border-slate-500/30",
  success:  "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  warning:  "bg-amber-500/15 text-amber-400 border-amber-500/30",
  info:     "bg-blue-500/15 text-blue-400 border-blue-500/30",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ children, className, variant = "unknown", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border tracking-wide",
        VARIANT_STYLES[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function criticalityVariant(c: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    CRITICAL: "critical",
    HIGH: "high",
    MEDIUM: "medium",
    LOW: "low",
    UNKNOWN: "unknown",
  };
  return map[c] ?? "unknown";
}
