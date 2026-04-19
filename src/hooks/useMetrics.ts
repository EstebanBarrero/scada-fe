import { useQuery } from "@tanstack/react-query";
import { getByCriticality, getTimeline, getTopTags } from "../api/metrics";
import type { TimelineInterval } from "../types/metrics";

export function useTopTags(limit = 10) {
  return useQuery({
    queryKey: ["metrics", "top-tags", limit],
    queryFn: () => getTopTags(limit),
    staleTime: 60_000,
  });
}

export function useByCriticality() {
  return useQuery({
    queryKey: ["metrics", "by-criticality"],
    queryFn: getByCriticality,
    staleTime: 60_000,
  });
}

export function useTimeline(
  interval: TimelineInterval = "day",
  start_date?: string,
  end_date?: string
) {
  return useQuery({
    queryKey: ["metrics", "timeline", interval, start_date, end_date],
    queryFn: () => getTimeline(interval, start_date, end_date),
    staleTime: 60_000,
  });
}
