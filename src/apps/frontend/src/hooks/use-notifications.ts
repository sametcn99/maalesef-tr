"use client";

import { useState, useEffect, useCallback } from "react";
import type { Notification } from "@/types";
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/lib/api";
import { useAuth } from "@/context/auth-context";

export function useNotifications() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bildirimler yüklenemedi");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (authLoading) return;
    fetchNotifications();
  }, [fetchNotifications, authLoading]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback(
    async (id: string) => {
      if (!isAuthenticated) return;

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );

      try {
        await markNotificationAsRead(id);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Bildirim güncellenemedi",
        );
        // Ensure UI stays consistent with server state after a failed optimistic update
        fetchNotifications();
      }
    },
    [fetchNotifications, isAuthenticated],
  );

  const markAllAsRead = useCallback(async () => {
    if (!isAuthenticated) return;

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    try {
      await markAllNotificationsAsRead();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Bildirimler güncellenemedi",
      );
      fetchNotifications();
    }
  }, [fetchNotifications, isAuthenticated]);

  return {
    notifications,
    loading: loading || authLoading,
    error,
    unreadCount,
    refetch: fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
}
