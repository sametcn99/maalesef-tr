"use client";

import { JobDetailMainContent } from "@/app/jobs/components/job-detail-main-content";
import { JobDetailSidebar } from "@/app/jobs/components/job-detail-sidebar";
import { SimilarJobsSection } from "@/app/jobs/components/similar-jobs-section";
import { ErrorCard, DetailSkeleton } from "@/components/ui";
import { useAuth } from "@/context/auth-context";
import { useJob, useJobInteractions, useJobs } from "@/hooks";
import { getRandomJobShareMessage } from "@/lib/job-share-messages";
import type { Job } from "@/types";
import { use, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { job, loading, error } = useJob(id);
  const { jobs, loading: jobsLoading } = useJobs({ limit: 12 });
  const { isAuthenticated } = useAuth();
  const { isApplied, isViewed, markViewed } = useJobInteractions();

  const applied = job ? isApplied(job.id) : false;
  const viewed = job ? isViewed(job.id) : false;
  const shareMessage = useMemo(() => {
    if (!job) {
      return "";
    }

    return getRandomJobShareMessage(job.title);
  }, [job]);

  const similarJobs = useMemo(() => {
    if (!job) return [];

    const candidates = jobs.filter(
      (candidate: Job) =>
        candidate.id !== job.id && (!job.slug || candidate.slug !== job.slug),
    );

    const shuffled = [...candidates];

    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[randomIndex]] = [
        shuffled[randomIndex],
        shuffled[index],
      ];
    }

    return shuffled.slice(0, 4);
  }, [jobs, job]);

  useEffect(() => {
    if (!job || !isAuthenticated) {
      return;
    }

    void markViewed(job.id);
  }, [job, isAuthenticated, markViewed]);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleApply = useCallback(() => {
    if (!job) {
      return;
    }

    if (!isAuthenticated) {
      router.push(`/login?redirect=/jobs/${job.id}/apply`);
      return;
    }

    router.push(`/jobs/${job.id}/apply`);
  }, [isAuthenticated, job, router]);

  const handleOwnerNavigate = useCallback(
    (slug: string) => {
      router.push(`/p/${slug}`);
    },
    [router],
  );

  if (loading && !job) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <DetailSkeleton />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <ErrorCard message={error || "İlan bulunamadı."} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <button
        data-umami-event="jobs_job_back_click"
        type="button"
        onClick={handleBack}
        className="animate-fade-in mb-8 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted transition-all duration-200 hover:bg-surface-hover hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Geri
      </button>

      <div className="animate-fade-in-up flex flex-col gap-8 lg:flex-row lg:gap-12">
        <JobDetailMainContent
          job={job}
          applied={applied}
          viewed={viewed}
          onOwnerNavigate={handleOwnerNavigate}
        />

        <JobDetailSidebar
          isAuthenticated={isAuthenticated}
          shareMessage={shareMessage}
          shareUrl={shareUrl}
          onApply={handleApply}
        />
      </div>

      <SimilarJobsSection jobsLoading={jobsLoading} similarJobs={similarJobs} />
    </div>
  );
}
