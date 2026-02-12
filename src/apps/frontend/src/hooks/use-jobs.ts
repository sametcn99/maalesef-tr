"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { Job } from "@/types";
import { getJobs, getJob, getMyJobs, deleteJob } from "@/lib/api";
import { useJobPosting } from "@/context/job-posting-context";

export function useJobs() {
  const [apiJobs, setApiJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userJobs } = useJobPosting();

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getJobs();
      setApiJobs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "İlanlar yüklenemedi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const jobs = useMemo(() => {
    const merged = new Map<string, Job>();
    apiJobs.forEach((job) => {
      merged.set(job.id, job);
    });
    userJobs.forEach((job) => {
      merged.set(job.id, job);
    });

    return Array.from(merged.values()).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [userJobs, apiJobs]);

  return { jobs, loading, error, refetch: fetchJobs };
}

export function useMyJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyJobs();
      setJobs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "İlanlar yüklenemedi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyJobs();
  }, [fetchMyJobs]);

  const removeJob = useCallback(async (id: string) => {
    await deleteJob(id);
    setJobs((prev) => prev.filter((j) => j.id !== id));
  }, []);

  return { jobs, loading, error, refetch: fetchMyJobs, removeJob };
}

export function useJob(id: string) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userJobs } = useJobPosting();

  useEffect(() => {
    let cancelled = false;

    // First check user-created jobs (id parameter could be uuid or slug)
    const userJob = userJobs.find((j) => j.id === id || j.slug === id);
    if (userJob) {
      setJob(userJob);
      setLoading(false);
      return;
    }

    async function fetchJob() {
      try {
        setLoading(true);
        setError(null);
        const data = await getJob(id);
        if (!cancelled) setJob(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "İlan yüklenemedi");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchJob();
    return () => {
      cancelled = true;
    };
  }, [id, userJobs]);

  return { job, loading, error };
}
