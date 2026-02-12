import { useState, useEffect } from "react";
import {
  type ProfileSettings,
  type VisibilitySettings,
  getProfileSettings,
  updateProfileSettings,
  enableProfileSharing,
  disableProfileSharing,
} from "@/lib/api";

export function useProfileSettings(open: boolean) {
  const [settings, setSettings] = useState<ProfileSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setLoading(true);
      getProfileSettings()
        .then(setSettings)
        .catch((err) => setError(err.message))
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open]);

  const toggleSharing = async (enabled: boolean) => {
    setLoading(true);
    try {
      if (enabled) {
        const newSettings = await enableProfileSharing();
        setSettings(newSettings);
      } else {
        const newSettings = await disableProfileSharing();
        setSettings(newSettings);
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu",
      );
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (payload: {
    bio?: string | null;
    visibilitySettings?: Partial<VisibilitySettings>;
  }) => {
    if (!settings) return;

    const previous = settings;

    // Optimistic update
    const newSettings = { ...settings };
    if (payload.bio !== undefined) newSettings.bio = payload.bio;
    if (payload.visibilitySettings) {
      newSettings.visibilitySettings = {
        ...settings.visibilitySettings,
        ...payload.visibilitySettings,
      };
    }
    setSettings(newSettings);

    try {
      const updated = await updateProfileSettings(payload);
      setSettings(updated);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu",
      );
      setSettings(previous);
    }
  };

  return { settings, loading, error, toggleSharing, updateProfile };
}
