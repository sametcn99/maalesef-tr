"use client";

import { useJobInteractions, useJobs } from "@/hooks";
import { JobCard } from "@/components/job";
import { JobCardSkeleton } from "@/components/job";
import { ErrorCard, EmptyState } from "@/components/ui";
import {
  Briefcase,
  Search,
  PlusCircle,
  AlertTriangle,
  Filter,
} from "lucide-react";
import { TextField, Button, Select } from "@radix-ui/themes";
import { useState, useMemo } from "react";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";

type InteractionFilter = "all" | "only" | "hide";

export default function JobsPage() {
  const { jobs, loading, error } = useJobs();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    isApplied,
    isViewed,
    loading: interactionsLoading,
  } = useJobInteractions();
  const [search, setSearch] = useState("");
  const [appliedFilter, setAppliedFilter] = useState<InteractionFilter>("all");
  const [viewedFilter, setViewedFilter] = useState<InteractionFilter>("all");
  const isInitialLoading = loading && jobs.length === 0;
  const canPublishJob = !authLoading && isAuthenticated;
  const canUseInteractionFilters = !authLoading && isAuthenticated;
  const hasInteractionFilters =
    appliedFilter !== "all" || viewedFilter !== "all";

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return jobs.filter((job) => {
      const matchesSearch =
        !search.trim() ||
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q);

      if (!matchesSearch) {
        return false;
      }

      if (!canUseInteractionFilters || interactionsLoading) {
        return true;
      }

      const applied = isApplied(job.id);
      const viewed = isViewed(job.id);

      if (appliedFilter === "only" && !applied) {
        return false;
      }

      if (appliedFilter === "hide" && applied) {
        return false;
      }

      if (viewedFilter === "only" && !viewed) {
        return false;
      }

      if (viewedFilter === "hide" && viewed) {
        return false;
      }

      return true;
    });
  }, [
    jobs,
    search,
    canUseInteractionFilters,
    interactionsLoading,
    isApplied,
    isViewed,
    appliedFilter,
    viewedFilter,
  ]);

  const emptyStateHasFilters = Boolean(search.trim()) || hasInteractionFilters;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* Page header */}
      <div className="mb-10">
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
            {canPublishJob && (
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

        {!isInitialLoading && jobs.length > 0 && (
          <div className="mt-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-muted px-3 py-1 text-xs font-medium text-accent">
                <Briefcase size={12} />
                {filtered.length} açık pozisyon
              </span>
            </div>

            {canUseInteractionFilters && (
              <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                      <Filter size={14} className="text-accent" />
                      Kişisel filtreler
                    </div>
                    <p className="mt-1 text-xs text-muted">
                      Başvurduğunuz veya incelediğiniz ilanları ayrı ayrı
                      gösterin ya da gizleyin.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:min-w-104">
                    <div className="flex flex-col gap-1 text-sm text-foreground">
                      <span className="text-xs font-medium text-muted">
                        Başvurduklarım
                      </span>
                      <Select.Root
                        value={appliedFilter}
                        onValueChange={(value) =>
                          setAppliedFilter(value as InteractionFilter)
                        }
                        disabled={interactionsLoading}
                      >
                        <Select.Trigger />
                        <Select.Content>
                          <Select.Item value="all">Tümü</Select.Item>
                          <Select.Item value="only">Sadece göster</Select.Item>
                          <Select.Item value="hide">Listeden gizle</Select.Item>
                        </Select.Content>
                      </Select.Root>
                    </div>

                    <div className="flex flex-col gap-1 text-sm text-foreground">
                      <span className="text-xs font-medium text-muted">
                        İncelediklerim
                      </span>
                      <Select.Root
                        value={viewedFilter}
                        onValueChange={(value) =>
                          setViewedFilter(value as InteractionFilter)
                        }
                        disabled={interactionsLoading}
                      >
                        <Select.Trigger />
                        <Select.Content>
                          <Select.Item value="all">Tümü</Select.Item>
                          <Select.Item value="only">Sadece göster</Select.Item>
                          <Select.Item value="hide">Listeden gizle</Select.Item>
                        </Select.Content>
                      </Select.Root>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50/50 p-4 text-amber-900   ">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-600" />
          <div className="text-sm leading-relaxed">
            Bu sayfadaki tüm şirketler, pozisyonlar ve ilan detayları tamamen{" "}
            <strong>kurgusaldır</strong>. Gerçek kurum veya kişilerle ilgisi
            yoktur.
          </div>
        </div>
      </div>

      {error && <ErrorCard message={error} />}

      {isInitialLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Skeletons
            <JobCardSkeleton key={`job-skeleton-${i}`} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
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
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isApplied={canUseInteractionFilters && isApplied(job.id)}
              isViewed={canUseInteractionFilters && isViewed(job.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
