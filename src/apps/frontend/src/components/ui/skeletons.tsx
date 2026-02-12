"use client";

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="flex gap-6 border-b border-border bg-surface px-5 py-3">
        <div className="h-3.5 w-1/3 rounded-md bg-surface-hover animate-pulse" />
        <div className="h-3.5 w-1/6 rounded-md bg-surface-hover animate-pulse" />
        <div className="h-3.5 w-1/4 rounded-md bg-surface-hover animate-pulse" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: Skeletons
          key={`skeleton-row-${i}`}
          className="flex items-center gap-6 border-b border-border px-5 py-4 last:border-b-0"
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="h-9 w-9 shrink-0 rounded-lg bg-surface-hover animate-pulse" />
            <div className="h-4 w-2/3 rounded-md bg-surface-hover animate-pulse" />
          </div>
          <div className="h-7 w-28 rounded-full bg-surface-hover animate-pulse" />
          <div className="h-4 w-24 rounded-md bg-surface-hover animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export function NotificationSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: Skeletons
          key={`notif-skeleton-${i}`}
          className="rounded-xl border border-border"
        >
          <div className="flex flex-row items-start gap-4 p-5">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-surface-hover animate-pulse" />
            <div className="flex-1 space-y-2.5">
              <div className="h-4 w-3/4 rounded-md bg-surface-hover animate-pulse" />
              <div className="h-3.5 w-full rounded-md bg-surface-hover animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-8 w-24 rounded-lg bg-surface-hover animate-pulse" />
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 shrink-0 rounded-2xl bg-surface-hover animate-pulse" />
        <div className="flex-1 space-y-3">
          <div className="h-8 w-2/3 rounded-lg bg-surface-hover animate-pulse" />
          <div className="flex gap-2">
            <div className="h-7 w-28 rounded-full bg-surface-hover animate-pulse" />
            <div className="h-7 w-24 rounded-full bg-surface-hover animate-pulse" />
            <div className="h-7 w-32 rounded-full bg-surface-hover animate-pulse" />
          </div>
        </div>
      </div>
      <div className="h-px w-full bg-surface-hover" />
      <div className="space-y-3">
        <div className="h-4 w-40 rounded-md bg-surface-hover animate-pulse" />
        <div className="rounded-xl border border-border p-6 space-y-2">
          <div className="h-4 w-full rounded-md bg-surface-hover animate-pulse" />
          <div className="h-4 w-full rounded-md bg-surface-hover animate-pulse" />
          <div className="h-4 w-5/6 rounded-md bg-surface-hover animate-pulse" />
          <div className="h-4 w-3/4 rounded-md bg-surface-hover animate-pulse" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-4 w-40 rounded-md bg-surface-hover animate-pulse" />
        <div className="rounded-xl border border-border p-6 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: Skeletons
              key={`req-skel-${i}`}
              className="flex items-center gap-3"
            >
              <div className="h-5 w-5 shrink-0 rounded-md bg-surface-hover animate-pulse" />
              <div className="h-4 w-2/3 rounded-md bg-surface-hover animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
