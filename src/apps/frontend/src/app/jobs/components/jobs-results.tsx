"use client";

import type { RefObject } from "react";
import { Button } from "@radix-ui/themes";
import { Briefcase, RefreshCcw } from "lucide-react";
import { JobCard, JobCardSkeleton } from "@/components/job";
import { EmptyState, ErrorCard } from "@/components/ui";
import type { Job } from "@/types";

interface JobsResultsProps {
  jobs: Job[];
  isInitialLoading: boolean;
  showBlockingError: boolean;
  error: string | null;
  emptyStateHasFilters: boolean;
  canUseInteractionFilters: boolean;
  loadMoreRef: RefObject<HTMLDivElement | null>;
  loadingMore: boolean;
  hasMore: boolean;
  onRetry: () => void;
  onRetryMore: () => void;
}

export function JobsResults({
  jobs,
  isInitialLoading,
  showBlockingError,
  error,
  emptyStateHasFilters,
  canUseInteractionFilters,
  loadMoreRef,
  loadingMore,
  hasMore,
  onRetry,
  onRetryMore,
}: JobsResultsProps) {
  if (isInitialLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <JobCardSkeleton key={`job-skeleton-${index}`} />
        ))}
      </div>
    );
  }

  if (showBlockingError) {
    return (
      <div className="space-y-4">
        <ErrorCard message={error ?? "İlanlar yüklenemedi."} />
        <div className="flex justify-center">
          <Button type="button" variant="soft" onClick={onRetry}>
            <RefreshCcw size={14} /> Tekrar dene
          </Button>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <EmptyState
        icon={<Briefcase size={48} strokeWidth={1} />}
        title={
          emptyStateHasFilters
            ? "Seçtiğiniz filtrelere uygun ilan bulunamadı."
            : "Şu anda açık pozisyon bulunmuyor."
        }
        description={
          emptyStateHasFilters
            ? "Aramayı genişletin veya kişisel filtreleri değiştirin."
            : "Daha sonra tekrar kontrol edin."
        }
      />
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            isApplied={canUseInteractionFilters && Boolean(job.isApplied)}
            isViewed={canUseInteractionFilters && Boolean(job.isViewed)}
          />
        ))}
      </div>

      <div ref={loadMoreRef} className="h-1 w-full" aria-hidden="true" />

      {loadingMore && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <JobCardSkeleton key={`jobs-page-more-skeleton-${index}`} />
          ))}
        </div>
      )}

      {error && jobs.length > 0 && (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-4 text-center">
          <p className="text-sm text-muted">
            Sonraki ilanlar yüklenirken bir sorun oluştu.
          </p>
          <Button type="button" variant="soft" onClick={onRetryMore}>
            <RefreshCcw size={14} /> Tekrar dene
          </Button>
        </div>
      )}

      {!hasMore && jobs.length > 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-surface/60 p-4 text-center text-sm text-muted">
          Ulaşılabilir tüm ilanlar yüklendi.
        </div>
      )}
    </>
  );
}