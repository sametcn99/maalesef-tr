"use client";

import { trackShare } from "@/lib/api";
import { REJECTION_SHARE_MESSAGES } from "@/lib/rejection-share-messages";
import { Linkedin, Share2 } from "lucide-react";
import { useState } from "react";

interface RejectionShareProps {
  message?: string;
}

export function RejectionShare({ message: propMessage }: RejectionShareProps) {
  const [_copied, setCopied] = useState(false);

  const getMessage = () => {
    if (propMessage) return propMessage;
    return REJECTION_SHARE_MESSAGES[
      Math.floor(Math.random() * REJECTION_SHARE_MESSAGES.length)
    ];
  };

  const handleShareX = () => {
    const message = getMessage();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    _handleTrackShare();
  };

  const handleShareLinkedin = () => {
    const message = getMessage();
    const url = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    _handleTrackShare();
  };

  const handleWebShare = async () => {
    const message = getMessage();
    if (navigator.share) {
      try {
        await navigator.share({
          title: "maalesef",
          text: message,
          url: window.location.origin,
        });
        // Track the share
        await _handleTrackShare();
      } catch (err) {
        console.error("Paylaşım hatası:", err);
      }
    }
  };

  const _handleTrackShare = async () => {
    try {
      await trackShare();
    } catch (err) {
      console.error("Share tracking error:", err);
    }
  };

  const _handleCopy = () => {
    const message = getMessage();
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-4 pt-4 border-t border-border/50">
      <p className="text-[11px] font-semibold text-muted-light uppercase tracking-wider mb-2">
        Bu anı ölümsüzleştir
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {typeof navigator !== "undefined" && !!navigator.share && (
          <button
            data-umami-event="ui_rejection_share_share_click"
            type="button"
            onClick={handleWebShare}
            className="inline-flex h-8 items-center gap-2 rounded-lg bg-accent text-[12px] font-medium text-white px-3 transition hover:brightness-95"
          >
            <Share2 size={14} />
            Paylaş
          </button>
        )}
        <button
          data-umami-event="rejection_share_x_click"
          type="button"
          onClick={handleShareX}
          className="inline-flex h-8 items-center gap-2 rounded-lg bg-black text-[12px] font-medium text-white px-3 transition hover:bg-black/80"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-3.5 h-3.5"
            aria-labelledby="x-logo-title"
          >
            <title id="x-logo-title">X Logo</title>
            <path d="M18.901 0h3.68l-8.04 9.17L24 24h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 0h7.533l5.262 6.96L18.901 0ZM17.61 22.044h2.039L6.486 1.906H4.298l13.312 20.138Z" />
          </svg>
          X'te Paylaş
        </button>
        <button
          data-umami-event="ui_rejection_share_share_linkedin_click"
          type="button"
          onClick={handleShareLinkedin}
          className="inline-flex h-8 items-center gap-2 rounded-lg bg-[#0077b5] text-[12px] font-medium text-white px-3 transition hover:bg-[#0077b5]/80"
        >
          <Linkedin size={14} />
          Linkedin
        </button>
      </div>
    </div>
  );
}
