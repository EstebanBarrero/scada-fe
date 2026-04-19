import EtlTrigger from "../components/etl/EtlTrigger";
import CriticalityPie from "../components/metrics/CriticalityPie";
import TimelineChart from "../components/metrics/TimelineChart";
import TopTagsChart from "../components/metrics/TopTagsChart";

export default function Dashboard() {
  return (
    <div className="relative min-h-screen">
      {/* Ambient background glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 bg-indigo-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-cyan-600/6 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-screen-2xl mx-auto p-6 space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Real-time SCADA alarm analytics</p>
        </div>

        <EtlTrigger />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopTagsChart />
          <CriticalityPie />
        </div>

        <TimelineChart />
      </div>
    </div>
  );
}
