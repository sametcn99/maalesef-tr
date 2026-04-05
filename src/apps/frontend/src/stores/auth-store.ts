"use client";

import { create } from "zustand";
import type { User } from "@/types";
import {
  changePassword as apiChangePassword,
  deleteAccount as apiDeleteAccount,
  getProfile,
  login as apiLogin,
  logout as apiLogout,
  refresh as apiRefresh,
  register as apiRegister,
  setAccessToken,
  updateAuthSettings as apiUpdateSettings,
} from "@/lib/api";

type AuthActionResult = {
  success: boolean;
  error?: string;
};

interface AuthStoreState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  hasInitialized: boolean;
  initializeAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<AuthActionResult>;
  register: (
    name: string,
    email: string,
    password: string,
  ) => Promise<AuthActionResult>;
  logout: () => Promise<void>;
  deleteAccount: (password: string) => Promise<AuthActionResult>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<AuthActionResult>;
  updateSettings: (dto: {
    notificationEmailEnabled?: boolean;
  }) => Promise<AuthActionResult>;
  reset: () => void;
}

let initializationPromise: Promise<void> | null = null;

function clearAuthState(set: (partial: Partial<AuthStoreState>) => void) {
  setAccessToken(null);
  set({
    user: null,
    accessToken: null,
    isLoading: false,
    hasInitialized: true,
  });
}

function getErrorMessage(error: unknown, fallback: string) {
  return (error as { message?: string })?.message || fallback;
}

export const useAuthStore = create<AuthStoreState>((set, get) => ({
  user: null,
  accessToken: null,
  isLoading: true,
  hasInitialized: false,

  initializeAuth: async () => {
    if (get().hasInitialized) {
      return;
    }

    if (initializationPromise) {
      return initializationPromise;
    }

    set({ isLoading: true });

    initializationPromise = (async () => {
      try {
        const result = await apiRefresh();
        setAccessToken(result.accessToken);

        const profile = await getProfile();

        set({
          user: profile,
          accessToken: result.accessToken,
          isLoading: false,
          hasInitialized: true,
        });
      } catch (error: unknown) {
        if (
          (error as { status?: number })?.status === 401 &&
          !get().user &&
          !get().accessToken
        ) {
          clearAuthState(set);
          return;
        }

        set({
          isLoading: false,
          hasInitialized: true,
        });
      } finally {
        initializationPromise = null;
      }
    })();

    return initializationPromise;
  },

  login: async (email, password) => {
    try {
      const result = await apiLogin(email, password);

      setAccessToken(result.accessToken);
      set({
        user: result.user,
        accessToken: result.accessToken,
        isLoading: false,
        hasInitialized: true,
      });

      return { success: true };
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, "E-posta veya şifre hatalı."),
      };
    }
  },

  register: async (name, email, password) => {
    try {
      const result = await apiRegister(name, email, password);

      setAccessToken(result.accessToken);
      set({
        user: result.user,
        accessToken: result.accessToken,
        isLoading: false,
        hasInitialized: true,
      });

      return { success: true };
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, "Kayıt işlemi başarısız oldu."),
      };
    }
  },

  logout: async () => {
    try {
      await apiLogout();
    } catch {
      // ignore logout API failures, local state must still be cleared
    } finally {
      clearAuthState(set);
    }
  },

  deleteAccount: async (password) => {
    try {
      await apiDeleteAccount(password);
      clearAuthState(set);
      return { success: true };
    } catch (error: unknown) {
      if ((error as { status?: number })?.status === 401) {
        clearAuthState(set);
      }

      return {
        success: false,
        error: getErrorMessage(error, "Hesap silinirken bir sorun oluştu."),
      };
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      await apiChangePassword({ currentPassword, newPassword });
      return { success: true };
    } catch (error: unknown) {
      if ((error as { status?: number })?.status === 401) {
        clearAuthState(set);
      }

      return {
        success: false,
        error: getErrorMessage(
          error,
          "Şifre değiştirilirken bir sorun oluştu.",
        ),
      };
    }
  },

  updateSettings: async (dto) => {
    try {
      await apiUpdateSettings(dto);

      set((state) => ({
        user: state.user ? { ...state.user, ...dto } : null,
      }));

      return { success: true };
    } catch (error: unknown) {
      if ((error as { status?: number })?.status === 401) {
        clearAuthState(set);
      }

      return {
        success: false,
        error: getErrorMessage(
          error,
          "Ayarlar güncellenirken bir sorun oluştu.",
        ),
      };
    }
  },

  reset: () => {
    clearAuthState(set);
  },
}));
