"use client";

import { useJobs } from "@/hooks";
import { JobCard } from "@/components/job";
import { JobCardSkeleton } from "@/components/job";
import { ErrorCard, EmptyState } from "@/components/ui";
import { Briefcase, Search, PlusCircle, AlertTriangle } from "lucide-react";
import { TextField, Button } from "@radix-ui/themes";
import { useState, useMemo } from "react";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";

export default function JobsPage() {
  const { jobs, loading, error } = useJobs();
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return jobs;
    const q = search.toLowerCase();
    return jobs.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q),
    );
  }, [jobs, search]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* Page header */}
      <div className="animate-fade-in mb-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Açık Pozisyonlar
            </h1>
            <p className="mt-2 text-sm text-muted">
              Mevcut iş ilanlarını inceleyin ve size uygun pozisyona başvurun.
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full sm:w-auto sm:flex-row sm:items-center">
            {isAuthenticated && (
              <Button
                data-umami-event="jobs_go_jobs_new_click"
                asChild
                size="3"
                className="h-11 bg-linear-to-r from-accent to-accent-light font-medium text-white shadow-sm"
              >
                <Link
                  data-umami-event="jobs_go_jobs_new_click_2"
                  href="/jobs/new"
                  className="inline-flex items-center gap-2"
                >
                  <PlusCircle size={18} /> İlan Yayınla
                </Link>
              </Button>
            )}
            <div className="w-full sm:w-80">
              <TextField.Root
                size="3"
                variant="surface"
                className="w-full"
                placeholder="İlan, şirket veya konum ara..."
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearch(e.target.value)
                }
              >
                <TextField.Slot>
                  <Search
                    size={18}
                    className="text-muted-light transition-colors"
                  />
                </TextField.Slot>
                {search && (
                  <TextField.Slot>
                    <button
                      data-umami-event="jobs_search_clear_click"
                      type="button"
                      onClick={() => setSearch("")}
                      className="rounded-full px-1 text-muted-light transition-colors hover:text-foreground"
                    >
                      ×
                    </button>
                  </TextField.Slot>
                )}
              </TextField.Root>
            </div>
          </div>
        </div>

        {!loading && jobs.length > 0 && (
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-muted px-3 py-1 text-xs font-medium text-accent">
              <Briefcase size={12} />
              {filtered.length} açık pozisyon
            </span>
          </div>
        )}
      </div>

      <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50/50 p-4 text-amber-900   ">
        <div className="flex items-start gap-3">
          <AlertTriangle
            size={20}
            className="shrink-0 text-amber-600 dark:text-amber-400 mt-0.5"
          />
          <div className="text-sm leading-relaxed">
            Bu sayfadaki tüm şirketler, pozisyonlar ve ilan detayları tamamen{" "}
            <strong>kurgusaldır</strong>. Gerçek kurum veya kişilerle ilgisi
            yoktur.
          </div>
        </div>
      </div>

      {error && <ErrorCard message={error} />}

      {loading ? (
        <div className="stagger-children grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Skeletons
            <JobCardSkeleton key={`job-skeleton-${i}`} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Briefcase size={48} strokeWidth={1} />}
          title={
            search
              ? "Aradığınız kriterlere uygun ilan bulunamadı."
              : "Şu anda açık pozisyon bulunmuyor."
          }
          description={
            search
              ? "Farklı anahtar kelimelerle tekrar deneyin."
              : "Daha sonra tekrar kontrol edin."
          }
        />
      ) : (
        <div className="stagger-children grid gap-4 sm:grid-cols-2">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
