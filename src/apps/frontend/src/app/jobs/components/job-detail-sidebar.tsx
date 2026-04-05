"use client";

import { Button } from "@radix-ui/themes";
import { AlertTriangle, Send, Share2 } from "lucide-react";
import { FaLinkedin } from "react-icons/fa6";

interface JobDetailSidebarProps {
  isAuthenticated: boolean;
  shareMessage: string;
  shareUrl: string;
  onApply: () => void;
}

export function JobDetailSidebar({
  isAuthenticated,
  shareMessage,
  shareUrl,
  onApply,
}: JobDetailSidebarProps) {
  return (
    <div className="lg:w-95">
      <div className="sticky top-24 space-y-4">
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-amber-900 shadow-sm">
          <div className="flex gap-3">
            <AlertTriangle
              size={18}
              className="mt-0.5 shrink-0 text-amber-600"
            />
            <p className="text-xs leading-relaxed">
              <strong>Dikkat:</strong> Bu ilan ve şirket tamamen kurgusaldır.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="mb-1 flex items-center gap-2">
            <Send size={16} className="text-accent" />
            <h2 className="text-base font-semibold text-foreground">Başvuru</h2>
          </div>
          <p className="mb-5 text-sm text-muted">
            Bu pozisyona başvurmak için başvuru formunu doldurun.
          </p>

          <Button
            data-umami-event="jobs_job_login_click"
            onClick={onApply}
            size="3"
            className="h-12 w-full bg-linear-to-r from-accent to-accent-light font-semibold text-white shadow-lg shadow-accent/25 transition-all duration-200 hover:shadow-xl hover:shadow-accent/30 hover:scale-[1.01]"
          >
            <span className="inline-flex items-center gap-2">
              <Send size={16} />
              {isAuthenticated ? "Başvur" : "Giriş Yap & Başvur"}
            </span>
          </Button>
        </div>

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

        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Share2 size={16} className="text-accent" />
            <h2 className="text-base font-semibold text-foreground">Paylaş</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              data-umami-event="jobs_job_share_linkedin_click"
              variant="surface"
              color="blue"
              className="w-full cursor-pointer hover:bg-blue-100"
              onClick={() => {
                window.open(
                  `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(
                    `${shareMessage} ${shareUrl}`,
                  )}`,
                  "_blank",
                );
              }}
            >
              <FaLinkedin className="h-4 w-4" />
              LinkedIn
            </Button>

            <Button
              data-umami-event="jobs_job_share_x_click"
              variant="surface"
              className="w-full cursor-pointer bg-black text-white hover:bg-gray-800"
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
                className="h-4 w-4"
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
  );
}
