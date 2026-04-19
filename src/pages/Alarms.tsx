import { useState } from "react";
import AlarmFiltersPanel from "../components/alarms/AlarmFilters";
import AlarmTable from "../components/alarms/AlarmTable";
import { GlassCard } from "../components/ui/glass-card";
import { useAlarms } from "../hooks/useAlarms";
import type { AlarmFilters } from "../types/alarm";

export default function AlarmsPage() {
  const [filters, setFilters] = useState<AlarmFilters>({ page: 1, size: 50 });
  const { data, isLoading, isPlaceholderData } = useAlarms(filters);

  return (
    <div className="relative min-h-screen">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-20 right-1/4 w-80 h-80 bg-blue-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-20 w-64 h-64 bg-indigo-600/6 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-screen-2xl mx-auto p-6 space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Alarm Log</h1>
          <p className="text-slate-500 text-sm mt-0.5">Browse and filter historical alarms</p>
        </div>

        <AlarmFiltersPanel filters={filters} onChange={setFilters} />

        {data ? (
          <AlarmTable
            alarms={data.data}
            meta={data.meta}
            filters={filters}
            onFiltersChange={setFilters}
            isLoading={isLoading || isPlaceholderData}
          />
        ) : (
          <GlassCard>
            <div className="text-center text-slate-500 py-12 text-sm">
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-400 rounded-full animate-spin" />
                  Loading alarms…
                </div>
              ) : (
                "No data available. Run ETL first."
              )}
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
