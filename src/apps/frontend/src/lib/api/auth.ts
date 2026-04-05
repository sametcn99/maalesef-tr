import type { User } from "@/types";
import { refreshAccessToken, request, setAccessToken } from "./core";

export async function refresh(): Promise<{ accessToken: string }> {
  const accessToken = await refreshAccessToken();
  return { accessToken };
}

export async function logout(): Promise<void> {
  await request<void>("/auth/logout", { method: "POST" });
  setAccessToken(null);
}

export async function login(
  email: string,
  password: string,
): Promise<{
  user: User;
  accessToken: string;
}> {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(
  name: string,
  email: string,
  password: string,
): Promise<{
  user: User;
  accessToken: string;
  message?: string;
}> {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function getProfile(): Promise<User> {
  return request("/auth/profile");
}

export async function resendVerificationEmail(): Promise<{ message: string }> {
  return request("/auth/resend-verification", { method: "POST" });
}

export async function forgotPassword(
  email: string,
): Promise<{ message: string }> {
  return request("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(payload: {
  token: string;
  newPassword: string;
}): Promise<{ message: string }> {
  return request("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteAccount(
  password: string,
): Promise<{ message: string }> {
  return request("/auth/account", {
    method: "DELETE",
    body: JSON.stringify({ password }),
  });
}

export async function changePassword(payload: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ message: string }> {
  return request("/auth/change-password", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function updateAuthSettings(payload: {
  notificationEmailEnabled?: boolean;
}): Promise<{ message: string }> {
  return request("/auth/settings", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
