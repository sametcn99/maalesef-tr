"use client";

import type { ElementType, ReactNode } from "react";

interface SectionCardProps {
  icon: ElementType;
  title: string;
  description?: ReactNode;
  badge?: ReactNode;
  children: ReactNode;
}

export function SectionCard({
  icon: Icon,
  title,
  description,
  badge,
  children,
}: SectionCardProps) {
  return (
    <div className="border border-border bg-surface shadow-lg shadow-accent/10 rounded-2xl">
      <div className="flex items-start gap-3 px-6 pt-6 pb-3">
        <Icon size={20} className="text-accent shrink-0" aria-hidden />
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            {badge && (
              <span className="rounded-full bg-surface-hover px-3 py-0.5 text-xs font-semibold text-foreground/80">
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className="text-sm text-muted-light">{description}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-6 px-6 pb-6">{children}</div>
    </div>
  );
}
