"use client";

import { create } from "zustand";
import {
  disableProfileSharing,
  enableProfileSharing,
  getProfileSettings,
  type ProfileSettings,
  updateProfileSettings,
  type VisibilitySettings,
} from "@/lib/api";

interface ProfileSettingsStoreState {
  settings: ProfileSettings | null;
  loading: boolean;
  error: string | null;
  hasFetched: boolean;
  localVisibility: VisibilitySettings | null;
  localBio: string;
  saving: boolean;
  isCollapsed: boolean;
  fetchSettings: (options?: { force?: boolean }) => Promise<void>;
  setLocalBio: (value: string) => void;
  setLocalVisibilityField: (
    key: keyof VisibilitySettings,
    value: boolean,
  ) => void;
  toggleSharing: (enabled: boolean) => Promise<void>;
  saveProfile: () => Promise<void>;
  setIsCollapsed: (value: boolean) => void;
  reset: () => void;
}

const initialState = {
  settings: null,
  loading: false,
  error: null,
  hasFetched: false,
  localVisibility: null,
  localBio: "",
  saving: false,
  isCollapsed: false,
};

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function syncDraftState(settings: ProfileSettings | null) {
  return {
    localVisibility: settings?.visibilitySettings ?? null,
    localBio: settings?.bio ?? "",
  };
}

export const useProfileSettingsStore = create<ProfileSettingsStoreState>(
  (set, get) => ({
    ...initialState,

    fetchSettings: async (options) => {
      if (get().loading || (get().hasFetched && !options?.force)) {
        return;
      }

      try {
        set({ loading: true, error: null });
        const settings = await getProfileSettings();

        set({
          settings,
          loading: false,
          error: null,
          hasFetched: true,
          ...syncDraftState(settings),
        });
      } catch (error) {
        set({
          loading: false,
          error: getErrorMessage(error, "Profil ayarları yüklenemedi."),
        });
      }
    },

    setLocalBio: (value) => {
      set({ localBio: value });
    },

    setLocalVisibilityField: (key, value) => {
      set((state) => ({
        localVisibility: state.localVisibility
          ? {
              ...state.localVisibility,
              [key]: value,
            }
          : null,
      }));
    },

    toggleSharing: async (enabled) => {
      try {
        set({ loading: true, error: null });
        const settings = enabled
          ? await enableProfileSharing()
          : await disableProfileSharing();

        set({
          settings,
          loading: false,
          error: null,
          hasFetched: true,
          isCollapsed: enabled ? false : get().isCollapsed,
          ...syncDraftState(settings),
        });
      } catch (error) {
        set({
          loading: false,
          error: getErrorMessage(error, "Profil paylaşımı güncellenemedi."),
        });
      }
    },

    saveProfile: async () => {
      const { settings, localBio, localVisibility } = get();

      if (!settings || !localVisibility) {
        return;
      }

      const previousSettings = settings;
      const optimisticSettings: ProfileSettings = {
        ...settings,
        bio: localBio,
        visibilitySettings: localVisibility,
      };

      set({
        settings: optimisticSettings,
        saving: true,
        error: null,
      });

      try {
        const updatedSettings = await updateProfileSettings({
          bio: localBio,
          visibilitySettings: localVisibility,
        });

        set({
          settings: updatedSettings,
          saving: false,
          error: null,
          ...syncDraftState(updatedSettings),
        });
      } catch (error) {
        set({
          settings: previousSettings,
          saving: false,
          error: getErrorMessage(error, "Profil ayarları kaydedilemedi."),
          ...syncDraftState(previousSettings),
        });
      }
    },

    setIsCollapsed: (value) => {
      set({ isCollapsed: value });
    },

    reset: () => {
      set(initialState);
    },
  }),
);
