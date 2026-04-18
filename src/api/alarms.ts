import client from "./client";
import type { Alarm, AlarmFilters, PaginatedResponse } from "../types/alarm";

export async function getAlarms(
  filters: AlarmFilters = {}
): Promise<PaginatedResponse<Alarm>> {
  const params: Record<string, string | number | string[]> = {};

  if (filters.start_date) params.start_date = filters.start_date;
  if (filters.end_date) params.end_date = filters.end_date;
  if (filters.tag) params.tag = filters.tag;
  if (filters.criticality?.length) params.criticality = filters.criticality;
  if (filters.page) params.page = filters.page;
  if (filters.size) params.size = filters.size;

  const res = await client.get<PaginatedResponse<Alarm>>("/alarms", { params });
  return res.data;
}

export async function getAlarmById(id: number): Promise<Alarm> {
  const res = await client.get<Alarm>(`/alarms/${id}`);
  return res.data;
}
