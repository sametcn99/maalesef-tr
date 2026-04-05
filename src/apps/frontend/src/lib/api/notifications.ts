import type { Notification } from "@/types";
import { request } from "./core";

export async function getNotifications(): Promise<Notification[]> {
  return request<Notification[]>("/notifications");
}

export async function markNotificationAsRead(id: string): Promise<void> {
  await request<void>(`/notifications/${id}/read`, { method: "PATCH" });
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await request<void>("/notifications/read-all", { method: "PATCH" });
}
