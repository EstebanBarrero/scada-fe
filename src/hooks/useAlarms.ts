import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAlarms } from "../api/alarms";
import type { AlarmFilters } from "../types/alarm";

export function useAlarms(filters: AlarmFilters = {}) {
  return useQuery({
    queryKey: ["alarms", filters],
    queryFn: () => getAlarms(filters),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
