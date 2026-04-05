"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import type { JobInteractionFilter, JobSortOption } from "@/types";
import { useAuth } from "@/context/auth-context";
import { useJobPosting } from "@/context/job-posting-context";
import {
  buildJobsListKey,
  DEFAULT_JOB_DETAIL_STATE,
  DEFAULT_JOBS_LIST_STATE,
  useJobsStore,
} from "@/stores/jobs-store";

interface UseJobsOptions {
  limit?: number;
}

interface UseJobsFeedOptions {
  limit?: number;
  search?: string;
  company?: string;
  location?: string;
  sort?: JobSortOption;
  applied?: JobInteractionFilter;
  viewed?: JobInteractionFilter;
  personalized?: boolean;
  enabled?: boolean;
}

export function useJobs(options: UseJobsOptions = {}) {
  const { limit = 12 } = options;
  const key = useMemo(
    () => buildJobsListKey({ limit, sort: "newest" }),
    [limit],
  );
  const { list, fetchJobsList, abortJobsList } = useJobsStore(
    useShallow((state) => ({
      list: state.lists[key] ?? DEFAULT_JOBS_LIST_STATE,
      fetchJobsList: state.fetchJobsList,
      abortJobsList: state.abortJobsList,
    })),
  );

  useEffect(() => {
    void fetchJobsList(
      key,
      { page: 1, limit, sort: "newest" },
      { mode: "replace" },
    );

    return () => {
      abortJobsList(key);
    };
  }, [abortJobsList, fetchJobsList, key, limit]);

  const refetch = useCallback(async () => {
    await fetchJobsList(
      key,
      { page: 1, limit, sort: "newest" },
      { mode: "replace" },
    );
  }, [fetchJobsList, key, limit]);

  return {
    jobs: list.jobs,
    loading: list.loading,
    error: list.error,
    refetch,
  };
}

export function useJobsFeed(options: UseJobsFeedOptions = {}) {
  const {
    limit = 12,
    search,
    company,
    location,
    sort = "newest",
    applied = "all",
    viewed = "all",
    personalized = false,
    enabled = true,
  } = options;
  const key = useMemo(
    () =>
      buildJobsListKey({
        limit,
        search,
        company,
        location,
        sort,
        applied: personalized ? applied : undefined,
        viewed: personalized ? viewed : undefined,
        personalized,
      }),
    [applied, company, limit, location, personalized, search, sort, viewed],
  );
  const { list, fetchJobsList, abortJobsList, resetJobsList } = useJobsStore(
    useShallow((state) => ({
      list: state.lists[key] ?? DEFAULT_JOBS_LIST_STATE,
      fetchJobsList: state.fetchJobsList,
      abortJobsList: state.abortJobsList,
      resetJobsList: state.resetJobsList,
    })),
  );

  useEffect(() => {
    if (!enabled) {
      resetJobsList(key);
      return;
    }

    void fetchJobsList(
      key,
      {
        page: 1,
        limit,
        search,
        company,
        location,
        sort,
        applied: personalized ? applied : undefined,
        viewed: personalized ? viewed : undefined,
      },
      {
        mode: "replace",
        personalized,
      },
    );

    return () => {
      abortJobsList(key);
    };
  }, [
    abortJobsList,
    applied,
    company,
    enabled,
    fetchJobsList,
    key,
    limit,
    location,
    personalized,
    resetJobsList,
    search,
    sort,
    viewed,
  ]);

  const fetchNextPage = useCallback(async () => {
    if (!enabled || list.loading || list.loadingMore || !list.hasMore) {
      return;
    }

    await fetchJobsList(
      key,
      {
        page: list.page + 1,
        limit,
        search,
        company,
        location,
        sort,
        applied: personalized ? applied : undefined,
        viewed: personalized ? viewed : undefined,
      },
      {
        mode: "append",
        personalized,
      },
    );
  }, [
    applied,
    company,
    enabled,
    fetchJobsList,
    key,
    limit,
    list.hasMore,
    list.loading,
    list.loadingMore,
    list.page,
    location,
    personalized,
    search,
    sort,
    viewed,
  ]);

  const refetch = useCallback(async () => {
    await fetchJobsList(
      key,
      {
        page: 1,
        limit,
        search,
        company,
        location,
        sort,
        applied: personalized ? applied : undefined,
        viewed: personalized ? viewed : undefined,
      },
      {
        mode: "replace",
        personalized,
      },
    );
  }, [
    applied,
    company,
    fetchJobsList,
    key,
    limit,
    location,
    personalized,
    search,
    sort,
    viewed,
  ]);

  if (!enabled) {
    return {
      jobs: DEFAULT_JOBS_LIST_STATE.jobs,
      page: DEFAULT_JOBS_LIST_STATE.page,
      total: DEFAULT_JOBS_LIST_STATE.total,
      hasMore: DEFAULT_JOBS_LIST_STATE.hasMore,
      loading: DEFAULT_JOBS_LIST_STATE.loading,
      loadingMore: DEFAULT_JOBS_LIST_STATE.loadingMore,
      error: DEFAULT_JOBS_LIST_STATE.error,
      fetchNextPage,
      refetch,
    };
  }

  return {
    jobs: list.jobs,
    page: list.page,
    total: list.total,
    hasMore: list.hasMore,
    loading: list.loading,
    loadingMore: list.loadingMore,
    error: list.error,
    fetchNextPage,
    refetch,
  };
}

export function useMyJobs() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { jobs, loading, error, hasFetched, fetchMyJobs, removeMyJob, reset } =
    useJobsStore(
      useShallow((state) => ({
        jobs: state.myJobs,
        loading: state.myJobsLoading,
        error: state.myJobsError,
        hasFetched: state.myJobsFetched,
        fetchMyJobs: state.fetchMyJobs,
        removeMyJob: state.removeMyJob,
        reset: state.resetMyJobs,
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

    void fetchMyJobs();
  }, [authLoading, fetchMyJobs, isAuthenticated, reset]);

  const refetch = useCallback(async () => {
    await fetchMyJobs();
  }, [fetchMyJobs]);

  return {
    jobs,
    loading: authLoading || (isAuthenticated && !hasFetched) || loading,
    error,
    refetch,
    removeJob: removeMyJob,
  };
}

export function useJob(id: string) {
  const { userJobs } = useJobPosting();
  const { jobDetail, fetchJobDetail, setJobDetail } = useJobsStore(
    useShallow((state) => ({
      jobDetail: state.jobDetails[id] ?? DEFAULT_JOB_DETAIL_STATE,
      fetchJobDetail: state.fetchJobDetail,
      setJobDetail: state.setJobDetail,
    })),
  );
  const userJob = useMemo(
    () => userJobs.find((job) => job.id === id || job.slug === id) ?? null,
    [id, userJobs],
  );

  useEffect(() => {
    if (userJob) {
      setJobDetail(id, userJob);
      return;
    }

    void fetchJobDetail(id);
  }, [fetchJobDetail, id, setJobDetail, userJob]);

  return {
    job: userJob ?? jobDetail.job,
    loading: userJob ? false : !jobDetail.hasFetched || jobDetail.loading,
    error: userJob ? null : jobDetail.error,
  };
}
