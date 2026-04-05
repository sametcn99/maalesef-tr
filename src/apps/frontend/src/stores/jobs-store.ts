"use client";

import { create } from "zustand";
import type {
  Job,
  JobInteractionFilter,
  JobsQueryParams,
  JobSortOption,
} from "@/types";
import { deleteJob, getJob, getJobs, getMyJobs } from "@/lib/api";

type FetchMode = "replace" | "append";

export interface JobsListState {
  jobs: Job[];
  page: number;
  total: number;
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasFetched: boolean;
}

export interface JobDetailState {
  job: Job | null;
  loading: boolean;
  error: string | null;
  hasFetched: boolean;
}

interface JobsStoreState {
  lists: Record<string, JobsListState>;
  jobDetails: Record<string, JobDetailState>;
  myJobs: Job[];
  myJobsLoading: boolean;
  myJobsError: string | null;
  myJobsFetched: boolean;
  fetchJobsList: (
    key: string,
    params: JobsQueryParams,
    options?: {
      mode?: FetchMode;
      personalized?: boolean;
    },
  ) => Promise<void>;
  abortJobsList: (key: string) => void;
  resetJobsList: (key: string) => void;
  fetchMyJobs: () => Promise<void>;
  removeMyJob: (id: string) => Promise<void>;
  resetMyJobs: () => void;
  fetchJobDetail: (id: string) => Promise<void>;
  setJobDetail: (id: string, job: Job) => void;
}

export const DEFAULT_JOBS_LIST_STATE: JobsListState = {
  jobs: [],
  page: 1,
  total: 0,
  hasMore: false,
  loading: false,
  loadingMore: false,
  error: null,
  hasFetched: false,
};

export const DEFAULT_JOB_DETAIL_STATE: JobDetailState = {
  job: null,
  loading: false,
  error: null,
  hasFetched: false,
};

const listControllers = new Map<string, AbortController>();
const listRequestIds = new Map<string, number>();

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function mergeJobs(existing: Job[], incoming: Job[]) {
  const merged = new Map(existing.map((job) => [job.id, job]));

  for (const job of incoming) {
    merged.set(job.id, job);
  }

  return Array.from(merged.values());
}

function getListState(
  lists: Record<string, JobsListState>,
  key: string,
): JobsListState {
  return lists[key] ?? DEFAULT_JOBS_LIST_STATE;
}

function getDetailState(
  jobDetails: Record<string, JobDetailState>,
  key: string,
): JobDetailState {
  return jobDetails[key] ?? DEFAULT_JOB_DETAIL_STATE;
}

export function buildJobsListKey(options: {
  limit: number;
  search?: string;
  company?: string;
  location?: string;
  sort?: JobSortOption;
  applied?: JobInteractionFilter;
  viewed?: JobInteractionFilter;
  personalized?: boolean;
}) {
  return [
    options.personalized ? "feed" : "jobs",
    String(options.limit),
    options.search?.trim() ?? "",
    options.company?.trim() ?? "",
    options.location?.trim() ?? "",
    options.sort ?? "newest",
    options.applied ?? "",
    options.viewed ?? "",
  ].join("::");
}

