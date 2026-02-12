"use client";

import { useRef, useState, useCallback, useId } from "react";
import { Button, Badge } from "@radix-ui/themes";
import { Upload, FileText, X, CheckCircle2 } from "lucide-react";

interface CvUploadProps {
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
}

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export function CvUpload({ onFileSelect, disabled }: CvUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (selected: File | null) => {
      setError(null);

      if (!selected) {
        setFile(null);
        onFileSelect(null);
        return;
      }

      if (selected.type !== "application/pdf") {
        setError("Yalnızca PDF dosyaları kabul edilmektedir.");
        return;
      }

      if (selected.size > MAX_SIZE) {
        setError("Dosya boyutu en fazla 5MB olabilir.");
        return;
      }

      setFile(selected);
      onFileSelect(selected);
    },
    [onFileSelect],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = e.dataTransfer.files[0] ?? null;
      handleFile(dropped);
    },
    [handleFile],
  );

  const clearFile = () => {
    setFile(null);
    setError(null);
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      <label
        htmlFor={inputId}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        className={`relative flex w-full min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent ${
          error
            ? "border-red-300 bg-red-50/50 dark:border-red-800 dark:bg-red-950/10"
            : isDragging
              ? "border-accent bg-accent-muted scale-[1.01]"
              : file
                ? "border-accent/40 bg-accent-muted/30"
                : "border-border bg-background hover:border-accent/40 hover:bg-accent-muted/20"
        } ${disabled ? "pointer-events-none opacity-50" : ""}`}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          id={inputId}
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          disabled={disabled}
        />

        {file ? (
          <div className="flex items-center gap-4 px-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-muted">
              <FileText size={22} className="text-accent" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-foreground">{file.name}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs text-muted">
                  {(file.size / 1024).toFixed(0)} KB
                </span>
                <Badge size="1" variant="soft" color="green" className="gap-1">
                  <CheckCircle2 size={10} /> Hazır
                </Badge>
              </div>
            </div>
            <Button
              data-umami-event="application_cv_remove_file_click"
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              variant="ghost"
              size="2"
              className="ml-auto h-8 w-8 min-w-8 rounded-full p-0 text-muted hover:text-foreground"
              aria-label="Dosyayı kaldır"
            >
              <X size={16} />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 px-4 py-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-muted transition-colors">
              <Upload
                size={22}
                className={`transition-colors ${isDragging ? "text-accent" : "text-muted"}`}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                CV dosyanızı sürükleyin
              </p>
              <p className="mt-0.5 text-xs text-muted">
                veya{" "}
                <span className="font-medium text-accent">
                  tıklayarak seçin
                </span>
              </p>
            </div>
            <div className="flex gap-2">
              <Badge size="1" variant="soft" className="h-5 text-[10px]">
                PDF
              </Badge>
              <Badge size="1" variant="soft" className="h-5 text-[10px]">
                Max 5MB
              </Badge>
            </div>
          </div>
        )}
      </label>

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 dark:bg-red-950/20">
          <X size={14} className="shrink-0 text-red-500" />
          <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
