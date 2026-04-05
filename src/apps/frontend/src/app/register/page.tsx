"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, TextField } from "@radix-ui/themes";
import { Mail, Lock, User, UserPlus, ArrowRight } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useShallow } from "zustand/react/shallow";
import { useAuthFlowsStore } from "@/stores/auth-flows-store";

export default function RegisterPage() {
  const router = useRouter();
  const {
    name,
    email,
    password,
    loading,
    error,
    setName,
    setEmail,
    setPassword,
    submitRegister,
    resetRegister,
  } = useAuthFlowsStore(
    useShallow((state) => ({
      name: state.registerName,
      email: state.registerEmail,
      password: state.registerPassword,
      loading: state.registerLoading,
      error: state.registerError,
      setName: state.setRegisterName,
      setEmail: state.setRegisterEmail,
      setPassword: state.setRegisterPassword,
      submitRegister: state.submitRegister,
      resetRegister: state.resetRegister,
    })),
  );

  useEffect(() => {
    resetRegister();
    return resetRegister;
  }, [resetRegister]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = await submitRegister();

    if (result.success) {
      toast.success("Kayıt başarılı! Hoş geldiniz.");
      router.push("/");
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-background px-4 py-12 sm:px-6 lg:px-8">
      {/* Decorative background elements */}
      <div className="absolute -right-[10%] -top-[10%] h-[40%] w-[40%] rounded-full bg-accent/5 blur-[120px]" />
      <div className="absolute -bottom-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-accent-light/5 blur-[120px]" />

      <div className="animate-fade-in-up relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-accent to-accent-light shadow-lg shadow-accent/25 transition-transform hover:scale-105">
            <UserPlus size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Aramıza Katılın
          </h1>
          <p className="mt-2 text-base text-muted">
            Yeni kariyer fırsatları için hemen hesap oluşturun.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="overflow-hidden rounded-3xl border border-white/20 bg-surface/50 p-8 shadow-xl backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-accent/5">
            <div className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-foreground"
                >
                  Ad Soyad
                </label>
                <TextField.Root
                  size="3"
                  variant="surface"
                  className="w-full"
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setName(e.target.value)
                  }
                  placeholder="Adınız Soyadınız"
                  required
                >
                  <TextField.Slot>
                    <User size={18} className="text-muted-light" />
                  </TextField.Slot>
                </TextField.Root>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  E-posta
                </label>
                <TextField.Root
                  size="3"
                  variant="surface"
                  className="w-full"
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  placeholder="ornek@email.com"
                  required
                >
                  <TextField.Slot>
                    <Mail size={18} className="text-muted-light" />
                  </TextField.Slot>
                </TextField.Root>
              </div>

              <div className="space-y-2 mb-4">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Şifre
                </label>
                <TextField.Root
                  size="3"
                  variant="surface"
                  className="w-full"
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  placeholder="En az 6 karakter"
                  required
                >
                  <TextField.Slot>
                    <Lock size={18} className="text-muted-light" />
                  </TextField.Slot>
                </TextField.Root>
              </div>
            </div>

            {error && (
              <div className="mt-4 mb-4 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                <div className="flex gap-3">
                  <div className="shrink-0">•</div>
                  <div>{error}</div>
                </div>
              </div>
            )}

            <Button
              data-umami-event="register_submit_click"
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
                Hesap Oluştur
              </span>
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted">
            Zaten hesabınız var mı?{" "}
            <Link
              data-umami-event="register_go_login_click"
              href="/login"
              className="font-semibold text-accent transition-all hover:text-accent-light hover:underline hover:decoration-2 hover:underline-offset-4"
            >
              Giriş Yapın
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
