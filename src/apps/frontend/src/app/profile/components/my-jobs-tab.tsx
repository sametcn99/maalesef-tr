"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, Dialog } from "@radix-ui/themes";
import { AlertTriangle, Trash2, Briefcase } from "lucide-react";
import { TableSkeleton } from "@/components/ui/skeletons";
import { ErrorCard } from "@/components/ui/error-card";
import type { Job } from "@/types";

interface MyJobsTabProps {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  removeJob: (id: string) => void;
}

export function MyJobsTab({ jobs, loading, error, removeJob }: MyJobsTabProps) {
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  if (error) return <ErrorCard message={error} />;

  if (loading) return <TableSkeleton />;

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-hover text-muted-light">
          <Briefcase size={22} />
        </div>
        <p className="mt-4 text-sm font-medium text-muted">
          Henüz yayınladığınız bir ilan yok.
        </p>
        <p className="mt-1 text-xs text-muted-light">
          Yeni bir ilan oluşturarak işe alım sürecini başlatabilirsiniz.
        </p>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!jobToDelete) return;
    setIsDeleting(true);
    try {
      await removeJob(jobToDelete.id);
      setJobToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="grid grid-cols-12 gap-0 border-b border-border bg-surface-hover px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted">
        <div className="col-span-4">Başlık</div>
        <div className="col-span-3">Şirket</div>
        <div className="col-span-2">Konum</div>
        <div className="col-span-2">Başvuru</div>
        <div className="col-span-1 text-right">Sil</div>
      </div>

      <div className="divide-y divide-border">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="grid grid-cols-12 items-center px-4 py-3 text-sm"
          >
            <div className="col-span-4 font-medium text-foreground">
              <Link
                data-umami-event="profile_my_jobs_open_job_detail_click"
                href={`/jobs/${job.slug || job.id}`}
                className="transition-colors hover:text-accent hover:underline"
              >
                {job.title}
              </Link>
            </div>
            <div className="col-span-3 text-muted">{job.company}</div>
            <div className="col-span-2 text-muted">{job.location}</div>
            <div className="col-span-2 inline-flex items-center gap-2 text-muted">
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
                {job.applicantCount ?? 0}
              </span>
              başvuru
            </div>
            <div className="col-span-1 text-right">
              <Button
                data-umami-event="profile_my_jobs_tab_delete_click"
                size="2"
                color="red"
                variant="ghost"
                onClick={() => setJobToDelete(job)}
              >
                Sil
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Dialog */}
      <Dialog.Root
        open={jobToDelete !== null}
        onOpenChange={(open) => !open && !isDeleting && setJobToDelete(null)}
      >
        <Dialog.Content className="max-w-lg border border-border shadow-xl">
          <Dialog.Title className="mb-2 flex items-center gap-3 text-lg font-semibold text-foreground">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-700">
              <AlertTriangle size={20} />
            </span>
            İlanı silmek üzeresiniz
          </Dialog.Title>
          <div className="mt-2 space-y-4">
            <p className="text-sm text-muted">
              <strong>"{jobToDelete?.title}"</strong> başlıklı ilanı silmek
              istediğinize emin misiniz? Bu işlem geri alınamaz ve ilana gelen
              tüm başvurular silinecektir.
            </p>

            <div className="flex justify-end gap-3">
              <Button
                data-umami-event="profile_my_jobs_delete_cancel_click"
                variant="soft"
                color="gray"
                onClick={() => setJobToDelete(null)}
                disabled={isDeleting}
              >
                Vazgeç
              </Button>
              <Button
                data-umami-event="profile_my_jobs_tab_delete_click_2"
                color="red"
                variant="solid"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 size={16} />
                {isDeleting ? "Siliniyor..." : "Evet, ilanı sil"}
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}
