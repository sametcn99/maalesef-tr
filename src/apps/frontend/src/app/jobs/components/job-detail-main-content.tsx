"use client";

import { Badge, Separator } from "@radix-ui/themes";
import {
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Eye,
  MapPin,
  User,
} from "lucide-react";
import type { Job } from "@/types";

interface JobDetailMainContentProps {
  job: Job;
  applied: boolean;
  viewed: boolean;
  onOwnerNavigate: (slug: string) => void;
}

export function JobDetailMainContent({
  job,
  applied,
  viewed,
  onOwnerNavigate,
}: JobDetailMainContentProps) {
  const ownerSlug = job.createdBy?.slug;

  return (
    <div className="flex-1 space-y-8">
      <div>
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-accent to-accent-light text-lg font-bold text-white shadow-lg shadow-accent/20">
            {job.company.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {job.title}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Badge
                size="2"
                variant="soft"
                className="gap-1 bg-surface-hover text-muted"
              >
                <Building2 size={12} /> {job.company}
              </Badge>

              <Badge
                size="2"
                variant="soft"
                className="gap-1 bg-surface-hover text-muted"
              >
                <MapPin size={12} /> {job.location}
              </Badge>

              <Badge
                size="2"
                variant="soft"
                className="gap-1 bg-surface-hover text-muted"
              >
                <Calendar size={12} />
                {new Date(job.createdAt).toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </Badge>

              <Badge
                size="2"
                variant="soft"
                className="gap-1 bg-surface-hover text-muted"
              >
                <User size={12} /> {job.applicantCount ?? 0} başvuru
              </Badge>

              {ownerSlug ? (
                <button
                  type="button"
                  onClick={() => onOwnerNavigate(ownerSlug)}
                  className="inline-flex items-center gap-1 rounded-full bg-surface-hover px-2.5 py-1 text-xs text-muted transition-all duration-200 hover:bg-accent/10 hover:text-accent hover:ring-1 hover:ring-accent/20 hover:shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                >
                  <User size={12} /> {job.createdBy?.name ?? "İlan sahibi"}
                </button>
              ) : (
                <Badge
                  size="2"
                  variant="soft"
                  className="gap-1 bg-surface-hover text-muted"
                >
                  <User size={12} /> {job.createdBy?.name ?? "İlan sahibi"}
                </Badge>
              )}

              {applied && (
                <Badge size="2" variant="soft" color="green" className="gap-1">
                  <CheckCircle2 size={12} /> Başvuruldu
                </Badge>
              )}

              {viewed && (
                <Badge size="2" variant="soft" color="blue" className="gap-1">
                  <Eye size={12} /> İncelendi
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-border" size="4" />

      <div>
        <div className="mb-4 flex items-center gap-2">
          <Briefcase size={16} className="text-accent" />
          <h2 className="text-sm font-semibold uppercase tracking-widest text-accent">
            Pozisyon Açıklaması
          </h2>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6">
          <p className="whitespace-pre-line text-sm leading-7 text-foreground/80">
            {job.fullDescription}
          </p>
        </div>
      </div>

      {job.requirements.length > 0 && (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-accent" />
            <h2 className="text-sm font-semibold uppercase tracking-widest text-accent">
              Aranan Nitelikler
            </h2>
          </div>

          <div className="rounded-xl border border-border bg-surface p-6">
            <ul className="stagger-children space-y-3">
              {job.requirements.map((requirement) => (
                <li
                  key={requirement}
                  className="flex items-start gap-3 text-sm leading-relaxed text-foreground/80"
                >
                  <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-accent-muted">
                    <CheckCircle2 size={12} className="text-accent" />
                  </div>
                  {requirement}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
