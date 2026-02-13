"use client";

import { MapPin, Building2, ArrowUpRight, Clock, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Job } from "@/types";
import { useAuth } from "@/context/auth-context";

interface JobCardProps {
  job: Job;
}

function formatRelative(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "Bugün";
  if (days === 1) return "Dün";
  if (days < 7) return `${days} gün önce`;
  if (days < 30) return `${Math.floor(days / 7)} hafta önce`;
  return `${Math.floor(days / 30)} ay önce`;
}

export function JobCard({ job }: JobCardProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  function handleApply(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (isAuthenticated) {
      router.push(`/jobs/${job.id}/apply`);
    } else {
      router.push(`/login?redirect=/jobs/${job.id}/apply`);
    }
  }

  return (
    <Link
      data-umami-event="job_card_open_detail_click"
      href={`/jobs/${job.slug || job.id}`}
      className="group relative block overflow-hidden rounded-xl border border-border bg-surface transition-all duration-300 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 hover:-translate-y-0.5 cursor-pointer"
    >
      {/* Accent top line */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-linear-to-r from-transparent via-accent/0 to-transparent transition-all duration-300 group-hover:via-accent" />

      <div className="gap-4 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {/* Company initial badge */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-muted text-sm font-bold text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
              {job.company.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-foreground group-hover:text-accent transition-colors duration-200">
                {job.title}
              </h3>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                <span className="inline-flex items-center gap-1">
                  <Building2 size={12} />
                  {job.company}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin size={12} />
                  {job.location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <User size={12} />
                  {job.createdBy?.slug ? (
                    <button
                      data-umami-event="job_card_open_publisher_profile_click"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.push(`/p/${job.createdBy?.slug}`);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();
                          router.push(`/p/${job.createdBy?.slug}`);
                        }
                      }}
                      className="hover:text-accent hover:bg-accent/5 px-1.5 py-0.5 rounded-md -mx-1.5 underline decoration-dotted decoration-accent/30 underline-offset-4 cursor-pointer transition-all duration-200 outline-none focus-visible:ring-1 focus-visible:ring-accent appearance-none bg-transparent border-none text-left p-0 font-inherit"
                    >
                      {job.createdBy.name}
                    </button>
                  ) : (
                    (job.createdBy?.name ?? "İlan sahibi")
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-surface-hover text-muted-light opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:bg-accent-muted group-hover:text-accent">
            <ArrowUpRight size={16} />
          </div>
        </div>

        <p className="text-sm leading-relaxed text-muted line-clamp-2 mt-4">
          {job.shortDescription}
        </p>

        <div className="flex items-center justify-between pt-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-surface-hover px-2.5 py-1 text-xs text-muted">
            <Clock size={12} />
            {formatRelative(job.createdAt)}
          </span>
          {typeof job.applicantCount === "number" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
              <User size={12} /> {job.applicantCount} başvuru
            </span>
          )}
          <button
            data-umami-event="job_job_card_apply_click"
            type="button"
            onClick={handleApply}
            className="h-7 px-3 text-xs font-medium text-accent hover:bg-accent-muted rounded-md transition-colors"
          >
            Başvur
          </button>
        </div>
      </div>
    </Link>
  );
}
