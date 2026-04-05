import { request } from "./core";

export async function getStats(): Promise<{
  rejectedCount: number;
  rejectionRate: number;
  averageTurnaroundTime: string;
}> {
  return request<{
    rejectedCount: number;
    rejectionRate: number;
    averageTurnaroundTime: string;
  }>("/stats");
}
