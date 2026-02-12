"use client";

import { Button } from "@radix-ui/themes";
import { NotificationList } from "@/components/ui/notification-list";
import { NotificationSkeleton } from "@/components/ui/skeletons";
import { ErrorCard } from "@/components/ui/error-card";
import type { Notification } from "@/types";

interface NotificationsTabProps {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export function NotificationsTab({
  notifications,
  loading,
  error,
  unreadCount,
  markAsRead,
  markAllAsRead,
}: NotificationsTabProps) {
  if (error) return <ErrorCard message={error} />;

  if (loading) return <NotificationSkeleton />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted">
          {unreadCount > 0
            ? `${unreadCount} okunmamış bildirim var`
            : "Tüm bildirimler okundu"}
        </div>
        <Button
          data-umami-event="profile_notifications_mark_all_read_click"
          variant="soft"
          color="gray"
          disabled={unreadCount === 0}
          onClick={markAllAsRead}
        >
          Tümünü okundu yap
        </Button>
      </div>
      <NotificationList notifications={notifications} onMarkRead={markAsRead} />
    </div>
  );
}
