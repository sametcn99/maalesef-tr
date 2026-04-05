"use client";

import { AlertTriangle } from "lucide-react";

export function JobsFictionDisclaimer() {
  return (
    <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50/50 p-4 text-amber-900">
      <div className="flex items-start gap-3">
        <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-600" />
        <div className="text-sm leading-relaxed">
          Bu sayfadaki tüm şirketler, pozisyonlar ve ilan detayları tamamen{" "}
          <strong>kurgusaldır</strong>. Gerçek kurum veya kişilerle ilgisi
          yoktur.
        </div>
      </div>
    </div>
  );
}
