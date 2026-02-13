"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Badge, Separator } from "@radix-ui/themes";
import {
  MapPin,
  Building2,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Briefcase,
  Send,
  User,
  AlertTriangle,
  Linkedin,
  Share2,
} from "lucide-react";

import { useJob } from "@/hooks";
import { useAuth } from "@/context/auth-context";
import { ErrorCard, DetailSkeleton } from "@/components/ui";
import { getRandomJobShareMessage } from "@/lib/job-share-messages";

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { job, loading, error } = useJob(id);
  const { isAuthenticated } = useAuth();

  const [shareMessage, setShareMessage] = useState("");

  useEffect(() => {
    if (job) {
      setShareMessage(getRandomJobShareMessage(job.title));
    }
  }, [job]);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  function handleApply() {
    if (!job) return;
    if (!isAuthenticated) {
      router.push(`/login?redirect=/jobs/${job.id}/apply`);
    } else {
      router.push(`/jobs/${job.id}/apply`);
    }
  }

  if (loading && !job) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <DetailSkeleton />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <ErrorCard message={error || "İlan bulunamadı."} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {/* Back button */}
      <button
        data-umami-event="jobs_job_back_click"
        type="button"
        onClick={() => router.back()}
        className="animate-fade-in mb-8 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted transition-all duration-200 hover:bg-surface-hover hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Geri
      </button>

      <div className="animate-fade-in-up flex flex-col gap-8 lg:flex-row lg:gap-12">
        {/* Main content */}
        <div className="flex-1 space-y-8">
          {/* Header */}
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
                  <Badge
                    size="2"
                    variant="soft"
                    className={`gap-1 bg-surface-hover text-muted transition-all duration-200 ${
                      job.createdBy?.slug
                        ? "cursor-pointer hover:bg-accent/10 hover:text-accent hover:ring-1 hover:ring-accent/20 hover:shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-accent"
                        : ""
                    }`}
                    {...(job.createdBy?.slug
                      ? {
                          role: "button",
                          tabIndex: 0,
                          onClick: () =>
                            router.push(`/p/${job.createdBy?.slug}`),
                          onKeyDown: (e: React.KeyboardEvent) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              router.push(`/p/${job.createdBy?.slug}`);
                            }
                          },
                        }
                      : {})}
                  >
                    <User size={12} /> {job.createdBy?.name ?? "İlan sahibi"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-border" size="4" />

          {/* Description */}
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

          {/* Requirements */}
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
                  {job.requirements.map((req) => (
                    <li
                      key={req}
                      className="flex items-start gap-3 text-sm leading-relaxed text-foreground/80"
                    >
                      <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-accent-muted">
                        <CheckCircle2 size={12} className="text-accent" />
                      </div>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar — Apply */}
        <div className="lg:w-95">
          <div className="sticky top-24 space-y-4">
            {/* Disclaimer Box */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-amber-900 shadow-sm">
              <div className="flex gap-3">
                <AlertTriangle
                  size={18}
                  className="mt-0.5 shrink-0 text-amber-600"
                />
                <p className="text-xs leading-relaxed">
                  <strong>Dikkat:</strong> Bu ilan ve şirket tamamen
                  kurgusaldır.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <div className="mb-1 flex items-center gap-2">
                <Send size={16} className="text-accent" />
                <h2 className="text-base font-semibold text-foreground">
                  Başvuru
                </h2>
              </div>
              <p className="mb-5 text-sm text-muted">
                Bu pozisyona başvurmak için başvuru formunu doldurun.
              </p>

              <Button
                data-umami-event="jobs_job_login_click"
                onClick={handleApply}
                size="3"
                className="h-12 w-full bg-linear-to-r from-accent to-accent-light font-semibold text-white shadow-lg shadow-accent/25 transition-all duration-200 hover:shadow-xl hover:shadow-accent/30 hover:scale-[1.01]"
              >
                <span className="inline-flex items-center gap-2">
                  <Send size={16} />
                  {isAuthenticated ? "Başvur" : "Giriş Yap & Başvur"}
                </span>
              </Button>
            </div>

            {/* Info box */}
            <div className="rounded-xl border border-border bg-accent-muted/30 p-4">
              <p className="text-xs leading-relaxed text-muted">
                Sonuçlar profilinize bildirim olarak ve e-posta yoluyla
                iletilecektir.
                {!isAuthenticated && (
                  <span className="mt-1 block font-medium text-accent">
                    Başvuru için giriş yapmanız gerekmektedir.
                  </span>
                )}
              </p>
            </div>

            {/* Share Buttons */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Share2 size={16} className="text-accent" />
                <h2 className="text-base font-semibold text-foreground">
                  Paylaş
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  data-umami-event="jobs_job_share_linkedin_click"
                  variant="surface"
                  color="blue"
                  className="w-full cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30"
                  onClick={() => {
                    window.open(
                      `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(
                        `${shareMessage} ${shareUrl}`,
                      )}`,
                      "_blank",
                    );
                  }}
                >
                  <Linkedin size={16} />
                  LinkedIn
                </Button>
                <Button
                  data-umami-event="jobs_job_share_x_click"
                  variant="surface"
                  className="w-full cursor-pointer bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                  onClick={() => {
                    window.open(
                      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        shareMessage,
                      )}&url=${encodeURIComponent(shareUrl)}`,
                      "_blank",
                    );
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                    aria-labelledby="x-share-title"
                  >
                    <title id="x-share-title">X Logo</title>
                    <path d="M18.901 0h3.68l-8.04 9.17L24 24h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 0h7.533l5.262 6.96L18.901 0ZM17.61 22.044h2.039L6.486 1.906H4.298l13.312 20.138Z" />
                  </svg>
                  X
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
