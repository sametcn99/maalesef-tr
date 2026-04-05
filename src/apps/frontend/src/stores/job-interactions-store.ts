"use client";

import { create } from "zustand";
import type { Application, ViewedJob } from "@/types";
import {
  getApplications,
  getViewedJobs,
  submitApplication as apiSubmitApplication,
  trackJobView,
} from "@/lib/api";
import { useAuthStore } from "./auth-store";

interface JobInteractionsStoreState {
  applications: Application[];
  applicationsLoading: boolean;
  applicationsError: string | null;
  applicationsFetched: boolean;
  viewedJobs: ViewedJob[];
  viewedJobsLoading: boolean;
  viewedJobsError: string | null;
  viewedJobsFetched: boolean;
  submitting: boolean;
  submitError: string | null;
  fetchApplications: (options?: { force?: boolean }) => Promise<void>;
  fetchViewedJobs: (options?: { force?: boolean }) => Promise<void>;
  submit: (
    jobId: string,
    jobTitle: string,
    answers: Record<string, string>,
    cvFile: File | null,
    aiConsent: boolean,
  ) => Promise<Application | null>;
  markViewed: (jobId: string) => Promise<void>;
  reset: () => void;
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function isAuthenticated() {
  const { user, accessToken } = useAuthStore.getState();
  return Boolean(user && accessToken);
}

function mergeApplications(existing: Application[], incoming: Application[]) {
  const merged = new Map(existing.map((item) => [item.jobId, item]));

  for (const item of incoming) {
    const current = merged.get(item.jobId);

    if (
      !current ||
      new Date(item.appliedAt).getTime() >=
        new Date(current.appliedAt).getTime()
    ) {
      merged.set(item.jobId, item);
    }
  }

  return Array.from(merged.values()).sort(
    (left, right) =>
      new Date(right.appliedAt).getTime() - new Date(left.appliedAt).getTime(),
  );
}

function mergeViewedJobs(existing: ViewedJob[], incoming: ViewedJob[]) {
  const merged = new Map(existing.map((item) => [item.jobId, item]));

  for (const item of incoming) {
    const current = merged.get(item.jobId);

    if (
      !current ||
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

const initialState = {
  applications: [],
  applicationsLoading: false,
  applicationsError: null,
  applicationsFetched: false,
  viewedJobs: [],
  viewedJobsLoading: false,
  viewedJobsError: null,
  viewedJobsFetched: false,
  submitting: false,
  submitError: null,
};

export const useJobInteractionsStore = create<JobInteractionsStoreState>(
  (set, get) => ({
    ...initialState,

    fetchApplications: async (options) => {
      const { applicationsLoading, applicationsFetched } = get();

      if (!isAuthenticated()) {
        set({
          applications: [],
          applicationsLoading: false,
          applicationsError: null,
          applicationsFetched: false,
        });
        return;
      }

      if (applicationsLoading || (applicationsFetched && !options?.force)) {
        return;
      }

      try {
        set({ applicationsLoading: true, applicationsError: null });
        const applications = await getApplications();

        set((state) => ({
          applications: mergeApplications(state.applications, applications),
          applicationsLoading: false,
          applicationsError: null,
          applicationsFetched: true,
        }));
      } catch (error) {
        set({
          applicationsLoading: false,
          applicationsError: getErrorMessage(error, "Başvurular yüklenemedi"),
        });
      }
    },

    fetchViewedJobs: async (options) => {
      const { viewedJobsLoading, viewedJobsFetched } = get();

      if (!isAuthenticated()) {
        set({
          viewedJobs: [],
          viewedJobsLoading: false,
          viewedJobsError: null,
          viewedJobsFetched: false,
        });
        return;
      }

      if (viewedJobsLoading || (viewedJobsFetched && !options?.force)) {
        return;
      }

      try {
        set({ viewedJobsLoading: true, viewedJobsError: null });
        const viewedJobs = await getViewedJobs();

        set((state) => ({
          viewedJobs: mergeViewedJobs(state.viewedJobs, viewedJobs),
          viewedJobsLoading: false,
          viewedJobsError: null,
          viewedJobsFetched: true,
        }));
      } catch (error) {
        set({
          viewedJobsLoading: false,
          viewedJobsError: getErrorMessage(
            error,
            "İncelenen ilanlar yüklenemedi",
          ),
        });
      }
    },

    submit: async (jobId, jobTitle, answers, cvFile, aiConsent) => {
      if (!isAuthenticated()) {
        set({ submitError: "Başvuru yapmak için giriş yapmanız gerekiyor." });
        return null;
      }

      try {
        set({ submitting: true, submitError: null });
        const application = await apiSubmitApplication(
          jobId,
          jobTitle,
          answers,
          cvFile,
          aiConsent,
        );

        set((state) => ({
          applications: mergeApplications(state.applications, [application]),
          applicationsLoading: false,
          applicationsError: null,
          applicationsFetched: state.applicationsFetched,
          submitting: false,
          submitError: null,
        }));

        return application;
      } catch (error) {
        set({
          submitting: false,
          submitError: getErrorMessage(error, "Başvuru gönderilemedi"),
        });

        return null;
      }
    },

    markViewed: async (jobId) => {
      if (!isAuthenticated()) {
        return;
      }

      const optimisticViewedJob = {
        jobId,
        lastViewedAt: new Date().toISOString(),
      };

      set((state) => ({
        viewedJobs: mergeViewedJobs(state.viewedJobs, [optimisticViewedJob]),
        viewedJobsError: null,
        viewedJobsFetched: state.viewedJobsFetched,
      }));

      try {
        await trackJobView(jobId);
      } catch (error) {
        set({
          viewedJobsError: getErrorMessage(
            error,
            "İlan görüntülenmesi kaydedilemedi",
          ),
        });
      }
    },

    reset: () => {
      set(initialState);
    },
  }),
);
