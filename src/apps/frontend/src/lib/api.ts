import { env } from "@/lib/env";
import type { Application, CreateJobPayload, Job, Notification } from "@/types";

const BASE_URL = env.NEXT_PUBLIC_API_URL;

let accessTokenCache: string | null = null;
let refreshPromise: Promise<string> | null = null;

export function setAccessToken(token: string | null) {
  accessTokenCache = token;
}

async function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = request<{ accessToken: string }>("/auth/refresh", {
      method: "POST",
    })
      .then((result) => {
        setAccessToken(result.accessToken);
        return result.accessToken;
      })
      .catch(() => {
        setAccessToken(null);
        throw { status: 401, message: "Oturum süresi doldu." };
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    ...(options?.headers as Record<string, string>),
  };

  if (accessTokenCache) {
    headers.Authorization = `Bearer ${accessTokenCache}`;
  }

  // Don't set Content-Type for FormData — browser sets it with boundary
  if (!(options?.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include", // Required for HttpOnly refresh cookie
  });

  if (!res.ok) {
    const error = await res
      .json()
      .catch(() => ({ message: "Bir hata oluştu" }));

    // Transparent refresh for 401s (except on auth endpoints themselves)
    if (res.status === 401 && !path.startsWith("/auth/")) {
      try {
        await refreshAccessToken();
      } catch {
        throw { status: 401, message: "Oturum süresi doldu." };
      }

      // Retry the original request with refreshed access token
      return request<T>(path, options);
    }

    if (res.status === 401) {
      throw { status: 401, message: error.message || "Unauthorized" };
    }

    throw new Error(error.message || `HTTP ${res.status}`);
  }

  if (res.status === 204) {
    // No content responses still count as success for mutation endpoints
    return undefined as T;
  }

  return res.json();
}

export async function refresh(): Promise<{ accessToken: string }> {
  const accessToken = await refreshAccessToken();
  return { accessToken };
}

export async function logout(): Promise<void> {
  await request<void>("/auth/logout", { method: "POST" });
  setAccessToken(null);
}

export async function getJobs(): Promise<Job[]> {
  return request<Job[]>("/jobs");
}

export async function getJob(id: string): Promise<Job> {
  return request<Job>(`/jobs/${id}`);
}

export async function getMyJobs(): Promise<Job[]> {
  return request<Job[]>("/jobs/mine");
}

export async function deleteJob(id: string): Promise<void> {
  await request<void>(`/jobs/${id}`, { method: "DELETE" });
}

export async function createJob(payload: CreateJobPayload): Promise<Job> {
  return request<Job>("/jobs", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getApplications(): Promise<Application[]> {
  return request<Application[]>("/applications");
}

export async function submitApplication(
  jobId: string,
  jobTitle: string,
  answers: Record<string, string>,
  cvFile: File | null,
  aiConsent: boolean,
): Promise<Application> {
  if (!cvFile) {
    throw new Error("Başvuru yapabilmek için CV yüklemeniz gerekiyor.");
  }

  const form = new FormData();
  form.append("jobId", jobId);
  form.append("jobTitle", jobTitle);
  form.append("answers", JSON.stringify(answers));
  form.append("aiConsent", String(aiConsent));
  form.append("cvFile", cvFile);

  return request<Application>("/applications", {
    method: "POST",
    body: form,
  });
}

export async function getNotifications(): Promise<Notification[]> {
  return request<Notification[]>("/notifications");
}

export async function markNotificationAsRead(id: string): Promise<void> {
  await request<void>(`/notifications/${id}/read`, { method: "PATCH" });
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await request<void>("/notifications/read-all", { method: "PATCH" });
}

export async function getStats(): Promise<{
  rejectedCount: number;
  rejectionRate: number;
  averageTurnaroundTime: string;
}> {
  return request<{
    rejectedCount: number;
    rejectionRate: number;
    averageTurnaroundTime: string;
  }>("/stats");
}

export async function login(
  email: string,
  password: string,
): Promise<{
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    notificationEmailEnabled: boolean;
  };
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
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    notificationEmailEnabled: boolean;
  };
  accessToken: string;
  message?: string;
}> {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function getProfile(): Promise<{
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  notificationEmailEnabled: boolean;
}> {
  return request("/auth/profile");
}

export async function resendVerificationEmail(): Promise<{ message: string }> {
  return request("/auth/resend-verification", { method: "POST" });
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

export interface VisibilitySettings {
  showApplications: boolean;
  showRejections: boolean;
  showRecentActivity: boolean;
  showJobs: boolean;
  showBio: boolean;
  showBadges: boolean;
}

export interface ProfileSettings {
  slug: string | null;
  bio: string | null;
  visibilitySettings: VisibilitySettings;
}

export async function getProfileSettings(): Promise<ProfileSettings> {
  return request<ProfileSettings>("/profiles/me");
}

export async function updateProfileSettings(payload: {
  bio?: string | null;
  visibilitySettings?: Partial<VisibilitySettings>;
}): Promise<ProfileSettings> {
  return request<ProfileSettings>("/profiles/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function enableProfileSharing(): Promise<ProfileSettings> {
  return request<ProfileSettings>("/profiles/share", { method: "POST" });
}

export async function disableProfileSharing(): Promise<ProfileSettings> {
  return request<ProfileSettings>("/profiles/share", { method: "DELETE" });
}

import type { PublicProfile } from "@/types";

export async function getPublicProfile(slug: string): Promise<PublicProfile> {
  return request<PublicProfile>(`/profiles/public/${slug}`);
}

import type { Badge } from "@/types";

export async function getBadges(): Promise<Badge[]> {
  return request<Badge[]>("/badges");
}

export async function trackShare(): Promise<void> {
  await request<void>("/badges/track-share", { method: "POST" });
}
