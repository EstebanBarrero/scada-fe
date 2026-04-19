import { Activity } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";

export default function Header() {
  const { pathname } = useLocation();

  const navLink = (to: string, label: string) => (
    <Link
      to={to}
      className={cn(
        "px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
        pathname === to
          ? "bg-blue-500/20 text-blue-300 border border-blue-500/30 shadow-[0_0_12px_rgba(59,130,246,0.2)]"
          : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] border border-transparent"
      )}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-black/40 backdrop-blur-xl">
      <div className="max-w-screen-2xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Activity className="w-4 h-4 text-blue-400" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full">
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
            </span>
          </div>
          <div>
            <span className="font-bold text-slate-100 text-sm tracking-wider">SCADA</span>
            <span className="text-slate-500 text-xs ml-1.5 font-normal tracking-widest uppercase">Alarm System</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex gap-1">
          {navLink("/", "Dashboard")}
          {navLink("/alarms", "Alarms")}
        </nav>
      </div>
    </header>
  );
}
