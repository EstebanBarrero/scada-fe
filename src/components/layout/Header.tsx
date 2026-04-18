import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const { pathname } = useLocation();

  const navLink = (to: string, label: string) => (
    <Link
      to={to}
      className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
        pathname === to
          ? "bg-blue-600 text-white"
          : "text-gray-400 hover:text-white hover:bg-gray-800"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <span className="font-bold text-white tracking-wider text-sm uppercase">
          SCADA Alarm System
        </span>
      </div>
      <nav className="flex gap-2">
        {navLink("/", "Dashboard")}
        {navLink("/alarms", "Alarms")}
      </nav>
    </header>
  );
}
