"use client";

import { useState, useEffect, useCallback } from "react";
import type { Application } from "@/types";
import { getApplications, submitApplication } from "@/lib/api";
import { useAuth } from "@/context/auth-context";

export function useApplications() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    if (!isAuthenticated) {
      setApplications([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await getApplications();
      setApplications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Başvurular yüklenemedi");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (authLoading) return;
    fetchApplications();
  }, [fetchApplications, authLoading]);

  return {
    applications,
    loading: loading || authLoading,
    error,
    refetch: fetchApplications,
  };
}

export function useSubmitApplication() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (
      jobId: string,
      jobTitle: string,
      answers: Record<string, string>,
      cvFile: File | null,
      aiConsent: boolean,
    ): Promise<Application | null> => {
      try {
        setSubmitting(true);
        setError(null);
        const result = await submitApplication(
          jobId,
          jobTitle,
          answers,
          cvFile,
          aiConsent,
        );
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Başvuru gönderilemedi");
        return null;
      } finally {
        setSubmitting(false);
      }
    },
    [],
  );

  return { submit, submitting, error };
}
