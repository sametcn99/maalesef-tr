export function JobCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="gap-4 p-6">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-surface-hover animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-3/4 rounded-lg bg-surface-hover animate-pulse" />
            <div className="flex gap-3">
              <div className="h-3 w-20 rounded bg-surface-hover animate-pulse" />
              <div className="h-3 w-16 rounded bg-surface-hover animate-pulse" />
            </div>
          </div>
        </div>
        <div className="space-y-1.5 mt-4">
          <div className="h-3.5 w-full rounded bg-surface-hover animate-pulse" />
          <div className="h-3.5 w-4/5 rounded bg-surface-hover animate-pulse" />
        </div>
        <div className="flex items-center justify-between pt-3">
          <div className="h-6 w-24 rounded-full bg-surface-hover animate-pulse" />
          <div className="h-7 w-16 rounded-lg bg-surface-hover animate-pulse" />
        </div>
      </div>
    </div>
  );
}
