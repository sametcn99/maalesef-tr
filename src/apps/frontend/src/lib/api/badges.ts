import type { Badge } from "@/types";
import { request } from "./core";

export async function getBadges(): Promise<Badge[]> {
  return request<Badge[]>("/badges");
}

export async function trackShare(): Promise<void> {
  await request<void>("/badges/track-share", { method: "POST" });
}
