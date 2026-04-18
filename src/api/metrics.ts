import client from "./client";
import type {
  CriticalityResponse,
  TimelineInterval,
  TimelineResponse,
  TopTagsResponse,
} from "../types/metrics";

export async function getTopTags(limit = 10): Promise<TopTagsResponse> {
  const res = await client.get<TopTagsResponse>("/metrics/top-tags", {
    params: { limit },
  });
  return res.data;
}

export async function getByCriticality(): Promise<CriticalityResponse> {
  const res = await client.get<CriticalityResponse>("/metrics/by-criticality");
  return res.data;
}

export async function getTimeline(
  interval: TimelineInterval = "day",
  start_date?: string,
  end_date?: string
): Promise<TimelineResponse> {
  const res = await client.get<TimelineResponse>("/metrics/timeline", {
    params: { interval, start_date, end_date },
  });
  return res.data;
}
