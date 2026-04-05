import type { Application } from "@/types";
import { request } from "./core";

export async function getApplications(): Promise<Application[]> {
  return request<Application[]>("/applications");
}

export async function submitApplication(
  jobId: string,
  jobTitle: string,
  answers: Record<string, string>,
  cvFile: File | null,
  aiConsent: boolean,
): Promise<Application> {
  if (!cvFile) {
    throw new Error("Başvuru yapabilmek için CV yüklemeniz gerekiyor.");
  }

  const form = new FormData();
  form.append("jobId", jobId);
  form.append("jobTitle", jobTitle);
  form.append("answers", JSON.stringify(answers));
  form.append("aiConsent", String(aiConsent));
  form.append("cvFile", cvFile);

  return request<Application>("/applications", {
    method: "POST",
    body: form,
  });
}
