import client from "./client";
import type { ETLRunResponse } from "../types/metrics";

export async function runEtl(): Promise<ETLRunResponse> {
  const res = await client.post<ETLRunResponse>("/etl/run");
  return res.data;
}
