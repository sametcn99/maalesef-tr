"use client";

import { useState, useCallback } from "react";
import { TextField, Button } from "@radix-ui/themes";
import { Plus, ListChecks, X } from "lucide-react";
import { SectionCard } from "./section-card";

interface RequirementsSectionProps {
  requirements: string[];
  setRequirements: (requirements: string[]) => void;
}

export function RequirementsSection({
  requirements,
  setRequirements,
}: RequirementsSectionProps) {
  const [requirementInput, setRequirementInput] = useState("");

  const addRequirement = useCallback(() => {
    const val = requirementInput.trim();
    if (val && !requirements.includes(val)) {
      setRequirements([...requirements, val]);
      setRequirementInput("");
    }
  }, [requirementInput, requirements, setRequirements]);

  const removeRequirement = useCallback(
    (index: number) => {
      setRequirements(requirements.filter((_, i) => i !== index));
    },
    [requirements, setRequirements],
  );

  return (
    <SectionCard
      icon={ListChecks}
      title="Aranan Nitelikler"
      description="Bu nitelikler ilan metninde öne çıkacak; adayları net bir şekilde yönlendirin."
      badge={
        requirements.length > 0
          ? `${requirements.length} nitelik`
          : "Henüz eklenmedi"
      }
    >
      <div className="flex flex-col gap-2">
        <label
          htmlFor="req-input"
          className="text-sm font-medium text-foreground"
        >
          Nitelik Ekle
        </label>
        <div className="flex items-center gap-2">
          <TextField.Root
            id="req-input"
            size="3"
            variant="surface"
            placeholder="Bir nitelik ekleyin ve Enter'a basın"
            value={requirementInput}
            onChange={(e) => setRequirementInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addRequirement();
              }
            }}
            className="flex-1"
          />
          <Button
            data-umami-event="job_posting_requirements_add_click"
            type="button"
            size="2"
            variant="soft"
            onClick={addRequirement}
            disabled={!requirementInput.trim()}
            className="h-10 w-10 min-w-10 shrink-0 bg-accent-muted text-accent p-0"
          >
            <Plus size={18} />
          </Button>
        </div>
      </div>

      {requirements.length > 0 ? (
        <div className="flex flex-wrap gap-2 mt-2">
          {requirements.map((req, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: Requirements list
              key={`req-${i}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-hover px-3 py-2 text-sm text-foreground"
            >
              {req}
              <button
                data-umami-event="job_job_posting_form_requirements_section_remove_click"
                type="button"
                onClick={() => removeRequirement(i)}
                className="ml-1 text-muted hover:text-red-500 transition-colors"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-light italic">
          Henüz nitelik eklenmedi.
        </p>
      )}
    </SectionCard>
  );
}
