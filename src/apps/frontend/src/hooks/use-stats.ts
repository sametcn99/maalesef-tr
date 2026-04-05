"use client";

import { useEffect } from "react";
import { useStatsStore } from "@/stores/stats-store";

export function useStats() {
  const stats = useStatsStore((state) => state.stats);
  const loading = useStatsStore((state) => state.loading);
  const hasFetched = useStatsStore((state) => state.hasFetched);
  const fetchStats = useStatsStore((state) => state.fetchStats);

  useEffect(() => {
    if (!hasFetched) {
      void fetchStats();
    }
  }, [fetchStats, hasFetched]);

  return { stats, loading };
}
