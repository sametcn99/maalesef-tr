"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, TextField } from "@radix-ui/themes";
import { ArrowRight, KeyRound, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { useShallow } from "zustand/react/shallow";
import { useAuthFlowsStore } from "@/stores/auth-flows-store";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const {
    newPassword,
    confirmPassword,
    loading,
    error,
    setNewPassword,
    setConfirmPassword,
    submitResetPassword,
    resetResetPassword,
  } = useAuthFlowsStore(
    useShallow((state) => ({
      newPassword: state.resetNewPassword,
      confirmPassword: state.resetConfirmPassword,
      loading: state.resetLoading,
      error: state.resetError,
      setNewPassword: state.setResetNewPassword,
      setConfirmPassword: state.setResetConfirmPassword,
      submitResetPassword: state.submitResetPassword,
      resetResetPassword: state.resetResetPassword,
    })),
  );

  useEffect(() => {
    resetResetPassword();
    return resetResetPassword;
  }, [resetResetPassword]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = await submitResetPassword(token);
    if (result.success && result.message) {
      toast.success(result.message);
      router.push("/login");
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute -left-[10%] -top-[10%] h-[40%] w-[40%] rounded-full bg-accent/5 blur-[120px]" />
      <div className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-accent-light/5 blur-[120px]" />

      <div className="animate-fade-in-up relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-accent to-accent-light shadow-lg shadow-accent/25 transition-transform hover:scale-105">
            <KeyRound size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Yeni şifre belirle
          </h1>
          <p className="mt-2 text-base text-muted">
            Güçlü bir şifre seç. Bu bağlantı yalnızca kısa bir süre için
            geçerlidir.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="overflow-hidden rounded-3xl border border-white/20 bg-surface/50 p-8 shadow-xl backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-accent/5">
            {!token && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                Şifre sıfırlama bağlantısı eksik veya bozuk görünüyor.
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="newPassword"
                  className="text-sm font-medium text-foreground"
                >
                  Yeni şifre
                </label>
                <TextField.Root
                  id="newPassword"
                  size="3"
                  variant="surface"
                  className="w-full"
                  type="password"
                  value={newPassword}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setNewPassword(event.target.value)
                  }
                  placeholder="En az 8 karakter"
                  required
                  minLength={8}
                >
                  <TextField.Slot>
                    <Lock size={18} className="text-muted-light" />
                  </TextField.Slot>
                </TextField.Root>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-foreground"
                >
                  Yeni şifre tekrar
                </label>
                <TextField.Root
                  id="confirmPassword"
                  size="3"
                  variant="surface"
                  className="w-full"
                  type="password"
                  value={confirmPassword}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Şifreni tekrar gir"
                  required
                  minLength={8}
                >
                  <TextField.Slot>
                    <Lock size={18} className="text-muted-light" />
                  </TextField.Slot>
                </TextField.Root>
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                <div className="flex gap-3">
                  <div className="shrink-0">•</div>
                  <div>{error}</div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !token}
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
                Şifreyi Güncelle
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

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
