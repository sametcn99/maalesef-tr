"use client";

import { create } from "zustand";
import type { Notification } from "@/types";
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/lib/api";
import { useAuthStore } from "./auth-store";

interface NotificationsStoreState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  hasFetched: boolean;
  fetchNotifications: (options?: { force?: boolean }) => Promise<void>;
  upsertNotification: (notification: Notification) => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  reset: () => void;
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export const useNotificationsStore = create<NotificationsStoreState>(
  (set, get) => ({
    notifications: [],
    loading: false,
    error: null,
    hasFetched: false,

    fetchNotifications: async (options) => {
      const { loading, hasFetched } = get();
      const isAuthenticated = Boolean(
        useAuthStore.getState().user && useAuthStore.getState().accessToken,
      );

      if (!isAuthenticated) {
        set({
          notifications: [],
          loading: false,
          error: null,
          hasFetched: false,
        });
        return;
      }

      if (loading || (hasFetched && !options?.force)) {
        return;
      }

      try {
        set({ loading: true, error: null });
        const notifications = await getNotifications();
        set({ notifications, loading: false, hasFetched: true });
      } catch (error) {
        set({
          loading: false,
          error: getErrorMessage(error, "Bildirimler yüklenemedi"),
        });
      }
    },

    upsertNotification: (notification) => {
      set((state) => {
        const index = state.notifications.findIndex(
          (entry) => entry.id === notification.id,
        );

        if (index === -1) {
          return {
            error: null,
            notifications: [notification, ...state.notifications],
          };
        }

        return {
          error: null,
          notifications: state.notifications.map((entry) =>
            entry.id === notification.id
              ? { ...entry, ...notification }
              : entry,
          ),
        };
      });
    },

    markAsRead: async (id) => {
      const isAuthenticated = Boolean(
        useAuthStore.getState().user && useAuthStore.getState().accessToken,
      );

      if (!isAuthenticated) {
        return;
      }

      set((state) => ({
        notifications: state.notifications.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification,
        ),
      }));

      try {
        await markNotificationAsRead(id);
      } catch (error) {
        set({
          error: getErrorMessage(error, "Bildirim güncellenemedi"),
        });
        await get().fetchNotifications({ force: true });
      }
    },

    markAllAsRead: async () => {
      const isAuthenticated = Boolean(
        useAuthStore.getState().user && useAuthStore.getState().accessToken,
      );

      if (!isAuthenticated) {
        return;
      }

      set((state) => ({
        notifications: state.notifications.map((notification) => ({
          ...notification,
          read: true,
        })),
      }));

      try {
        await markAllNotificationsAsRead();
      } catch (error) {
        set({
          error: getErrorMessage(error, "Bildirimler güncellenemedi"),
        });
        await get().fetchNotifications({ force: true });
      }
    },

    reset: () => {
      set({
        notifications: [],
        loading: false,
        error: null,
        hasFetched: false,
      });
    },
  }),
);
