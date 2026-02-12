"use client";

import { useState, useMemo } from "react";
import { Button } from "@radix-ui/themes";
import { ListChecks, Send, Loader2 } from "lucide-react";

import type { CreateJobPayload, JobQuestion } from "@/types";
import { BasicInfoSection } from "./basic-info-section";
import { RequirementsSection } from "./requirements-section";
import { QuestionsSection } from "./questions-section";

interface JobPostingFormProps {
  onSubmit: (input: CreateJobPayload) => void | Promise<void>;
  isSubmitting?: boolean;
}

export function JobPostingForm({
  onSubmit,
  isSubmitting,
}: JobPostingFormProps) {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [requirements, setRequirements] = useState<string[]>([]);
  const [questions, setQuestions] = useState<JobQuestion[]>([]);

  const canSubmit = useMemo(
    () =>
      Boolean(
        title.trim() &&
          company.trim() &&
          location.trim() &&
          shortDescription.trim() &&
          fullDescription.trim() &&
          requirements.length > 0,
      ),
    [
      title,
      company,
      location,
      shortDescription,
      fullDescription,
      requirements.length,
    ],
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    onSubmit({
      title: title.trim(),
      company: company.trim(),
      location: location.trim(),
      shortDescription: shortDescription.trim(),
      fullDescription: fullDescription.trim(),
      requirements,
      questions,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="rounded-2xl border border-dashed border-border/60 bg-surface/50 px-5 py-4 text-sm text-muted-light shadow-inner">
        <p className="flex items-start gap-2 text-foreground/80">
          <ListChecks size={14} className="text-accent mt-0.5" />
          Gerekli alanlar * ile işaretlidir; açıklamaları net yazmak ilanın
          profesyonel görünmesini sağlar.
        </p>
        <p>
          Başvuru soruları opsiyoneldir; sadece adaydan gerçekten bilmesi
          gerekenleri sorun.
        </p>
      </div>

      <BasicInfoSection
        title={title}
        setTitle={setTitle}
        company={company}
        setCompany={setCompany}
        location={location}
        setLocation={setLocation}
        shortDescription={shortDescription}
        setShortDescription={setShortDescription}
        fullDescription={fullDescription}
        setFullDescription={setFullDescription}
      />

      <RequirementsSection
        requirements={requirements}
        setRequirements={setRequirements}
      />

      <QuestionsSection questions={questions} setQuestions={setQuestions} />

      <div className="flex items-center justify-end gap-3 pt-4">
        <Button
          data-umami-event="job_job_posting_form_index_submit_click"
          type="submit"
          size="3"
          disabled={!canSubmit || isSubmitting}
          className="bg-linear-to-r from-accent to-accent-light font-semibold text-white shadow-lg shadow-accent/20 px-10 h-12"
        >
          {isSubmitting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={18} />
          )}
          İlanı Yayınla
        </Button>
      </div>
    </form>
  );
}
