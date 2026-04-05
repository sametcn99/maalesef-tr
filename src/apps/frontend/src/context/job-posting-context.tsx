"use client";

import { useEffect, type ReactNode } from "react";
import type { CreateJobPayload, Job } from "@/types";
import { useShallow } from "zustand/react/shallow";
import { useAuth } from "./auth-context";
import { useJobPostingStore } from "@/stores/job-posting-store";

interface JobPostingContextType {
  userJobs: Job[];
  addJob: (input: CreateJobPayload) => Promise<Job>;
  removeJob: (id: string) => void;
}

export function JobPostingProvider({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const syncOwner = useJobPostingStore((state) => state.syncOwner);
  const clear = useJobPostingStore((state) => state.clear);

  useEffect(() => {
    if (user) {
      syncOwner(user);
      return;
    }

    if (!isLoading) {
      clear();
    }
  }, [clear, isLoading, syncOwner, user]);

  return children;
}

export function useJobPosting(): JobPostingContextType {
  return useJobPostingStore(
    useShallow((state) => ({
      userJobs: state.userJobs,
      addJob: state.addJob,
      removeJob: state.removeJob,
    })),
  );
}
