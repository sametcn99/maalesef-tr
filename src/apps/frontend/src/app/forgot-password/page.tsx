"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, TextField } from "@radix-ui/themes";
import { ArrowRight, KeyRound, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { forgotPassword } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await forgotPassword(email);
      setSuccessMessage(result.message);
      toast.success("Şifre sıfırlama bağlantısı gönderildi.");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Bir hata oluştu. Lütfen tekrar deneyin.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute -right-[10%] -top-[10%] h-[40%] w-[40%] rounded-full bg-accent/5 blur-[120px]" />
      <div className="absolute -bottom-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-accent-light/5 blur-[120px]" />

      <div className="animate-fade-in-up relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-accent to-accent-light shadow-lg shadow-accent/25 transition-transform hover:scale-105">
            <KeyRound size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Şifreni sıfırla
          </h1>
          <p className="mt-2 text-base text-muted">
            Hesabına bağlı e-posta adresini gir. Sana güvenli bir sıfırlama
            bağlantısı gönderelim.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="overflow-hidden rounded-3xl border border-white/20 bg-surface/50 p-8 shadow-xl backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-accent/5">
            <div className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  E-posta
                </label>
                <TextField.Root
                  id="email"
                  size="3"
                  variant="surface"
                  className="w-full"
                  type="email"
                  value={email}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(event.target.value)
                  }
                  placeholder="ornek@email.com"
                  required
                >
                  <TextField.Slot>
                    <Mail size={18} className="text-muted-light" />
                  </TextField.Slot>
                </TextField.Root>
              </div>
            </div>

            {successMessage && (
              <div className="mt-4 mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                {successMessage}
              </div>
            )}

            {error && (
              <div className="mt-4 mb-4 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                <div className="flex gap-3">
                  <div className="shrink-0">•</div>
                  <div>{error}</div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              size="3"
              className="group mt-8 h-12 w-full bg-linear-to-r from-accent to-accent-light font-bold text-white shadow-lg shadow-accent/25 transition-all duration-300 hover:shadow-xl hover:shadow-accent/30 hover:scale-[1.02]"
            >
              <span className="inline-flex items-center gap-2">
                {loading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />
                ) : (
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                )}
                Sıfırlama Bağlantısı Gönder
              </span>
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm text-muted">
          <Link
            href="/login"
            className="font-semibold text-accent transition-all hover:text-accent-light hover:underline hover:decoration-2 hover:underline-offset-4"
          >
            Giriş ekranına dön
          </Link>
        </div>
      </div>
    </div>
  );
}
