"use client";

import { useCallback, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useAuth } from "@/context/auth-context";
import { useJobInteractionsStore } from "@/stores/job-interactions-store";

export function useApplications() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { applications, loading, error, hasFetched, fetchApplications, reset } =
    useJobInteractionsStore(
      useShallow((state) => ({
        applications: state.applications,
        loading: state.applicationsLoading,
        error: state.applicationsError,
        hasFetched: state.applicationsFetched,
        fetchApplications: state.fetchApplications,
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
      void fetchApplications();
    }
  }, [authLoading, fetchApplications, hasFetched, isAuthenticated, reset]);

  const refetch = useCallback(async () => {
    await fetchApplications({ force: true });
  }, [fetchApplications]);

  return {
    applications,
    loading: authLoading || (isAuthenticated && !hasFetched) || loading,
    error,
    refetch,
  };
}

export function useSubmitApplication() {
  const { submit, submitting, error } = useJobInteractionsStore(
    useShallow((state) => ({
      submit: state.submit,
      submitting: state.submitting,
      error: state.submitError,
    })),
  );

  return { submit, submitting, error };
}
