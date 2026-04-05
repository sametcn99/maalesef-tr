"use client";

import { create } from "zustand";
import { getStats } from "@/lib/api";

interface Stats {
  rejectedCount: number;
  rejectionRate: number;
  averageTurnaroundTime: string;
}

interface StatsStoreState {
  stats: Stats | null;
  loading: boolean;
  hasFetched: boolean;
  fetchStats: (options?: { force?: boolean }) => Promise<void>;
  reset: () => void;
}

export const useStatsStore = create<StatsStoreState>((set, get) => ({
  stats: null,
  loading: true,
  hasFetched: false,

  fetchStats: async (options) => {
    const { hasFetched, loading } = get();

    if (loading && hasFetched) {
      return;
    }

    if (hasFetched && !options?.force) {
      return;
    }

    try {
      set({ loading: true });
      const stats = await getStats();
      set({ stats, loading: false, hasFetched: true });
    } catch (error) {
      console.error("Failed to fetch stats", error);
      set({ loading: false, hasFetched: true });
    }
  },

  reset: () => {
    set({ stats: null, loading: true, hasFetched: false });
  },
}));
