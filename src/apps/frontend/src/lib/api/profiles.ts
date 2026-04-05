import type { PublicProfile } from "@/types";
import { request } from "./core";

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

export async function getPublicProfile(slug: string): Promise<PublicProfile> {
  return request<PublicProfile>(`/profiles/public/${slug}`);
}
