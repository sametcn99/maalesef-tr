"use client";

import { JobCardSkeleton } from "@/components/job";

const JOBS_PAGE_FALLBACK_SKELETON_KEYS = [
  "jobs-page-suspense-fallback-1",
  "jobs-page-suspense-fallback-2",
  "jobs-page-suspense-fallback-3",
  "jobs-page-suspense-fallback-4",
  "jobs-page-suspense-fallback-5",
  "jobs-page-suspense-fallback-6",
] as const;

export function JobsPageFallback() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-10 space-y-3">
        <div className="h-10 w-72 rounded-xl bg-surface-hover/70" />
        <div className="h-5 w-96 max-w-full rounded-xl bg-surface-hover/50" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {JOBS_PAGE_FALLBACK_SKELETON_KEYS.map((skeletonKey) => (
          <JobCardSkeleton key={skeletonKey} />
        ))}
      </div>
    </div>
  );
}
