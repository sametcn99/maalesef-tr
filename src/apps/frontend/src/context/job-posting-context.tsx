"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { CreateJobPayload, Job } from "@/types";
import { createJob as createJobApi } from "@/lib/api";
import { useAuth } from "./auth-context";

interface JobPostingContextType {
  userJobs: Job[];
  addJob: (input: CreateJobPayload) => Promise<Job>;
  removeJob: (id: string) => void;
}

const JobPostingContext = createContext<JobPostingContextType | null>(null);

export function JobPostingProvider({ children }: { children: ReactNode }) {
  const [userJobs, setUserJobs] = useState<Job[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    setUserJobs((prev) => {
      const enriched = prev.map((job) => {
        if (job.createdBy) return job;
        return {
          ...job,
          createdBy: {
            id: user.id,
            name: user.name,
            email: user.email,
            slug: user.slug ?? null,
          },
        };
      });

      return enriched;
    });
  }, [user]);

  const addJob = useCallback(
    async (input: CreateJobPayload): Promise<Job> => {
      const owner =
        user != null
          ? {
              id: user.id,
              name: user.name,
              email: user.email,
              slug: user.slug ?? null,
            }
          : undefined;

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
        setUserJobs((prev) => {
          const next = [
            normalized,
            ...prev.filter((j) => j.id !== normalized.id),
          ];
          return next;
        });
        return normalized;
      } catch (error) {
        // Keep optimistic job in state if backend request fails
        setUserJobs((prev) => {
          const next = [optimisticJob, ...prev];
          return next;
        });
        console.error("İlan oluşturulamadı:", error);
        throw error instanceof Error
          ? error
          : new Error("İlan oluşturma işlemi tamamlanamadı.");
      }
    },
    [user],
  );

  const removeJob = useCallback((id: string) => {
    setUserJobs((prev) => {
      const next = prev.filter((j) => j.id !== id);
      return next;
    });
  }, []);

  return (
    <JobPostingContext.Provider value={{ userJobs, addJob, removeJob }}>
      {children}
    </JobPostingContext.Provider>
  );
}

export function useJobPosting() {
  const ctx = useContext(JobPostingContext);
  if (!ctx) {
    throw new Error("useJobPosting must be used inside JobPostingProvider");
  }
  return ctx;
}
