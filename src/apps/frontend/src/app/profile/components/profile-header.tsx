"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge, Button } from "@radix-ui/themes";
import { User as UserIcon } from "lucide-react";
import { resendVerificationEmail } from "@/lib/api";
import type { User as UserType } from "@/types";

interface ProfileHeaderProps {
  user: UserType | null;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(
      () => setResendCooldown((prev) => Math.max(prev - 1, 0)),
      1000,
    );
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const emailBadge = useMemo(() => {
    if (!user) return null;
    if (user.emailVerified) {
      return (
        <div className="mt-2 inline-flex items-center gap-2">
          <Badge color="green" variant="soft">
            E-posta doğrulandı
          </Badge>
        </div>
      );
    }

    return (
      <div className="mt-3 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge color="red" variant="solid">
            E-posta doğrulanmadı
          </Badge>
          <span className="text-sm text-muted">
            Başvurularınla ilgili bildirimleri alabilmen için e-postanı doğrula.
          </span>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              data-umami-event="profile_resend_verification_email_click"
              size="2"
              color="indigo"
              variant="solid"
              onClick={async () => {
                setResendError(null);
                setResendMessage(null);
                setResendLoading(true);
                try {
                  const result = await resendVerificationEmail();
                  setResendMessage(
                    result.message ?? "Doğrulama e-postası gönderildi.",
                  );
                  setResendCooldown(300);
                } catch (err) {
                  const message =
                    err instanceof Error
                      ? err.message
                      : "E-posta gönderilirken bir sorun oluştu.";
                  setResendError(message);

                  const match = message.match(/(\d+) saniye/);
                  if (match) {
                    setResendCooldown(Number.parseInt(match[1], 10));
                  }
                } finally {
                  setResendLoading(false);
                }
              }}
              disabled={resendLoading || resendCooldown > 0}
            >
              {resendLoading
                ? "Gönderiliyor..."
                : resendCooldown > 0
                  ? `Tekrar gönder (${resendCooldown}s)`
                  : "Doğrulama e-postasını tekrar gönder"}
            </Button>
            {resendMessage && (
              <span className="text-sm text-green-700">{resendMessage}</span>
            )}
            {resendError && (
              <span className="text-sm text-red-600">{resendError}</span>
            )}
          </div>
          <p className="max-w-md text-xs text-muted">
            <span className="font-semibold text-orange-600">Önemli:</span>{" "}
            Mailinizi doğruladıktan sonra gelen maili "spam değil" olarak
            işaretleyin ki başvuru sonuçlarınız spam klasörüne düşüp
            kaybolmasın.
          </p>
        </div>
      </div>
    );
  }, [user, resendCooldown, resendError, resendLoading, resendMessage]);

  return (
    <div className="flex items-start gap-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-light text-lg font-bold text-white shadow-lg shadow-accent/20">
        <UserIcon size={24} />
      </div>
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Profilim
        </h1>
        <p className="mt-1 text-sm text-muted">
          {user?.name} — {user?.email}
        </p>
        {emailBadge}
      </div>
    </div>
  );
}
