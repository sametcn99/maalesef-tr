"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import { useShallow } from "zustand/react/shallow";
import type { Notification } from "@/types";
import { refresh } from "@/lib/api";
import { env } from "@/lib/env";
import { useAuthStore } from "@/stores/auth-store";
import { useNotificationsStore } from "@/stores/notifications-store";

const NOTIFICATIONS_NAMESPACE = "/notifications";
const NOTIFICATION_CREATED_EVENT = "notification.created";
const AUTH_ERROR_PATTERN = /yetki|jwt|token|oturum|unauthorized/i;

export function useNotificationsRealtime() {
  const { accessToken, hasInitialized, isAuthenticated, isLoading, resetAuth } =
    useAuthStore(
      useShallow((state) => ({
        accessToken: state.accessToken,
        hasInitialized: state.hasInitialized,
        isAuthenticated: Boolean(state.user && state.accessToken),
        isLoading: state.isLoading,
        resetAuth: state.reset,
      })),
    );
  const upsertNotification = useNotificationsStore(
    (state) => state.upsertNotification,
  );
  const accessTokenRef = useRef(accessToken);
  const socketRef = useRef<Socket | null>(null);
  const refreshingRef = useRef(false);

  const handleNotificationCreated = useEffectEvent(
    (notification: Notification) => {
      upsertNotification(notification);
    },
  );

  const handleConnectError = useEffectEvent(
    async (socket: Socket, error: Error) => {
      if (refreshingRef.current) {
        return;
      }

      if (!AUTH_ERROR_PATTERN.test(error.message)) {
        return;
      }

      refreshingRef.current = true;

      try {
        const { accessToken: nextAccessToken } = await refresh();
        socket.auth = { token: nextAccessToken };
        socket.connect();
      } catch {
        resetAuth();
      } finally {
        refreshingRef.current = false;
      }
    },
  );

  useEffect(() => {
    accessTokenRef.current = accessToken;

    if (socketRef.current && accessToken) {
      socketRef.current.auth = { token: accessToken };
    }
  }, [accessToken]);

  useEffect(() => {
    if (typeof window === "undefined" || isLoading || !hasInitialized) {
      return;
    }

    if (!isAuthenticated || !accessTokenRef.current) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      return;
    }

    if (socketRef.current) {
      return;
    }

    const socket = io(`${env.NEXT_PUBLIC_API_URL}${NOTIFICATIONS_NAMESPACE}`, {
      auth: { token: accessTokenRef.current },
      autoConnect: false,
      transports: ["websocket"],
      withCredentials: true,
    });

    const onNotificationCreated = (notification: Notification) => {
      handleNotificationCreated(notification);
    };

    const onConnectError = (error: Error) => {
      void handleConnectError(socket, error);
    };

    socket.on(NOTIFICATION_CREATED_EVENT, onNotificationCreated);
    socket.on("connect_error", onConnectError);
    socket.connect();

    socketRef.current = socket;

    return () => {
      socket.off(NOTIFICATION_CREATED_EVENT, onNotificationCreated);
      socket.off("connect_error", onConnectError);
      socket.disconnect();

      if (socketRef.current === socket) {
        socketRef.current = null;
      }
    };
  }, [hasInitialized, isAuthenticated, isLoading]);
}
