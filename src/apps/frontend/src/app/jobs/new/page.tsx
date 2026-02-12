"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { JobPostingForm } from "@/components/job/job-posting-form";
import { useJobPosting } from "@/context/job-posting-context";
import { useAuth } from "@/context/auth-context";
import { Button } from "@radix-ui/themes";
import { ArrowLeft, LogIn } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import type { CreateJobPayload } from "@/types";

export default function NewJobPage() {
  const router = useRouter();
  const { addJob } = useJobPosting();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(input: CreateJobPayload) {
    setIsSubmitting(true);
    try {
      await addJob(input);
      toast.success("İlan başarıyla yayınlandı!");
      router.push("/jobs");
    } catch (error) {
      console.error("İlan oluşturulamadı:", error);
      toast.error("İlan oluşturulurken bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (authLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
        <div className="animate-fade-in flex flex-col items-center justify-center text-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-accent-muted">
            <LogIn size={32} className="text-accent" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              Giriş Yapmalısınız
            </h1>
            <p className="text-muted">
              İlan yayınlamak için önce hesabınıza giriş yapın.
            </p>
          </div>
          <Button
            data-umami-event="jobs_new_go_login_redirect_jobs_new_click"
            asChild
            size="3"
            className="bg-linear-to-r from-accent to-accent-light font-medium text-white"
          >
            <Link
              data-umami-event="jobs_new_go_login_redirect_jobs_new_click_2"
              href="/login?redirect=/jobs/new"
              className="inline-flex items-center gap-2"
            >
              <LogIn size={16} /> Giriş Yap
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="animate-fade-in mb-8">
        <Button
          data-umami-event="jobs_new_go_jobs_click"
          asChild
          size="2"
          variant="ghost"
          className="-ml-3 mb-4 text-muted hover:text-foreground"
        >
          <Link
            data-umami-event="jobs_new_go_jobs_click_2"
            href="/jobs"
            className="inline-flex items-center gap-2"
          >
            <ArrowLeft size={16} /> İlanlara Dön
          </Link>
        </Button>

        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Yeni İlan Oluştur
        </h1>
        <p className="mt-2 text-sm text-muted">
          İlan bilgilerini doldurun ve yayınlayın. İlan, ilanlar listesinde
          görünecektir.
        </p>
      </div>

      <div className="animate-fade-in-up">
        <JobPostingForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}
