"use client";

import { Button, Select, TextField } from "@radix-ui/themes";
import {
  ArrowDownWideNarrow,
  Briefcase,
  Building2,
  Filter,
  MapPin,
  X,
} from "lucide-react";
import type { JobInteractionFilter, JobSortOption } from "@/types";

interface ActiveFilterChip {
  key: string;
  label: string;
  onClear: () => void;
}

interface JobsFiltersPanelProps {
  resultSummary: string | null;
  hasActiveFilters: boolean;
  onClearAllFilters: () => void;
  companyInput: string;
  locationInput: string;
  onCompanyInputChange: (value: string) => void;
  onLocationInputChange: (value: string) => void;
  sortValue: JobSortOption;
  onSortChange: (value: JobSortOption) => void;
  canUseInteractionFilters: boolean;
  authLoading: boolean;
  appliedFilter: JobInteractionFilter;
  viewedFilter: JobInteractionFilter;
  onAppliedChange: (value: JobInteractionFilter) => void;
  onViewedChange: (value: JobInteractionFilter) => void;
  activeFilterChips: ActiveFilterChip[];
}

export function JobsFiltersPanel({
  resultSummary,
  hasActiveFilters,
  onClearAllFilters,
  companyInput,
  locationInput,
  onCompanyInputChange,
  onLocationInputChange,
  sortValue,
  onSortChange,
  canUseInteractionFilters,
  authLoading,
  appliedFilter,
  viewedFilter,
  onAppliedChange,
  onViewedChange,
  activeFilterChips,
}: JobsFiltersPanelProps) {
  return (
    <div className="mt-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-muted px-3 py-1 text-xs font-medium text-accent">
          <Briefcase size={12} />
          {resultSummary ?? "İlanlar yükleniyor"}
        </span>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="soft"
            color="gray"
            size="1"
            onClick={onClearAllFilters}
          >
            Filtreleri temizle
          </Button>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted">
              <Filter size={14} className="text-accent" />
              Akıllı filtreler
            </div>
            <p className="mt-1 text-xs text-muted">
              Şirket, konum ve sıralama seçeneklerine göre filtrele.
              Değişiklikler anında uygulanır.
            </p>
          </div>

          <div className="grid gap-3 lg:min-w-120 lg:grid-cols-3">
            <div className="flex flex-col gap-1 text-sm text-foreground">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-muted">
                <Building2 size={12} /> Şirket
              </span>
              <TextField.Root
                size="2"
                placeholder="Şirket adına göre filtrele"
                value={companyInput}
                onChange={(event) => onCompanyInputChange(event.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1 text-sm text-foreground">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-muted">
                <MapPin size={12} /> Konum
              </span>
              <TextField.Root
                size="2"
                placeholder="Konuma göre filtrele"
                value={locationInput}
                onChange={(event) => onLocationInputChange(event.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1 text-sm text-foreground">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-muted">
                <ArrowDownWideNarrow size={12} /> Sıralama
              </span>
              <Select.Root
                value={sortValue}
                onValueChange={(value) => onSortChange(value as JobSortOption)}
              >
                <Select.Trigger />
                <Select.Content>
                  <Select.Item value="newest">En yeni</Select.Item>
                  <Select.Item value="oldest">En eski</Select.Item>
                  <Select.Item value="most_applied">
                    En çok başvuru alan
                  </Select.Item>
                  <Select.Item value="title_asc">Başlık A-Z</Select.Item>
                  <Select.Item value="title_desc">Başlık Z-A</Select.Item>
                  <Select.Item value="company_asc">Şirket A-Z</Select.Item>
                  <Select.Item value="company_desc">Şirket Z-A</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>
          </div>
        </div>

        {canUseInteractionFilters && (
          <div className="mt-4 grid gap-3 border-t border-border/70 pt-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1 text-sm text-foreground">
              <span className="text-xs font-medium text-muted">
                Başvurduklarım
              </span>
              <Select.Root
                value={appliedFilter}
                onValueChange={(value) =>
                  onAppliedChange(value as JobInteractionFilter)
                }
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
                  onViewedChange(value as JobInteractionFilter)
                }
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
        )}

        {!canUseInteractionFilters && !authLoading && (
          <p className="mt-4 border-t border-border/70 pt-4 text-xs text-muted">
            Başvurduklarım ve incelediklerim filtrelerini kullanmak için giriş
            yapın.
          </p>
        )}

        {activeFilterChips.length > 0 && (
          <div className="mt-4 border-t border-border/70 pt-4">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
              Aktif filtreler
            </div>

            <div className="flex flex-wrap gap-2">
              {activeFilterChips.map((chip) => (
                <button
                  key={`${chip.key}-${chip.label}`}
                  type="button"
                  onClick={chip.onClear}
                  className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/8 px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:border-accent/35 hover:bg-accent/12"
                >
                  <span>{chip.label}</span>
                  <X size={12} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
