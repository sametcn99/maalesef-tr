"use client";

import { ApplicationTable } from "@/components/application";
import { TableSkeleton } from "@/components/ui/skeletons";
import { ErrorCard } from "@/components/ui/error-card";
import type { Application } from "@/types";

interface ApplicationsTabProps {
  applications: Application[];
  loading: boolean;
  error: string | null;
  onRowClick: (application: Application) => void;
}

export function ApplicationsTab({
  applications,
  loading,
  error,
  onRowClick,
}: ApplicationsTabProps) {
  if (error) return <ErrorCard message={error} />;

  if (loading) return <TableSkeleton />;

  return (
    <ApplicationTable applications={applications} onRowClick={onRowClick} />
  );
}
