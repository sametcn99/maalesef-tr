"use client";

import { create } from "zustand";
import { getBadges } from "@/lib/api";
import type { Badge } from "@/types";

interface BadgesStoreState {
  badges: Badge[];
  loading: boolean;
  error: string | null;
  hasFetched: boolean;
  fetchBadges: (options?: { force?: boolean }) => Promise<void>;
  reset: () => void;
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export const useBadgesStore = create<BadgesStoreState>((set, get) => ({
  badges: [],
  loading: true,
  error: null,
  hasFetched: false,

  fetchBadges: async (options) => {
    const { hasFetched, loading } = get();

    if (loading && hasFetched) {
      return;
    }

    if (hasFetched && !options?.force) {
      return;
    }

    try {
      set({ loading: true, error: null });
      const badges = await getBadges();
      set({ badges, loading: false, error: null, hasFetched: true });
    } catch (error) {
      set({
        badges: [],
        loading: false,
        error: getErrorMessage(error, "Failed to fetch badges"),
        hasFetched: true,
      });
    }
  },

  reset: () => {
    set({ badges: [], loading: true, error: null, hasFetched: false });
  },
}));
