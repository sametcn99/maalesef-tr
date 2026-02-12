import { Button } from "@radix-ui/themes";
import { ArrowRight, Briefcase } from "lucide-react";
import Link from "next/link";
import { JobCard } from "@/components/job/job-card";
import { JobCardSkeleton } from "@/components/job/job-card-skeleton";
import type { Job } from "@/types";

interface FeaturedJobsSectionProps {
  jobs: Job[];
  loading: boolean;
}

export function FeaturedJobsSection({
  jobs,
  loading,
}: FeaturedJobsSectionProps) {
  // Show only first 6 jobs on landing page
  const featuredJobs = jobs.slice(0, 6);

  return (
    <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Popüler Reddedilme Fırsatları
          </h2>
          <p className="text-muted text-lg max-w-2xl">
            En çok başvuru alan ve en hızlı ret cevabı dönen popüler
            pozisyonlar.
          </p>
        </div>
        <Button
          data-umami-event="home_featured_jobs_section_go_jobs_click"
          asChild
          variant="ghost"
          className="text-accent font-semibold group"
        >
          <Link
            data-umami-event="home_featured_jobs_section_go_jobs_click_2"
            href="/jobs"
            className="inline-flex items-center gap-2"
          >
            Tümünü Gör
            <ArrowRight
              className="transition-transform group-hover:translate-x-1"
              size={18}
            />
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Skeletons
            <JobCardSkeleton key={i} />
          ))
        ) : featuredJobs.length > 0 ? (
          featuredJobs.map((job) => <JobCard key={job.id} job={job} />)
        ) : (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-border rounded-xl bg-surface/50">
            <Briefcase className="mx-auto h-12 w-12 text-muted-light mb-4" />
            <h3 className="text-lg font-medium text-foreground">
              Açık İlan Yok
            </h3>
            <p className="text-muted">
              Şu an için reddedilebileceğiniz bir pozisyon bulunmuyor.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
