"use client";

import { Dialog, Button, Badge, Separator } from "@radix-ui/themes";
import {
  MapPin,
  Building2,
  Calendar,
  ArrowRight,
  CheckCircle2,
  User,
} from "lucide-react";
import Link from "next/link";
import type { Job } from "@/types";

interface JobPreviewModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export function JobPreviewModal({
  job,
  isOpen,
  onClose,
}: JobPreviewModalProps) {
  if (!job) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Content className="max-w-3xl border border-border shadow-xl">
        <Dialog.Title className="flex items-start gap-4 pb-2 text-lg font-semibold text-foreground">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-light text-base font-bold text-white shadow-md shadow-accent/20">
            {job.company.charAt(0).toUpperCase()}
          </div>
          <div>
            <div>{job.title}</div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
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
                })}
              </Badge>
              <Badge
                size="2"
                variant="soft"
                className="gap-1 bg-surface-hover text-muted"
              >
                <User size={12} /> {job.createdBy?.name ?? "İlan sahibi"}
              </Badge>
            </div>
          </div>
        </Dialog.Title>

        <Separator className="mb-4 mt-2 bg-border" />

        <p className="text-sm leading-7 text-foreground/80">
          {job.shortDescription}
        </p>

        {job.requirements.length > 0 && (
          <div className="mt-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">
              Aranan Nitelikler
            </p>
            <ul className="space-y-2">
              {job.requirements.slice(0, 4).map((req) => (
                <li
                  key={req}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/80"
                >
                  <CheckCircle2
                    size={14}
                    className="mt-0.5 shrink-0 text-accent"
                  />
                  {req}
                </li>
              ))}
              {job.requirements.length > 4 && (
                <li className="text-xs text-muted">
                  +{job.requirements.length - 4} nitelik daha
                </li>
              )}
            </ul>
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-3 pt-2">
          <Button
            data-umami-event="job_job_preview_modal_close_click"
            onClick={onClose}
            size="3"
            className="bg-surface-hover font-medium text-foreground"
          >
            Kapat
          </Button>
          <Button
            data-umami-event="job_preview_open_detail_click"
            asChild
            size="3"
            className="bg-gradient-to-r from-accent to-accent-light font-semibold text-white shadow-md shadow-accent/20"
          >
            <Link
              data-umami-event="job_preview_open_detail_link_click"
              href={`/jobs/${job.id}`}
              className="inline-flex items-center gap-2"
            >
              <ArrowRight size={14} /> İlan Detayına Git
            </Link>
          </Button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
