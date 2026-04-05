"use client";

import { create } from "zustand";
import { forgotPassword, resetPassword } from "@/lib/api";
import { useAuthStore } from "./auth-store";

type AuthActionResult = {
  success: boolean;
  error?: string;
  message?: string;
};

interface AuthFlowsStoreState {
  loginEmail: string;
  loginPassword: string;
  loginLoading: boolean;
  loginError: string | null;
  registerName: string;
  registerEmail: string;
  registerPassword: string;
  registerLoading: boolean;
  registerError: string | null;
  forgotEmail: string;
  forgotLoading: boolean;
  forgotError: string | null;
  forgotSuccessMessage: string | null;
  resetNewPassword: string;
  resetConfirmPassword: string;
  resetLoading: boolean;
  resetError: string | null;
  setLoginEmail: (value: string) => void;
  setLoginPassword: (value: string) => void;
  submitLogin: () => Promise<AuthActionResult>;
  resetLogin: () => void;
  setRegisterName: (value: string) => void;
  setRegisterEmail: (value: string) => void;
  setRegisterPassword: (value: string) => void;
  submitRegister: () => Promise<AuthActionResult>;
  resetRegister: () => void;
  setForgotEmail: (value: string) => void;
  submitForgotPassword: () => Promise<AuthActionResult>;
  resetForgotPassword: () => void;
  setResetNewPassword: (value: string) => void;
  setResetConfirmPassword: (value: string) => void;
  submitResetPassword: (token: string) => Promise<AuthActionResult>;
  resetResetPassword: () => void;
}

const initialState = {
  loginEmail: "",
  loginPassword: "",
  loginLoading: false,
  loginError: null,
  registerName: "",
  registerEmail: "",
  registerPassword: "",
  registerLoading: false,
  registerError: null,
  forgotEmail: "",
  forgotLoading: false,
  forgotError: null,
  forgotSuccessMessage: null,
  resetNewPassword: "",
  resetConfirmPassword: "",
  resetLoading: false,
  resetError: null,
};

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export const useAuthFlowsStore = create<AuthFlowsStoreState>((set, get) => ({
  ...initialState,

  setLoginEmail: (value) => {
    set({ loginEmail: value });
  },

  setLoginPassword: (value) => {
    set({ loginPassword: value });
  },

  submitLogin: async () => {
    set({ loginLoading: true, loginError: null });
    const result = await useAuthStore
      .getState()
      .login(get().loginEmail, get().loginPassword);

    if (result.success) {
      set({
        loginEmail: "",
        loginPassword: "",
        loginLoading: false,
        loginError: null,
      });
      return { success: true };
    }

    set({
      loginLoading: false,
      loginError: result.error ?? "Giriş yapılamadı.",
    });
    return { success: false, error: result.error ?? "Giriş yapılamadı." };
  },

  resetLogin: () => {
    set({
      loginEmail: "",
      loginPassword: "",
      loginLoading: false,
      loginError: null,
    });
  },

  setRegisterName: (value) => {
    set({ registerName: value });
  },

  setRegisterEmail: (value) => {
    set({ registerEmail: value });
  },

  setRegisterPassword: (value) => {
    set({ registerPassword: value });
  },

  submitRegister: async () => {
    set({ registerLoading: true, registerError: null });
    const result = await useAuthStore
      .getState()
      .register(
        get().registerName,
        get().registerEmail,
        get().registerPassword,
      );

    if (result.success) {
      set({
        registerName: "",
        registerEmail: "",
        registerPassword: "",
        registerLoading: false,
        registerError: null,
      });
      return { success: true };
    }

    set({
      registerLoading: false,
      registerError: result.error ?? "Kayıt oluşturulamadı.",
    });
    return {
      success: false,
      error: result.error ?? "Kayıt oluşturulamadı.",
    };
  },

  resetRegister: () => {
    set({
      registerName: "",
      registerEmail: "",
      registerPassword: "",
      registerLoading: false,
      registerError: null,
    });
  },

  setForgotEmail: (value) => {
    set({ forgotEmail: value });
  },

  submitForgotPassword: async () => {
    set({
      forgotLoading: true,
      forgotError: null,
      forgotSuccessMessage: null,
    });

    try {
      const result = await forgotPassword(get().forgotEmail);
      set({
        forgotEmail: "",
        forgotLoading: false,
        forgotError: null,
        forgotSuccessMessage: result.message,
      });
      return { success: true, message: result.message };
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Bir hata oluştu. Lütfen tekrar deneyin.",
      );
      set({
        forgotLoading: false,
        forgotError: message,
      });
      return { success: false, error: message };
    }
  },

  resetForgotPassword: () => {
    set({
      forgotEmail: "",
      forgotLoading: false,
      forgotError: null,
      forgotSuccessMessage: null,
    });
  },

  setResetNewPassword: (value) => {
    set({ resetNewPassword: value });
  },

  setResetConfirmPassword: (value) => {
    set({ resetConfirmPassword: value });
  },

  submitResetPassword: async (token) => {
    const { resetNewPassword, resetConfirmPassword } = get();

    if (!token.trim()) {
      const error = "Şifre sıfırlama bağlantısı eksik veya bozuk görünüyor.";
      set({ resetError: error });
      return { success: false, error };
    }

    if (resetNewPassword !== resetConfirmPassword) {
      const error = "Yeni şifre alanları birbiriyle eşleşmiyor.";
      set({ resetError: error });
      return { success: false, error };
    }

    set({ resetLoading: true, resetError: null });

    try {
      const result = await resetPassword({
        token,
        newPassword: resetNewPassword,
      });

      set({
        resetNewPassword: "",
        resetConfirmPassword: "",
        resetLoading: false,
        resetError: null,
      });

      return { success: true, message: result.message };
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Bir hata oluştu. Lütfen tekrar deneyin.",
      );

      set({
        resetLoading: false,
        resetError: message,
      });

      return { success: false, error: message };
    }
  },

  resetResetPassword: () => {
    set({
      resetNewPassword: "",
      resetConfirmPassword: "",
      resetLoading: false,
      resetError: null,
    });
  },
}));
