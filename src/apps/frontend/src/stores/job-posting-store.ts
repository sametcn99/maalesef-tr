"use client";

import { create } from "zustand";
import type { CreateJobPayload, Job, User } from "@/types";
import { createJob as createJobApi } from "@/lib/api";
import { useAuthStore } from "./auth-store";

interface JobPostingStoreState {
  userJobs: Job[];
  addJob: (input: CreateJobPayload) => Promise<Job>;
  removeJob: (id: string) => void;
  syncOwner: (user: User | null) => void;
  clear: () => void;
}

function getOwner(user: User | null) {
  if (!user) {
    return undefined;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    slug: user.slug ?? null,
  };
}

export const useJobPostingStore = create<JobPostingStoreState>((set) => ({
  userJobs: [],

  addJob: async (input) => {
    const owner = getOwner(useAuthStore.getState().user ?? null);

    const optimisticJob: Job = {
      id: `user-job-${Date.now()}`,
      slug: null,
      ...input,
      createdAt: new Date().toISOString(),
      createdBy: owner,
    };

    try {
      const created = await createJobApi(input);
      const normalized: Job = {
        ...created,
        createdBy: created.createdBy ?? owner,
      };

      set((state) => ({
        userJobs: [
          normalized,
          ...state.userJobs.filter((job) => job.id !== normalized.id),
        ],
      }));

      return normalized;
    } catch (error) {
      set((state) => ({
        userJobs: [optimisticJob, ...state.userJobs],
      }));

      console.error("İlan oluşturulamadı:", error);
      throw error instanceof Error
        ? error
        : new Error("İlan oluşturma işlemi tamamlanamadı.");
    }
  },

  removeJob: (id) => {
    set((state) => ({
      userJobs: state.userJobs.filter((job) => job.id !== id),
    }));
  },

  syncOwner: (user) => {
    if (!user) {
      return;
    }

    set((state) => ({
      userJobs: state.userJobs.map((job) => {
        if (job.createdBy) {
          return job;
        }

        return {
          ...job,
          createdBy: {
            id: user.id,
            name: user.name,
            email: user.email,
            slug: user.slug ?? null,
          },
        };
      }),
    }));
  },

  clear: () => {
    set({ userJobs: [] });
  },
}));
