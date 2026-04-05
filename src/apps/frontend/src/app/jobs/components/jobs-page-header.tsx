"use client";

import Link from "next/link";
import { Button, TextField } from "@radix-ui/themes";
import { PlusCircle, Search } from "lucide-react";

interface JobsPageHeaderProps {
  canPublishJob: boolean;
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  onClearSearch: () => void;
}

export function JobsPageHeader({
  canPublishJob,
  searchInput,
  onSearchInputChange,
  onClearSearch,
}: JobsPageHeaderProps) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Açık Pozisyonlar
        </h1>
        <p className="mt-2 text-sm text-muted">
          Mevcut iş ilanlarını inceleyin ve size uygun pozisyona başvurun.
        </p>
      </div>

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
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
            value={searchInput}
            onChange={(event) => onSearchInputChange(event.target.value)}
          >
            <TextField.Slot>
              <Search
                size={18}
                className="text-muted-light transition-colors"
              />
            </TextField.Slot>

            {searchInput && (
              <TextField.Slot>
                <button
                  data-umami-event="jobs_search_clear_click"
                  type="button"
                  onClick={onClearSearch}
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
  );
}
