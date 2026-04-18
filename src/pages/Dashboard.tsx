import EtlTrigger from "../components/etl/EtlTrigger";
import CriticalityPie from "../components/metrics/CriticalityPie";
import TimelineChart from "../components/metrics/TimelineChart";
import TopTagsChart from "../components/metrics/TopTagsChart";

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold text-white">Dashboard</h1>

      <EtlTrigger />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopTagsChart />
        <CriticalityPie />
      </div>

      <TimelineChart />
    </div>
  );
}
