export type Criticality = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "UNKNOWN";
export type Status = "ACTIVE" | "ACKNOWLEDGED" | "CLEARED";

export interface Tag {
  id: number;
  name: string;
  area: string | null;
  system: string | null;
}

export interface Alarm {
  id: number;
  tag_id: number | null;
  raw_tag: string;
  description: string | null;
  criticality: Criticality;
  timestamp: string;
  value: number | null;
  unit: string | null;
  status: Status;
  source: string | null;
  quality_notes: string | null;
  ingested_at: string;
  tag: Tag | null;
}

export interface Meta {
  page: number;
  size: number;
  total: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: Meta;
}

export interface AlarmFilters {
  start_date?: string;
  end_date?: string;
  criticality?: Criticality[];
  tag?: string;
  page?: number;
  size?: number;
}
