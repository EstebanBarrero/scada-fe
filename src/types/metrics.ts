export interface TopTagItem {
  tag_name: string;
  tag_id: number | null;
  alarm_count: number;
  area: string | null;
}

export interface TopTagsResponse {
  data: TopTagItem[];
  limit: number;
}

export interface CriticalityCount {
  criticality: string;
  count: number;
  percentage: number;
}

export interface CriticalityResponse {
  data: CriticalityCount[];
  total: number;
}

export interface TimelinePoint {
  bucket: string;
  count: number;
  critical_count: number;
  high_count: number;
}

export interface TimelineResponse {
  data: TimelinePoint[];
  interval: string;
  start_date: string | null;
  end_date: string | null;
}

export type TimelineInterval = "hour" | "day";

export interface ETLRunResponse {
  status: "success" | "partial" | "failed";
  raw_count: number;
  rejected_count: number;
  duplicate_count: number;
  null_imputed_count: number;
  type_coerced_count: number;
  loaded_count: number;
  tags_created: number;
  tags_reused: number;
  duration_seconds: number;
  errors: string[];
  started_at: string;
  completed_at: string;
}
