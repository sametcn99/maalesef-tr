"use client";

import { FileText } from "lucide-react";
import type { Application } from "@/types";

interface StatsSummaryProps {
  applications: Application[];
  loading: boolean;
}

export function StatsSummary({ applications, loading }: StatsSummaryProps) {
  if (loading || applications.length === 0) {
    return null;
  }

  const pendingCount = applications.filter(
    (a) => a.status === "pending",
  ).length;
  const rejectedCount = applications.filter(
    (a) => a.status === "rejected",
  ).length;

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5">
        <FileText size={14} className="text-muted" />
        <span className="text-sm font-medium text-foreground">
          {applications.length}
        </span>
        <span className="text-xs text-muted">Toplam Başvuru</span>
      </div>
      {pendingCount > 0 && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          <span className="text-sm font-medium text-amber-700">
            {pendingCount}
          </span>
          <span className="text-xs text-amber-600">Değerlendiriliyor</span>
        </div>
      )}
      {rejectedCount > 0 && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          <span className="text-sm font-medium text-red-700">
            {rejectedCount}
          </span>
          <span className="text-xs text-red-600">Reddedildi</span>
        </div>
      )}
    </div>
  );
}
