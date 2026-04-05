"use client";

import { useEffect, type ReactNode } from "react";
import { useShallow } from "zustand/react/shallow";
import type { User } from "@/types";
import { useAuthStore } from "@/stores/auth-store";

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  deleteAccount: (
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<{ success: boolean; error?: string }>;
  updateSettings: (dto: {
    notificationEmailEnabled?: boolean;
  }) => Promise<{ success: boolean; error?: string }>;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    void initializeAuth();
  }, [initializeAuth]);

  return children;
}

export function useAuth(): AuthContextType {
  return useAuthStore(
    useShallow((state) => ({
      user: state.user as User | null,
      accessToken: state.accessToken,
      isAuthenticated: Boolean(state.user && state.accessToken),
      isLoading: state.isLoading,
      login: state.login,
      register: state.register,
      logout: state.logout,
      deleteAccount: state.deleteAccount,
      changePassword: state.changePassword,
      updateSettings: state.updateSettings,
    })),
  );
}
