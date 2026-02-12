"use client";

import { TextField, TextArea } from "@radix-ui/themes";
import { Briefcase, Building2, MapPin, FileText } from "lucide-react";
import { SectionCard } from "./section-card";

interface BasicInfoSectionProps {
  title: string;
  setTitle: (value: string) => void;
  company: string;
  setCompany: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  shortDescription: string;
  setShortDescription: (value: string) => void;
  fullDescription: string;
  setFullDescription: (value: string) => void;
}

export function BasicInfoSection({
  title,
  setTitle,
  company,
  setCompany,
  location,
  setLocation,
  shortDescription,
  setShortDescription,
  fullDescription,
  setFullDescription,
}: BasicInfoSectionProps) {
  return (
    <SectionCard
      icon={Briefcase}
      title="Temel Bilgiler"
      description="Pozisyonun temel başlığı, şirket bilgisi ve açıklamalarını doldurarak ilanı yapılandırın."
      badge="Zorunlu"
    >
      <div className="flex flex-col gap-2">
        <label
          htmlFor="job-title"
          className="text-sm font-medium text-foreground"
        >
          Pozisyon Başlığı <span className="text-danger">*</span>
        </label>
        <TextField.Root
          size="3"
          variant="surface"
          className="w-full"
          id="job-title"
          placeholder="Örn: Frontend Developer"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
          required
        >
          <TextField.Slot>
            <Briefcase size={18} className="text-muted-light" />
          </TextField.Slot>
        </TextField.Root>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="job-company"
            className="text-sm font-medium text-foreground"
          >
            Şirket Adı <span className="text-danger">*</span>
          </label>
          <TextField.Root
            size="3"
            variant="surface"
            className="w-full"
            id="job-company"
            placeholder="Örn: TeknoSoft A.Ş."
            value={company}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCompany(e.target.value)
            }
            required
          >
            <TextField.Slot>
              <Building2 size={18} className="text-muted-light" />
            </TextField.Slot>
          </TextField.Root>
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="job-location"
            className="text-sm font-medium text-foreground"
          >
            Konum <span className="text-danger">*</span>
          </label>
          <TextField.Root
            size="3"
            variant="surface"
            className="w-full"
            id="job-location"
            placeholder="Örn: İstanbul, Türkiye (Uzaktan)"
            value={location}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setLocation(e.target.value)
            }
            required
          >
            <TextField.Slot>
              <MapPin size={18} className="text-muted-light" />
            </TextField.Slot>
          </TextField.Root>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="job-short-desc"
          className="text-sm font-medium text-foreground"
        >
          Kısa Açıklama <span className="text-danger">*</span>
        </label>
        <TextArea
          id="job-short-desc"
          placeholder="İlan listesinde görünecek kısa tanım (1-2 cümle)"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          required
          rows={4}
          className="min-h-[100px] bg-surface-hover/30 text-base shadow-sm"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="job-full-desc"
          className="text-sm font-medium text-foreground"
        >
          Detaylı Açıklama <span className="text-danger">*</span>
        </label>
        <div className="flex items-start gap-3">
          <div className="pt-1 text-muted-light">
            <FileText size={18} />
          </div>
          <TextArea
            id="job-full-desc"
            placeholder="Görev tanımı, sunduğunuz imkanlar, çalışma ortamı vb. detayları yazın..."
            value={fullDescription}
            onChange={(e) => setFullDescription(e.target.value)}
            required
            rows={10}
            className="min-h-[300px] w-full bg-surface-hover/30 text-base shadow-sm"
          />
        </div>
      </div>
    </SectionCard>
  );
}
