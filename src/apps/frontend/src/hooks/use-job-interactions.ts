"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useAuth } from "@/context/auth-context";
import { useJobInteractionsStore } from "@/stores/job-interactions-store";
import { useApplications } from "./use-applications";

export function useViewedJobs() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    viewedJobs,
    loading,
    error,
    hasFetched,
    fetchViewedJobs,
    markViewed,
    reset,
  } = useJobInteractionsStore(
    useShallow((state) => ({
      viewedJobs: state.viewedJobs,
      loading: state.viewedJobsLoading,
      error: state.viewedJobsError,
      hasFetched: state.viewedJobsFetched,
      fetchViewedJobs: state.fetchViewedJobs,
      markViewed: state.markViewed,
      reset: state.reset,
    })),
  );

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      reset();
      return;
    }

    if (!hasFetched) {
      void fetchViewedJobs();
    }
  }, [authLoading, fetchViewedJobs, hasFetched, isAuthenticated, reset]);

  const refetch = useCallback(async () => {
    await fetchViewedJobs({ force: true });
  }, [fetchViewedJobs]);

  return {
    viewedJobs,
    loading: authLoading || (isAuthenticated && !hasFetched) || loading,
    error,
    refetch,
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
