"use client";

import { JobCardSkeleton } from "@/components/job";

export function JobsPageFallback() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-10 space-y-3">
        <div className="h-10 w-72 rounded-xl bg-surface-hover/70" />
        <div className="h-5 w-96 max-w-full rounded-xl bg-surface-hover/50" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <JobCardSkeleton key={`jobs-page-suspense-fallback-${index}`} />
        ))}
      </div>
    </div>
  );
}