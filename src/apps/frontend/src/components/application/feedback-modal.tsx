"use client";

import { Dialog, Button, Badge, Separator } from "@radix-ui/themes";
import { Clock, XCircle, MessageSquare, Calendar } from "lucide-react";
import type { Application } from "@/types";

interface FeedbackModalProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackModal({
  application,
  isOpen,
  onClose,
}: FeedbackModalProps) {
  if (!application) return null;

  const isRejected = application.status === "rejected";

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Content className="max-w-xl border border-border shadow-xl">
        <Dialog.Title className="flex items-start gap-3 text-lg font-semibold text-foreground">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white ${
              isRejected
                ? "bg-gradient-to-br from-red-500 to-red-600"
                : "bg-gradient-to-br from-amber-500 to-amber-600"
            }`}
          >
            {application.jobTitle.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1.5">
            <div>{application.jobTitle}</div>
            <div className="flex items-center gap-2">
              <Badge
                size="2"
                variant="soft"
                color={isRejected ? "red" : "amber"}
                className="gap-1 text-xs"
              >
                {isRejected ? <XCircle size={12} /> : <Clock size={12} />}
                {isRejected ? "Reddedildi" : "Değerlendiriliyor"}
              </Badge>
              <span className="inline-flex items-center gap-1 text-xs text-muted-light">
                <Calendar size={10} />
                {new Date(application.appliedAt).toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </Dialog.Title>

        <Separator className="mb-4 mt-2 bg-border" />

        {isRejected && application.feedback ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare size={14} className="text-accent" />
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                Geri Dönüş
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-5">
              <p className="whitespace-pre-line text-sm leading-7 text-foreground/85">
                {application.feedback}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100">
              <Clock size={24} className="text-amber-500" />
            </div>
            <p className="mt-4 text-sm font-medium text-foreground">
              Başvurunuz değerlendirme sürecindedir
            </p>
            <p className="mt-1 text-xs text-muted">
              Sonuçlar en kısa sürede bildirilecektir.
            </p>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button
            data-umami-event="application_feedback_modal_close_click"
            onClick={onClose}
            size="3"
            className="bg-surface-hover font-medium text-foreground"
          >
            Kapat
          </Button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
