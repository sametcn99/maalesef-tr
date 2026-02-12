"use client";

import { useState, useCallback } from "react";
import { TextField, Button, Separator } from "@radix-ui/themes";
import {
  Plus,
  Trash2,
  HelpCircle,
  AlignLeft,
  AlignJustify,
  List,
  X,
} from "lucide-react";
import type { JobQuestion } from "@/types";
import { SectionCard } from "./section-card";

const questionTypes: {
  id: JobQuestion["type"];
  label: string;
  icon: typeof AlignLeft;
}[] = [
  { id: "text", label: "Kısa Metin", icon: AlignLeft },
  { id: "textarea", label: "Uzun Metin", icon: AlignJustify },
  { id: "select", label: "Seçenekli", icon: List },
];

interface QuestionsSectionProps {
  questions: JobQuestion[];
  setQuestions: (questions: JobQuestion[]) => void;
}

export function QuestionsSection({
  questions,
  setQuestions,
}: QuestionsSectionProps) {
  // Question form state
  const [qLabel, setQLabel] = useState("");
  const [qType, setQType] = useState<JobQuestion["type"]>("text");
  const [qPlaceholder, setQPlaceholder] = useState("");
  const [qRequired, setQRequired] = useState(true);
  const [qOptionInput, setQOptionInput] = useState("");
  const [qOptions, setQOptions] = useState<string[]>([]);

  const addQOption = useCallback(() => {
    const val = qOptionInput.trim();
    if (val && !qOptions.includes(val)) {
      setQOptions((prev) => [...prev, val]);
      setQOptionInput("");
    }
  }, [qOptionInput, qOptions]);

  const removeQOption = useCallback((index: number) => {
    setQOptions((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const addQuestion = useCallback(() => {
    if (!qLabel.trim()) return;
    if (qType === "select" && qOptions.length < 2) return;

    const q: JobQuestion = {
      id: `q${Date.now()}`,
      label: qLabel.trim(),
      type: qType,
      placeholder: qPlaceholder.trim() || undefined,
      options: qType === "select" ? qOptions : undefined,
      required: qRequired,
    };

    setQuestions([...questions, q]);
    setQLabel("");
    setQType("text");
    setQPlaceholder("");
    setQRequired(true);
    setQOptions([]);
    setQOptionInput("");
  }, [
    qLabel,
    qType,
    qPlaceholder,
    qRequired,
    qOptions,
    questions,
    setQuestions,
  ]);

  const removeQuestion = useCallback(
    (index: number) => {
      setQuestions(questions.filter((_, i) => i !== index));
    },
    [questions, setQuestions],
  );

  return (
    <SectionCard
      icon={HelpCircle}
      title="Başvuru Soruları"
      description="Opsiyonel sorularla aday profilini derinlemesine ölçün ve filtreleme kapasitenizi artırın."
      badge={
        questions.length > 0 ? `${questions.length} aktif soru` : "Opsiyonel"
      }
    >
      {/* Existing questions */}
      {questions.length > 0 && (
        <div className="space-y-3">
          {questions.map((q, i) => {
            const TypeIcon =
              questionTypes.find((qt) => qt.id === q.type)?.icon || AlignLeft;
            return (
              <div
                key={q.id}
                className="group flex flex-col sm:flex-row sm:items-start justify-between gap-3 rounded-xl border border-border bg-background p-4 transition-colors hover:border-accent/40"
              >
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="flex items-start gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-hover text-xs font-medium text-muted shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <div className="space-y-1">
                      <p className="font-medium text-foreground text-sm">
                        {q.label}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-xs text-muted-light">
                          <TypeIcon size={12} />
                          {questionTypes.find((t) => t.id === q.type)?.label}
                        </span>
                        {q.required && (
                          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-600">
                            Zorunlu
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {q.options && (
                    <div className="flex flex-wrap gap-1.5 pl-8">
                      {q.options.map((opt, oi) => (
                        <span
                          // biome-ignore lint/suspicious/noArrayIndexKey: Question options
                          key={`opt-${oi}`}
                          className="text-xs text-muted bg-surface-hover border border-border rounded px-2 py-0.5"
                        >
                          {opt}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  data-umami-event="job_job_posting_form_questions_section_remove_click"
                  type="button"
                  onClick={() => removeQuestion(i)}
                  className="text-muted hover:text-red-500 transition-colors shrink-0 self-end sm:self-start p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <Separator size="4" />

      {/* Add new question */}
      <div className="space-y-5 rounded-xl border-dashed border-2 border-border/60 bg-surface/50 p-6">
        <p className="text-base font-medium text-foreground flex items-center gap-2">
          <Plus size={16} className="text-accent" />
          Yeni Soru Ekle
        </p>

        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="q-label"
              className="text-sm font-medium text-foreground"
            >
              Soru Metni
            </label>
            <TextField.Root
              id="q-label"
              size="3"
              variant="surface"
              placeholder="Örn: Maaş beklentiniz nedir?"
              value={qLabel}
              onChange={(e) => setQLabel(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium text-foreground block">
              Soru Tipi
            </span>
            <div className="grid grid-cols-3 gap-3">
              {questionTypes.map((type) => (
                <button
                  data-umami-event="job_posting_question_select_type_click"
                  key={type.id}
                  type="button"
                  onClick={() => setQType(type.id)}
                  className={`flex flex-col items-center justify-center gap-2 rounded-lg border p-3 text-sm transition-all ${
                    qType === type.id
                      ? "border-accent bg-accent-muted/30 text-accent font-medium shadow-sm"
                      : "border-border bg-background text-muted hover:border-muted-light/60 hover:bg-surface-hover"
                  }`}
                >
                  <type.icon size={20} />
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="q-placeholder"
              className="text-sm font-medium text-foreground"
            >
              Placeholder
            </label>
            <TextField.Root
              id="q-placeholder"
              size="3"
              variant="surface"
              placeholder="İsteğe bağlı ipucu metni"
              value={qPlaceholder}
              onChange={(e) => setQPlaceholder(e.target.value)}
            />
          </div>
        </div>

        {/* Select options */}
        {qType === "select" && (
          <div className="space-y-3 bg-surface-hover/50 p-4 rounded-lg border border-border/50">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="q-option-input"
                className="text-sm font-medium text-foreground"
              >
                Seçenekler
              </label>
              <div className="flex items-center gap-2">
                <TextField.Root
                  id="q-option-input"
                  size="3"
                  variant="surface"
                  placeholder="Bir seçenek ekleyin ve Enter'a basın"
                  value={qOptionInput}
                  onChange={(e) => setQOptionInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addQOption();
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  data-umami-event="job_posting_question_add_option_click"
                  type="button"
                  size="2"
                  variant="soft"
                  onClick={addQOption}
                  disabled={!qOptionInput.trim()}
                  className="h-10 w-10 min-w-10 shrink-0 bg-accent-muted text-accent p-0"
                >
                  <Plus size={18} />
                </Button>
              </div>
            </div>

            {qOptions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {qOptions.map((opt, i) => (
                  <span
                    // biome-ignore lint/suspicious/noArrayIndexKey: Question options
                    key={`qopt-${i}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-hover px-3 py-1.5 text-sm text-foreground"
                  >
                    {opt}
                    <button
                      data-umami-event="job_job_posting_form_questions_section_remove_click_2"
                      type="button"
                      onClick={() => removeQOption(i)}
                      className="ml-1 text-muted hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {qOptions.length < 2 && (
              <p className="text-xs text-muted-light flex items-center gap-1">
                <HelpCircle size={12} />
                En az 2 seçenek eklemelisiniz.
              </p>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div
            className="flex items-center gap-3 cursor-pointer group outline-none"
            onClick={() => setQRequired(!qRequired)}
            role="switch"
            aria-checked={qRequired}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setQRequired(!qRequired);
              }
            }}
          >
            <div
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                qRequired
                  ? "bg-accent"
                  : "bg-border group-hover:bg-border-hover"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                  qRequired ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </div>
            <span className="text-sm text-foreground select-none">
              Zorunlu soru
            </span>
          </div>

          <Button
            data-umami-event="job_posting_question_add_click"
            type="button"
            variant="solid"
            onClick={addQuestion}
            disabled={
              !qLabel.trim() || (qType === "select" && qOptions.length < 2)
            }
            className="bg-accent text-white font-medium shadow-sm hover:shadow-md"
          >
            <Plus size={16} />
            Soruyu Ekle
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}
