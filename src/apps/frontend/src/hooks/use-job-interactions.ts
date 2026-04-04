"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ViewedJob } from "@/types";
import { getViewedJobs, trackJobView } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { useApplications } from "./use-applications";

function mergeViewedJobs(existing: ViewedJob[], incoming: ViewedJob[]) {
  const merged = new Map(existing.map((item) => [item.jobId, item]));

  for (const item of incoming) {
    const current = merged.get(item.jobId);

    if (!current) {
      merged.set(item.jobId, item);
      continue;
    }

    if (
      new Date(item.lastViewedAt).getTime() >=
      new Date(current.lastViewedAt).getTime()
    ) {
      merged.set(item.jobId, item);
    }
  }

  return Array.from(merged.values()).sort(
    (left, right) =>
      new Date(right.lastViewedAt).getTime() -
      new Date(left.lastViewedAt).getTime(),
  );
}

export function useViewedJobs() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [viewedJobs, setViewedJobs] = useState<ViewedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchViewedJobs = useCallback(async () => {
    if (!isAuthenticated) {
      setViewedJobs([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getViewedJobs();
      setViewedJobs((prev) => mergeViewedJobs(prev, data));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "İncelenen ilanlar yüklenemedi",
      );
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    fetchViewedJobs();
  }, [authLoading, fetchViewedJobs]);

  const markViewed = useCallback(
    async (jobId: string) => {
      if (!isAuthenticated) {
        return;
      }

      const optimisticViewedAt = new Date().toISOString();

      setViewedJobs((prev) => {
        const next = prev.filter((item) => item.jobId !== jobId);
        return [{ jobId, lastViewedAt: optimisticViewedAt }, ...next];
      });

      try {
        await trackJobView(jobId);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "İlan görüntülenmesi kaydedilemedi",
        );
      }
    },
    [isAuthenticated],
  );

  return {
    viewedJobs,
    loading: loading || authLoading,
    error,
    refetch: fetchViewedJobs,
    markViewed,
  };
}

export function useJobInteractions() {
  const {
    applications,
    loading: applicationsLoading,
    error: applicationsError,
    refetch: refetchApplications,
  } = useApplications();
  const {
    viewedJobs,
    loading: viewedJobsLoading,
    error: viewedJobsError,
    refetch: refetchViewedJobs,
    markViewed,
  } = useViewedJobs();

  const appliedJobIds = useMemo(
    () => new Set(applications.map((application) => application.jobId)),
    [applications],
  );

  const viewedJobIds = useMemo(
    () => new Set(viewedJobs.map((viewedJob) => viewedJob.jobId)),
    [viewedJobs],
  );

  const isApplied = useCallback(
    (jobId: string) => appliedJobIds.has(jobId),
    [appliedJobIds],
  );

  const isViewed = useCallback(
    (jobId: string) => viewedJobIds.has(jobId),
    [viewedJobIds],
  );

  const refetch = useCallback(async () => {
    await Promise.all([refetchApplications(), refetchViewedJobs()]);
  }, [refetchApplications, refetchViewedJobs]);

  return {
    applications,
    viewedJobs,
    appliedJobIds,
    viewedJobIds,
    isApplied,
    isViewed,
    markViewed,
    loading: applicationsLoading || viewedJobsLoading,
    error: applicationsError ?? viewedJobsError,
    refetch,
  };
}