export const useJobsStore = create<JobsStoreState>((set, get) => ({
  lists: {},
  jobDetails: {},
  myJobs: [],
  myJobsLoading: false,
  myJobsError: null,
  myJobsFetched: false,

  fetchJobsList: async (key, params, options) => {
    const mode = options?.mode ?? "replace";

    if (mode === "replace") {
      listControllers.get(key)?.abort();
    }

    const controller = new AbortController();
    listControllers.set(key, controller);

    const requestId = (listRequestIds.get(key) ?? 0) + 1;
    listRequestIds.set(key, requestId);

    set((state) => {
      const current = getListState(state.lists, key);

      return {
        lists: {
          ...state.lists,
          [key]: {
            ...current,
            error: null,
            loading: mode === "replace",
            loadingMore: mode === "append",
          },
        },
      };
    });

    try {
      const response = await getJobs(params, {
        personalized: options?.personalized,
        signal: controller.signal,
      });

      if (controller.signal.aborted || listRequestIds.get(key) !== requestId) {
        return;
      }

      set((state) => {
        const current = getListState(state.lists, key);

        return {
          lists: {
            ...state.lists,
            [key]: {
              ...current,
              jobs:
                mode === "append"
                  ? mergeJobs(current.jobs, response.items)
                  : response.items,
              page: response.page,
              total: response.total,
              hasMore: response.hasMore,
              loading: false,
              loadingMore: false,
              error: null,
              hasFetched: true,
            },
          },
        };
      });
    } catch (error) {
      if (controller.signal.aborted || listRequestIds.get(key) !== requestId) {
        return;
      }

      set((state) => {
        const current = getListState(state.lists, key);

        return {
          lists: {
            ...state.lists,
            [key]: {
              ...current,
              loading: false,
              loadingMore: false,
              error: getErrorMessage(error, "İlanlar yüklenemedi"),
            },
          },
        };
      });
    } finally {
      if (listControllers.get(key) === controller) {
        listControllers.delete(key);
      }
    }
  },

  abortJobsList: (key) => {
    listControllers.get(key)?.abort();
    listControllers.delete(key);

    set((state) => {
      const current = state.lists[key];

      if (!current) {
        return state;
      }

      return {
        lists: {
          ...state.lists,
          [key]: {
            ...current,
            loading: false,
            loadingMore: false,
          },
        },
      };
    });
  },

  resetJobsList: (key) => {
    get().abortJobsList(key);

    set((state) => {
      if (!(key in state.lists)) {
        return state;
      }

      const nextLists = { ...state.lists };
      delete nextLists[key];

      return { lists: nextLists };
    });
  },

  fetchMyJobs: async () => {
    if (get().myJobsLoading) {
      return;
    }

    try {
      set({ myJobsLoading: true, myJobsError: null });
      const jobs = await getMyJobs();

      set({
        myJobs: jobs,
        myJobsLoading: false,
        myJobsError: null,
        myJobsFetched: true,
      });
    } catch (error) {
      set({
        myJobsLoading: false,
        myJobsError: getErrorMessage(error, "İlanlar yüklenemedi"),
      });
    }
  },

  removeMyJob: async (id) => {
    await deleteJob(id);

    set((state) => ({
      myJobs: state.myJobs.filter((job) => job.id !== id),
    }));
  },

  resetMyJobs: () => {
    set({
      myJobs: [],
      myJobsLoading: false,
      myJobsError: null,
      myJobsFetched: false,
    });
  },

  fetchJobDetail: async (id) => {
    const current = get().jobDetails[id];

    if (current?.loading || current?.hasFetched) {
      return;
    }

    set((state) => ({
      jobDetails: {
        ...state.jobDetails,
        [id]: {
          ...getDetailState(state.jobDetails, id),
          loading: true,
          error: null,
        },
      },
    }));

    try {
      const job = await getJob(id);

      set((state) => ({
        jobDetails: {
          ...state.jobDetails,
          [id]: {
            ...getDetailState(state.jobDetails, id),
            job,
            loading: false,
            error: null,
            hasFetched: true,
          },
        },
      }));
    } catch (error) {
      set((state) => ({
        jobDetails: {
          ...state.jobDetails,
          [id]: {
            ...getDetailState(state.jobDetails, id),
            loading: false,
            error: getErrorMessage(error, "İlan yüklenemedi"),
            hasFetched: true,
          },
        },
      }));
    }
  },

  setJobDetail: (id, job) => {
    set((state) => ({
      jobDetails: {
        ...state.jobDetails,
        [id]: {
          ...getDetailState(state.jobDetails, id),
          job,
          loading: false,
          error: null,
          hasFetched: true,
        },
      },
    }));
  },
}));
