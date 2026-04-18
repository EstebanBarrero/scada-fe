import { useState } from "react";
import AlarmFiltersPanel from "../components/alarms/AlarmFilters";
import AlarmTable from "../components/alarms/AlarmTable";
import { useAlarms } from "../hooks/useAlarms";
import type { AlarmFilters } from "../types/alarm";

export default function AlarmsPage() {
  const [filters, setFilters] = useState<AlarmFilters>({ page: 1, size: 50 });
  const { data, isLoading, isPlaceholderData } = useAlarms(filters);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold text-white">Alarm Log</h1>

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
        <div className="card text-center text-gray-500 py-16">
          {isLoading ? "Loading alarms…" : "No data available. Run ETL first."}
        </div>
      )}
    </div>
  );
}
