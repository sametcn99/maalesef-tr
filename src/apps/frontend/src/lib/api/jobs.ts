import type {
  CreateJobPayload,
  Job,
  JobsQueryParams,
  PaginatedResponse,
  ViewedJob,
} from "@/types";
import { request } from "./core";

function buildQueryString(params?: JobsQueryParams) {
  if (!params) {
    return "";
  }

  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      continue;
    }

    if (typeof value === "string" && value.trim().length === 0) {
      continue;
    }

    searchParams.set(key, String(value));
  }

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export async function getJobs(
  params?: JobsQueryParams,
  options?: { personalized?: boolean; signal?: AbortSignal },
): Promise<PaginatedResponse<Job>> {
  const path = `${options?.personalized ? "/jobs/feed" : "/jobs"}${buildQueryString(params)}`;

  return request<PaginatedResponse<Job>>(path, {
    signal: options?.signal,
  });
}

export async function getViewedJobs(): Promise<ViewedJob[]> {
  return request<ViewedJob[]>("/jobs/viewed");
}

export async function trackJobView(jobId: string): Promise<void> {
  await request<void>(`/jobs/${jobId}/view`, { method: "POST" });
}

export async function getJob(id: string): Promise<Job> {
  return request<Job>(`/jobs/${id}`);
}

export async function getMyJobs(): Promise<Job[]> {
  return request<Job[]>("/jobs/mine");
}

export async function deleteJob(id: string): Promise<void> {
  await request<void>(`/jobs/${id}`, { method: "DELETE" });
}

export async function createJob(payload: CreateJobPayload): Promise<Job> {
  return request<Job>("/jobs", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
