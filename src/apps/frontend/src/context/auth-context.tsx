"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type { User } from "@/types";
import {
  login as apiLogin,
  register as apiRegister,
  getProfile,
  deleteAccount as apiDeleteAccount,
  changePassword as apiChangePassword,
  updateAuthSettings as apiUpdateSettings,
  setAccessToken,
  refresh as apiRefresh,
  logout as apiLogout,
} from "@/lib/api";

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

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const initialized = useRef(false);

  const handleLogoutLocal = useCallback(() => {
    setUser(null);
    setAccessTokenState(null);
    setAccessToken(null);
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      // ignore
    } finally {
      handleLogoutLocal();
    }
  }, [handleLogoutLocal]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    async function initializeAuth() {
      try {
        const result = await apiRefresh();
        setAccessToken(result.accessToken);
        setAccessTokenState(result.accessToken);

        const profile = await getProfile();
        setUser(profile);
      } catch (err: unknown) {
        if ((err as { status?: number })?.status === 401) {
          handleLogoutLocal();
        }
      } finally {
        setIsLoading(false);
      }
    }

    initializeAuth();
  }, [handleLogoutLocal]);

  const login = useCallback(
    async (
      email: string,
      password: string,
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        const result = await apiLogin(email, password);
        const normalizedUser: User = result.user;

        setAccessToken(result.accessToken);
        setAccessTokenState(result.accessToken);
        setUser(normalizedUser);

        return { success: true };
      } catch (err: unknown) {
        return {
          success: false,
          error:
            (err as { message?: string })?.message ||
            "E-posta veya şifre hatalı.",
        };
      }
    },
    [],
  );

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        const result = await apiRegister(name, email, password);
        const normalizedUser: User = result.user;

        setAccessToken(result.accessToken);
        setAccessTokenState(result.accessToken);
        setUser(normalizedUser);

        return { success: true };
      } catch (err: unknown) {
        return {
          success: false,
          error:
            (err as { message?: string })?.message ||
            "Kayıt işlemi başarısız oldu.",
        };
      }
    },
    [],
  );

  const deleteAccount = useCallback(
    async (password: string): Promise<{ success: boolean; error?: string }> => {
      try {
        await apiDeleteAccount(password);
        handleLogoutLocal();
        return { success: true };
      } catch (err: unknown) {
        if ((err as { status?: number })?.status === 401) {
          handleLogoutLocal();
        }
        return {
          success: false,
          error:
            (err as { message?: string })?.message ||
            "Hesap silinirken bir sorun oluştu.",
        };
      }
    },
    [handleLogoutLocal],
  );

  const changePassword = useCallback(
    async (
      currentPassword: string,
      newPassword: string,
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        await apiChangePassword({ currentPassword, newPassword });
        return { success: true };
      } catch (err: unknown) {
        if ((err as { status?: number })?.status === 401) {
          handleLogoutLocal();
        }
        return {
          success: false,
          error:
            (err as { message?: string })?.message ||
            "Şifre değiştirilirken bir sorun oluştu.",
        };
      }
    },
    [handleLogoutLocal],
  );

  const updateSettings = useCallback(
    async (dto: {
      notificationEmailEnabled?: boolean;
    }): Promise<{ success: boolean; error?: string }> => {
      try {
        await apiUpdateSettings(dto);
        setUser((prev) => (prev ? { ...prev, ...dto } : null));
        return { success: true };
      } catch (err: unknown) {
        if ((err as { status?: number })?.status === 401) {
          handleLogoutLocal();
        }
        return {
          success: false,
          error:
            (err as { message?: string })?.message ||
            "Ayarlar güncellenirken bir sorun oluştu.",
        };
      }
    },
    [handleLogoutLocal],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!user && !!accessToken,
        isLoading,
        login,
        register,
        logout,
        deleteAccount,
        changePassword,
        updateSettings,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
