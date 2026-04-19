import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: "blue" | "rose" | "emerald" | "none";
  padding?: "sm" | "md" | "lg";
}

export function GlassCard({
  children,
  className,
  glow = "none",
  padding = "md",
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-xl shadow-glass transition-shadow duration-300",
        "before:absolute before:inset-0 before:rounded-2xl before:bg-glass-shine before:pointer-events-none",
        glow === "blue" && "shadow-glow-blue",
        glow === "rose" && "shadow-glow-rose",
        padding === "sm" && "p-4",
        padding === "md" && "p-6",
        padding === "lg" && "p-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
