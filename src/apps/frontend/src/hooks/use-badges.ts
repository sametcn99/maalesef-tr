import { useState, useEffect } from "react";
import { getBadges } from "@/lib/api";
import type { Badge } from "@/types";

export function useBadges() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBadges() {
      try {
        setLoading(true);
        const data = await getBadges();
        setBadges(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch badges");
        setBadges([]);
      } finally {
        setLoading(false);
      }
    }

    fetchBadges();
  }, []);

  return { badges, loading, error };
}
