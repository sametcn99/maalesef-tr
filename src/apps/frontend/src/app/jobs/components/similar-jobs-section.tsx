"use client";

import { Sparkles } from "lucide-react";
import { JobCard, JobCardSkeleton } from "@/components/job";
import type { Job } from "@/types";

const SIMILAR_JOB_SKELETON_KEYS = [
  "similar-job-skeleton-1",
  "similar-job-skeleton-2",
  "similar-job-skeleton-3",
  "similar-job-skeleton-4",
] as const;

interface SimilarJobsSectionProps {
  jobsLoading: boolean;
  similarJobs: Job[];
}

export function SimilarJobsSection({
  jobsLoading,
  similarJobs,
}: SimilarJobsSectionProps) {
  return (
    <section className="mt-16 border-t border-border/80 pt-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-accent/15 bg-accent/6 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            <Sparkles size={14} /> Benzer ilanlar
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Göz atabileceğin diğer pozisyonlar
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Aynı dozda umutsuzluk vaat eden birkaç ilan daha seçtik.
          </p>
        </div>
      </div>

      {jobsLoading && similarJobs.length === 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {SIMILAR_JOB_SKELETON_KEYS.map((skeletonKey) => (
            <JobCardSkeleton key={skeletonKey} />
          ))}
        </div>
      ) : similarJobs.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {similarJobs.map((similarJob) => (
            <JobCard key={similarJob.id} job={similarJob} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-surface/70 p-6 text-sm leading-6 text-muted">
          Şimdilik önerebileceğimiz başka ilan yok. Yeni kurgusal pozisyonlar
          geldikçe bu alan dolacak.
        </div>
      )}
    </section>
  );
}
