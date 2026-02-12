"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  TextField,
  TextArea,
  Select,
  Checkbox,
  Separator,
  Dialog,
} from "@radix-ui/themes";
import {
  ArrowLeft,
  Building2,
  Send,
  FileQuestion,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

import { useJob, useSubmitApplication } from "@/hooks";
import { useAuth } from "@/context/auth-context";
import { CvUpload } from "@/components/application";
import { ErrorCard, DetailSkeleton } from "@/components/ui";

export default function ApplyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { job, loading, error } = useJob(id);
  const { submit, submitting } = useSubmitApplication();

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [aiConsent, setAiConsent] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  // Redirect to login if not authenticated (wait for auth to finish loading)
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace(`/login?redirect=/jobs/${id}/apply`);
    }
  }, [isAuthenticated, authLoading, router, id]);

  function updateAnswer(questionId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function isFormValid(): boolean {
    if (!job || !aiConsent) return false;
    for (const q of job.questions) {
      if (q.required && !answers[q.id]?.trim()) return false;
    }
    return true;
  }

  async function handleSubmit() {
    if (!job || !isFormValid()) return;

    const result = await submit(job.id, job.title, answers, cvFile, aiConsent);
    if (result) {
      toast.success(
        "Başvurunuz alınmıştır. Sonuçlar profilinize ve e-posta adresinize gönderilecektir.",
        { icon: "📨" },
      );
      router.push("/profile");
    } else {
      toast.error("Başvuru gönderilemedi. Lütfen tekrar deneyin.");
    }
  }

  if (authLoading || !isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <DetailSkeleton />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <ErrorCard message={error || "İlan bulunamadı."} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {/* Back button */}
      <button
        data-umami-event="jobs_job_apply_back_click"
        type="button"
        onClick={() => router.back()}
        className="animate-fade-in mb-8 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted transition-all duration-200 hover:bg-surface-hover hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Geri
      </button>

      <div className="animate-fade-in-up space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-light text-lg font-bold text-white shadow-lg shadow-accent/20">
              {job.company.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Başvuru Formu
              </h1>
              <p className="mt-1 text-sm text-muted">
                <span className="font-medium text-foreground">{job.title}</span>{" "}
                —{" "}
                <span className="inline-flex items-center gap-1">
                  <Building2 size={12} />
                  {job.company}
                </span>
              </p>
            </div>
          </div>
        </div>

        <Separator className="bg-border" size="4" />

        {/* Company Questions */}
        <div>
          <div className="mb-5 flex items-center gap-2">
            <FileQuestion size={16} className="text-accent" />
            <h2 className="text-sm font-semibold uppercase tracking-widest text-accent">
              Firma Soruları
            </h2>
          </div>

          <div className="space-y-6">
            {job.questions.map((q) => {
              if (q.type === "textarea") {
                return (
                  <div key={q.id} className="space-y-2">
                    <label
                      htmlFor={`q-${q.id}`}
                      className="text-sm font-medium text-foreground block"
                    >
                      {q.label}{" "}
                      {q.required && <span className="text-danger">*</span>}
                    </label>
                    <TextArea
                      id={`q-${q.id}`}
                      placeholder={q.placeholder}
                      value={answers[q.id] || ""}
                      onChange={(e) => updateAnswer(q.id, e.target.value)}
                      required={q.required}
                      rows={3}
                      className="border-border bg-surface text-sm shadow-none hover:border-border-hover"
                    />
                  </div>
                );
              }

              if (q.type === "select" && q.options) {
                return (
                  <div key={q.id} className="space-y-2">
                    <span className="text-sm font-medium text-foreground block">
                      {q.label}{" "}
                      {q.required && <span className="text-danger">*</span>}
                    </span>
                    <Select.Root
                      value={answers[q.id] || ""}
                      onValueChange={(val) => updateAnswer(q.id, val)}
                      required={q.required}
                    >
                      <Select.Trigger
                        placeholder="Seçiniz..."
                        className="border-border bg-surface text-sm hover:border-border-hover"
                      />
                      <Select.Content className="bg-surface">
                        {q.options.map((opt) => (
                          <Select.Item key={opt} value={opt}>
                            {opt}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  </div>
                );
              }

              return (
                <div key={q.id} className="space-y-2">
                  <label
                    htmlFor={`q-${q.id}`}
                    className="text-sm font-medium text-foreground block"
                  >
                    {q.label}{" "}
                    {q.required && <span className="text-danger">*</span>}
                  </label>
                  <TextField.Root
                    size="3"
                    className="w-full"
                    variant="surface"
                    id={`q-${q.id}`}
                    placeholder={q.placeholder}
                    value={answers[q.id] || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateAnswer(q.id, e.target.value)
                    }
                    required={q.required}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <Separator className="bg-border" size="4" />

        {/* CV Upload */}
        <div>
          <div className="mb-5 flex items-center gap-2">
            <ShieldCheck size={16} className="text-accent" />
            <h2 className="text-sm font-semibold uppercase tracking-widest text-accent">
              CV Yükleme
            </h2>
          </div>

          <CvUpload onFileSelect={setCvFile} disabled={submitting} />
        </div>

        <Separator className="bg-border" size="4" />

        {/* AI Consent + Submit */}
        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-surface p-5">
            <Checkbox
              checked={aiConsent}
              onCheckedChange={(checked) => setAiConsent(!!checked)}
              required
              className="items-start"
            />
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-foreground">
                CV&apos;min AI tool&apos;ları ile işlenmesini kabul ediyorum{" "}
                <span className="text-danger">*</span>
              </span>
              <button
                data-umami-event="jobs_apply_open_processing_info_click"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsInfoModalOpen(true);
                }}
                className="w-fit cursor-pointer text-xs text-accent hover:underline bg-transparent border-none p-0"
              >
                Nasıl işleniyor?
              </button>
            </div>
          </div>

          <Button
            data-umami-event="jobs_apply_submit_click"
            onClick={handleSubmit}
            disabled={!isFormValid() || submitting}
            size="3"
            className="h-12 w-full bg-gradient-to-r from-accent to-accent-light font-semibold text-white shadow-lg shadow-accent/25 transition-all duration-200 hover:shadow-xl hover:shadow-accent/30 hover:scale-[1.01] disabled:opacity-40 disabled:shadow-none"
          >
            <span className="inline-flex items-center gap-2">
              {submitting ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />
              ) : (
                <Send size={16} />
              )}
              Başvuruyu Gönder
            </span>
          </Button>

          {/* Info */}
          <div className="rounded-xl border border-border bg-accent-muted/30 p-4">
            <p className="text-xs leading-relaxed text-muted">
              Sonuçlar profilinize bildirim olarak ve e-posta yoluyla
              iletilecektir.
            </p>
          </div>
        </div>
      </div>

      <Dialog.Root open={isInfoModalOpen} onOpenChange={setIsInfoModalOpen}>
        <Dialog.Content className="max-w-lg">
          <Dialog.Title>Veri İşleme Bilgilendirmesi</Dialog.Title>
          <Dialog.Description className="text-sm text-foreground/80">
            Yüklediğiniz PDF dosyası sunucuda güvenli bir şekilde işlenerek
            metin haline dönüştürülür. Bu metin, başvurunuz değerlendirilirken
            AI modellerimiz tarafından analiz edilir. Dosyanız ve işlenen
            veriler, size geri dönüş sağlanana kadar sistemlerimizde saklanır ve
            geri dönüş sağlandığı anda sunucularımızdan kalıcı olarak silinir.
          </Dialog.Description>
          <Button
            data-umami-event="jobs_job_apply_anladim_click"
            onClick={() => setIsInfoModalOpen(false)}
            size="3"
            className="mt-4 bg-accent text-white hover:brightness-110"
          >
            Anladım
          </Button>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}
