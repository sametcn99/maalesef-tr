"use client";

import { Button } from "@radix-ui/themes";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorCardProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorCard({
  message = "Bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
  onRetry,
}: ErrorCardProps) {
  return (
    <div className="animate-fade-in mb-6 rounded-xl border border-red-200 bg-red-50">
      <div className="flex flex-row items-center gap-3 p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100">
          <AlertTriangle size={18} className="text-red-500" />
        </div>
        <p className="flex-1 text-sm text-red-700">{message}</p>
        {onRetry && (
          <Button
            data-umami-event="ui_error_card_tekrar_dene_click"
            size="2"
            variant="ghost"
            onClick={onRetry}
            className="text-red-600 hover:bg-red-100"
          >
            <RefreshCw size={14} />
            Tekrar dene
          </Button>
        )}
      </div>
    </div>
  );
}
