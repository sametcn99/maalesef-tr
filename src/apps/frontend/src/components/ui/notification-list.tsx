"use client";

import { Bell, Mail, MailOpen } from "lucide-react";
import type { Notification } from "@/types";
import { RejectionShare } from "./rejection-share";

interface NotificationListProps {
  notifications: Notification[];
  onMarkRead?: (id: string) => void | Promise<void>;
}

function formatRelativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Az önce";
  if (minutes < 60) return `${minutes} dk önce`;
  if (hours < 24) return `${hours} saat önce`;
  return `${days} gün önce`;
}

export function NotificationList({
  notifications,
  onMarkRead,
}: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-hover text-muted-light">
          <Bell size={22} />
        </div>
        <p className="mt-4 text-sm font-medium text-muted">
          Henüz bildirim yok.
        </p>
        <p className="mt-1 text-xs text-muted-light">
          Başvurularınıza dair geri dönüşler burada görünecektir.
        </p>
      </div>
    );
  }

  return (
    <div className="stagger-children space-y-3">
      {notifications.map((notification) => {
        const titleLower = notification.title.toLowerCase();
        const bodyLower = notification.body.toLowerCase();

        const isRejection =
          titleLower.includes("değerlendirildi") ||
          bodyLower.includes("maalesef");

        const isMilestone =
          titleLower.includes("başarı") ||
          titleLower.includes("milestone") ||
          titleLower.includes("yola devam");

        const isShareable = isRejection || isMilestone;

        return (
          <div
            key={notification.id}
            className={`rounded-xl border transition-all duration-200 hover:shadow-md cursor-default ${
              notification.read
                ? "border-border bg-surface"
                : "border-accent/20 bg-accent-muted/20"
            }`}
          >
            <div className="flex flex-row items-start gap-4 p-5">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  notification.read
                    ? "bg-surface-hover text-muted-light"
                    : "bg-accent-muted text-accent"
                }`}
              >
                {notification.read ? (
                  <MailOpen size={18} />
                ) : (
                  <Mail size={18} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p
                    className={`text-sm leading-snug ${
                      notification.read
                        ? "text-muted"
                        : "font-semibold text-foreground"
                    }`}
                  >
                    {notification.title}
                  </p>
                  <span className="shrink-0 text-[11px] text-muted-light">
                    {formatRelativeTime(notification.createdAt)}
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {notification.body}
                </p>

                {isShareable && (
                  <RejectionShare
                    message={isMilestone ? notification.body : undefined}
                  />
                )}

                {!notification.read && onMarkRead && (
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      data-umami-event="ui_notification_list_okundu_olarak_isaretle_click"
                      type="button"
                      onClick={() => onMarkRead(notification.id)}
                      className="inline-flex h-8 items-center rounded-lg bg-accent text-[12px] font-medium text-white px-3 transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
                    >
                      Okundu olarak işaretle
                    </button>
                    <span className="h-2 w-2 shrink-0 rounded-full bg-accent animate-pulse-subtle" />
                  </div>
                )}
              </div>
              {!notification.read && !onMarkRead && (
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent animate-pulse-subtle" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
