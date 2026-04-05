"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useAuth } from "@/context/auth-context";
import { useNotificationsStore } from "@/stores/notifications-store";

export function useNotifications() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    notifications,
    loading,
    error,
    hasFetched,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    reset,
  } = useNotificationsStore(
    useShallow((state) => ({
      notifications: state.notifications,
      loading: state.loading,
      error: state.error,
      hasFetched: state.hasFetched,
      fetchNotifications: state.fetchNotifications,
      markAsRead: state.markAsRead,
      markAllAsRead: state.markAllAsRead,
      reset: state.reset,
    })),
  );

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      reset();
      return;
    }

    if (!hasFetched) {
      void fetchNotifications();
    }
  }, [authLoading, fetchNotifications, hasFetched, isAuthenticated, reset]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications],
  );

  const refetch = useCallback(async () => {
    await fetchNotifications({ force: true });
  }, [fetchNotifications]);

  return {
    notifications,
    loading: loading || authLoading,
    error,
    unreadCount,
    refetch,
    markAsRead,
    markAllAsRead,
  };
}
