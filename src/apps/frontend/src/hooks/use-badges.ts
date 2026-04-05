import { useEffect } from "react";
import { useBadgesStore } from "@/stores/badges-store";

export function useBadges() {
  const badges = useBadgesStore((state) => state.badges);
  const loading = useBadgesStore((state) => state.loading);
  const error = useBadgesStore((state) => state.error);
  const hasFetched = useBadgesStore((state) => state.hasFetched);
  const fetchBadges = useBadgesStore((state) => state.fetchBadges);

  useEffect(() => {
    if (!hasFetched) {
      void fetchBadges();
    }
  }, [fetchBadges, hasFetched]);

  return { badges, loading, error };
}
