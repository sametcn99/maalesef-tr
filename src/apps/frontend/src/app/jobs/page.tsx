"use client";

import { JobsFiltersPanel } from "@/app/jobs/components/jobs-filters-panel";
import { JobsFictionDisclaimer } from "@/app/jobs/components/jobs-fiction-disclaimer";
import { JobsPageFallback } from "@/app/jobs/components/jobs-page-fallback";
import { JobsPageHeader } from "@/app/jobs/components/jobs-page-header";
import { JobsResults } from "@/app/jobs/components/jobs-results";
import { useAuth } from "@/context/auth-context";
import { useJobsFeed } from "@/hooks";
import { useJobsFeedUiStore } from "@/stores/jobs-feed-ui-store";
import {
  JOB_INTERACTION_FILTERS,
  JOB_SORT_OPTIONS,
  type JobInteractionFilter,
  type JobSortOption,
} from "@/types";
import {
  Suspense,
  startTransition,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useShallow } from "zustand/react/shallow";

const FEED_TEXT_FILTER_DEBOUNCE_MS = 375;

const SORT_LABELS: Record<JobSortOption, string> = {
  newest: "En yeni",
  oldest: "En eski",
  most_applied: "En çok başvuru alan",
  title_asc: "Başlık A-Z",
  title_desc: "Başlık Z-A",
  company_asc: "Şirket A-Z",
  company_desc: "Şirket Z-A",
};

type FilterChipKey =
  | "search"
  | "company"
  | "location"
  | "sort"
  | "applied"
  | "viewed";

function getInteractionFilter(value: string | null): JobInteractionFilter {
  return JOB_INTERACTION_FILTERS.includes(value as JobInteractionFilter)
    ? (value as JobInteractionFilter)
    : "all";
}

function getSortOption(value: string | null): JobSortOption {
  return JOB_SORT_OPTIONS.includes(value as JobSortOption)
    ? (value as JobSortOption)
    : "newest";
}

function JobsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    searchInput,
    companyInput,
    locationInput,
    syncFromQuery,
    setSearchInput,
    setCompanyInput,
    setLocationInput,
  } = useJobsFeedUiStore(
    useShallow((state) => ({
      searchInput: state.searchInput,
      companyInput: state.companyInput,
      locationInput: state.locationInput,
      syncFromQuery: state.syncFromQuery,
      setSearchInput: state.setSearchInput,
      setCompanyInput: state.setCompanyInput,
      setLocationInput: state.setLocationInput,
    })),
  );
  const canPublishJob = !authLoading && isAuthenticated;
  const canUseInteractionFilters = !authLoading && isAuthenticated;
  const searchValue = searchParams.get("search") ?? "";
  const companyValue = searchParams.get("company") ?? "";
  const locationValue = searchParams.get("location") ?? "";
  const sortValue = getSortOption(searchParams.get("sort"));
  const appliedFilter = getInteractionFilter(searchParams.get("applied"));
  const viewedFilter = getInteractionFilter(searchParams.get("viewed"));
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const deferredSearchInput = useDeferredValue(searchInput);
  const deferredCompanyInput = useDeferredValue(companyInput);
  const deferredLocationInput = useDeferredValue(locationInput);

  const updateQuery = useCallback(
    (updates: Record<string, string | null>) => {
      const nextSearchParams = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        const normalized = value?.trim() ?? "";
        const shouldClear =
          normalized.length === 0 ||
          (key === "sort" && normalized === "newest") ||
          ((key === "applied" || key === "viewed") && normalized === "all");

        if (shouldClear) {
          nextSearchParams.delete(key);
          continue;
        }

        nextSearchParams.set(key, normalized);
      }

      const nextQuery = nextSearchParams.toString();

      startTransition(() => {
        router.replace(nextQuery ? `/jobs?${nextQuery}` : "/jobs", {
          scroll: false,
        });
      });
    },
    [router, searchParams],
  );

  useEffect(() => {
    syncFromQuery({
      search: searchValue,
      company: companyValue,
      location: locationValue,
    });
  }, [companyValue, locationValue, searchValue, syncFromQuery]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (canUseInteractionFilters) {
      return;
    }

    if (!searchParams.get("applied") && !searchParams.get("viewed")) {
      return;
    }

    updateQuery({ applied: null, viewed: null });
  }, [authLoading, canUseInteractionFilters, searchParams, updateQuery]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const updates: Record<string, string | null> = {};

      if (deferredSearchInput !== searchValue) {
        updates.search = deferredSearchInput;
      }

      if (deferredCompanyInput !== companyValue) {
        updates.company = deferredCompanyInput;
      }

      if (deferredLocationInput !== locationValue) {
        updates.location = deferredLocationInput;
      }

      if (Object.keys(updates).length > 0) {
        updateQuery(updates);
      }
    }, FEED_TEXT_FILTER_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [
    companyValue,
    deferredCompanyInput,
    deferredLocationInput,
    deferredSearchInput,
    locationValue,
    searchValue,
    updateQuery,
  ]);

  const {
    jobs,
    loading,
    loadingMore,
    error,
    hasMore,
    total,
    fetchNextPage,
    refetch,
  } = useJobsFeed({
    limit: 12,
    search: searchValue || undefined,
    company: companyValue || undefined,
    location: locationValue || undefined,
    sort: sortValue,
    applied: canUseInteractionFilters ? appliedFilter : undefined,
    viewed: canUseInteractionFilters ? viewedFilter : undefined,
    personalized: canUseInteractionFilters,
    enabled: !authLoading,
  });

  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target || !hasMore || loading || loadingMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (!entry?.isIntersecting) {
          return;
        }

        void fetchNextPage();
      },
      {
        rootMargin: "240px 0px",
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasMore, loading, loadingMore]);

  const isInitialLoading = authLoading || (loading && jobs.length === 0);
  const hasInteractionFilters =
    appliedFilter !== "all" || viewedFilter !== "all";
  const hasActiveFilters = Boolean(
    searchValue.trim() ||
      companyValue.trim() ||
      locationValue.trim() ||
      sortValue !== "newest" ||
      hasInteractionFilters,
  );
  const emptyStateHasFilters = hasActiveFilters;

  const clearSingleFilter = useCallback(
    (key: FilterChipKey) => {
      switch (key) {
        case "search":
          setSearchInput("");
          updateQuery({ search: null });
          return;
        case "company":
          setCompanyInput("");
          updateQuery({ company: null });
          return;
        case "location":
          setLocationInput("");
          updateQuery({ location: null });
          return;
        case "sort":
          updateQuery({ sort: null });
          return;
        case "applied":
          updateQuery({ applied: null });
          return;
        case "viewed":
          updateQuery({ viewed: null });
          return;
      }
    },
    [updateQuery, setSearchInput, setLocationInput, setCompanyInput],
  );

  const clearAllFilters = useCallback(() => {
    setSearchInput("");
    setCompanyInput("");
    setLocationInput("");
    updateQuery({
      search: null,
      company: null,
      location: null,
      sort: null,
      applied: null,
      viewed: null,
    });
  }, [setSearchInput, setCompanyInput, setLocationInput, updateQuery]);

  const handleSortChange = useCallback(
    (value: JobSortOption) => {
      updateQuery({ sort: value });
    },
    [updateQuery],
  );

  const handleAppliedFilterChange = useCallback(
    (value: JobInteractionFilter) => {
      updateQuery({ applied: value });
    },
    [updateQuery],
  );

  const handleViewedFilterChange = useCallback(
    (value: JobInteractionFilter) => {
      updateQuery({ viewed: value });
    },
    [updateQuery],
  );

  const handleRetry = useCallback(() => {
    void refetch();
  }, [refetch]);

  const handleRetryMore = useCallback(() => {
    if (hasMore) {
      void fetchNextPage();
      return;
    }

    void refetch();
  }, [fetchNextPage, hasMore, refetch]);

  const activeFilterChips = useMemo(() => {
    const chips: Array<{ key: FilterChipKey; label: string; onClear: () => void }> = [];

    if (searchValue.trim()) {
      chips.push({
        key: "search",
        label: `Arama: ${searchValue.trim()}`,
        onClear: () => clearSingleFilter("search"),
      });
    }

    if (companyValue.trim()) {
      chips.push({
        key: "company",
        label: `Şirket: ${companyValue.trim()}`,
        onClear: () => clearSingleFilter("company"),
      });
    }

    if (locationValue.trim()) {
      chips.push({
        key: "location",
        label: `Konum: ${locationValue.trim()}`,
        onClear: () => clearSingleFilter("location"),
      });
    }

    if (sortValue !== "newest") {
      chips.push({
        key: "sort",
        label: `Sıralama: ${SORT_LABELS[sortValue]}`,
        onClear: () => clearSingleFilter("sort"),
      });
    }

    if (appliedFilter === "only") {
      chips.push({
        key: "applied",
        label: "Başvurduklarım: Sadece göster",
        onClear: () => clearSingleFilter("applied"),
      });
    }

    if (appliedFilter === "hide") {
      chips.push({
        key: "applied",
        label: "Başvurduklarım: Gizle",
        onClear: () => clearSingleFilter("applied"),
      });
    }

    if (viewedFilter === "only") {
      chips.push({
        key: "viewed",
        label: "İncelediklerim: Sadece göster",
        onClear: () => clearSingleFilter("viewed"),
      });
    }

    if (viewedFilter === "hide") {
      chips.push({
        key: "viewed",
        label: "İncelediklerim: Gizle",
        onClear: () => clearSingleFilter("viewed"),
      });
    }

    return chips;
  }, [
    appliedFilter,
    clearSingleFilter,
    companyValue,
    locationValue,
    searchValue,
    sortValue,
    viewedFilter,
  ]);

  const resultSummary = useMemo(() => {
    if (isInitialLoading) {
      return null;
    }

    if (total === 0) {
      return "Sonuç bulunamadı";
    }

    if (jobs.length >= total) {
      return `${total} ilan listeleniyor`;
    }

    return `${jobs.length} / ${total} ilan gösteriliyor`;
  }, [isInitialLoading, jobs.length, total]);
  const showBlockingError =
    Boolean(error) && jobs.length === 0 && !isInitialLoading;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-10">
        <JobsPageHeader
          canPublishJob={canPublishJob}
          searchInput={searchInput}
          onSearchInputChange={setSearchInput}
          onClearSearch={() => setSearchInput("")}
        />

        {!isInitialLoading && (
          <JobsFiltersPanel
            resultSummary={resultSummary}
            hasActiveFilters={hasActiveFilters}
            onClearAllFilters={clearAllFilters}
            companyInput={companyInput}
            locationInput={locationInput}
            onCompanyInputChange={setCompanyInput}
            onLocationInputChange={setLocationInput}
            sortValue={sortValue}
            onSortChange={handleSortChange}
            canUseInteractionFilters={canUseInteractionFilters}
            authLoading={authLoading}
            appliedFilter={appliedFilter}
            viewedFilter={viewedFilter}
            onAppliedChange={handleAppliedFilterChange}
            onViewedChange={handleViewedFilterChange}
            activeFilterChips={activeFilterChips}
          />
        )}
      </div>

      <JobsFictionDisclaimer />

      <JobsResults
        jobs={jobs}
        isInitialLoading={isInitialLoading}
        showBlockingError={showBlockingError}
        error={error}
        emptyStateHasFilters={emptyStateHasFilters}
        canUseInteractionFilters={canUseInteractionFilters}
        loadMoreRef={loadMoreRef}
        loadingMore={loadingMore}
        hasMore={hasMore}
        onRetry={handleRetry}
        onRetryMore={handleRetryMore}
      />
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<JobsPageFallback />}>
      <JobsPageContent />
    </Suspense>
  );
}
