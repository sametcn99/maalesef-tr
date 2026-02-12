import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-24 text-center">
      {icon && (
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-hover text-muted-light">
          {icon}
        </div>
      )}
      <p className="text-sm font-medium text-muted">{title}</p>
      {description && (
        <p className="mt-1.5 max-w-xs text-xs text-muted-light">
          {description}
        </p>
      )}
    </div>
  );
}
