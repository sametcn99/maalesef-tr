"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, TextField } from "@radix-ui/themes";
import { Mail, Lock, LogIn, ArrowRight } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/context/auth-context";
import { Suspense } from "react";

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      toast.success("Giriş başarılı!");
      router.push(redirect);
    } else {
      setError(result.error || "Giriş yapılamadı.");
    }

    setLoading(false);
  }

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-background px-4 py-12 sm:px-6 lg:px-8">
      {/* Decorative background elements */}
      <div className="absolute -left-[10%] -top-[10%] h-[40%] w-[40%] rounded-full bg-accent/5 blur-[120px]" />
      <div className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-accent-light/5 blur-[120px]" />

      <div className="animate-fade-in-up relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-accent to-accent-light shadow-lg shadow-accent/25 transition-transform hover:scale-105">
            <LogIn size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Hoş Geldiniz
          </h1>
          <p className="mt-2 text-base text-muted">
            Kariyer yolculuğunuza devam etmek için giriş yapın.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="overflow-hidden rounded-3xl border border-white/20 bg-surface/50 p-8 shadow-xl backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-accent/5 dark:bg-surface/30">
            <div className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  E-posta
                </label>
                <TextField.Root
                  size="3"
                  className="w-full"
                  variant="surface"
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  placeholder=""
                  required
                  style={{
                    background: "transparent",
                  }}
                >
                  <TextField.Slot>
                    <Mail size={18} className="text-muted-light" />
                  </TextField.Slot>
                </TextField.Root>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Şifre
                </label>
                <div className="space-y-1">
                  <TextField.Root
                    size="3"
                    className="w-full"
                    variant="surface"
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPassword(e.target.value)
                    }
                    placeholder="••••••"
                    required
                  >
                    <TextField.Slot>
                      <Lock size={18} className="text-muted-light" />
                    </TextField.Slot>
                  </TextField.Root>
                  <div className="flex justify-end">
                    <Link
                      data-umami-event="login_forgot_password_click"
                      href="#"
                      className="text-xs font-medium text-muted hover:text-accent transition-colors"
                    >
                      Şifremi unuttum?
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/20 dark:bg-red-900/10 dark:text-red-400">
                <div className="flex gap-3">
                  <div className="shrink-0">•</div>
                  <div>{error}</div>
                </div>
              </div>
            )}

            <Button
              data-umami-event="login_submit_click"
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
                Giriş Yap
              </span>
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted">
            Hesabınız yok mu?{" "}
            <Link
              data-umami-event="login_go_register_click"
              href="/register"
              className="font-semibold text-accent transition-all hover:text-accent-light hover:underline hover:decoration-2 hover:underline-offset-4"
            >
              Hemen Kayıt Olun
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
