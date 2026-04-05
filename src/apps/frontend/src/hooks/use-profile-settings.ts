import { useEffect, useMemo } from "react";
import { useProfileSettingsStore } from "@/stores/profile-settings-store";

export function useProfileSettings(open: boolean) {
  const settings = useProfileSettingsStore((state) => state.settings);
  const loading = useProfileSettingsStore((state) => state.loading);
  const error = useProfileSettingsStore((state) => state.error);
  const hasFetched = useProfileSettingsStore((state) => state.hasFetched);
  const localVisibility = useProfileSettingsStore(
    (state) => state.localVisibility,
  );
  const localBio = useProfileSettingsStore((state) => state.localBio);
  const saving = useProfileSettingsStore((state) => state.saving);
  const isCollapsed = useProfileSettingsStore((state) => state.isCollapsed);
  const fetchSettings = useProfileSettingsStore((state) => state.fetchSettings);
  const setLocalBio = useProfileSettingsStore((state) => state.setLocalBio);
  const setLocalVisibilityField = useProfileSettingsStore(
    (state) => state.setLocalVisibilityField,
  );
  const toggleSharing = useProfileSettingsStore((state) => state.toggleSharing);
  const saveProfile = useProfileSettingsStore((state) => state.saveProfile);
  const setIsCollapsed = useProfileSettingsStore(
    (state) => state.setIsCollapsed,
  );

  useEffect(() => {
    if (open && !hasFetched) {
      void fetchSettings();
    }
  }, [fetchSettings, hasFetched, open]);

  const hasChanges = useMemo(
    () =>
      Boolean(
        settings &&
          localVisibility &&
          (JSON.stringify(localVisibility) !==
            JSON.stringify(settings.visibilitySettings) ||
            localBio !== (settings.bio || "")),
      ),
    [localBio, localVisibility, settings],
  );

  return {
    settings,
    loading,
    error,
    localVisibility,
    localBio,
    saving,
    isCollapsed,
    hasChanges,
    toggleSharing,
    setLocalBio,
    setLocalVisibilityField,
    saveProfile,
    setIsCollapsed,
  };
}
