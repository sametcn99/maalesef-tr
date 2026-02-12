export interface JobQuestion {
  id: string;
  label: string;
  type: "text" | "textarea" | "select";
  placeholder?: string;
  options?: string[];
  required: boolean;
}

export interface JobOwner {
  id: string;
  name: string;
  email: string;
  slug: string | null;
}

export interface CreateJobPayload {
  title: string;
  company: string;
  location: string;
  shortDescription: string;
  fullDescription: string;
  requirements: string[];
  questions: JobQuestion[];
}

export interface Job {
  id: string;
  slug: string | null;
  title: string;
  company: string;
  location: string;
  shortDescription: string;
  fullDescription: string;
  requirements: string[];
  questions: JobQuestion[];
  createdAt: string;
  createdBy?: JobOwner;
  applicantCount?: number;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  status: "pending" | "rejected";
  appliedAt: string;
  feedback?: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  shareable: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  notificationEmailEnabled: boolean;
  slug?: string | null;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}
export interface Badge {
  name: string;
  type: string;
  earnedAt: string;
}

export interface PublicProfile {
  name: string;
  bio: string | null;
  stats: {
    totalApplications?: number;
    totalRejections?: number;
  };
  latestApplication: {
    jobId?: string;
    jobSlug?: string;
    jobTitle: string;
    appliedAt: string;
  } | null;
  latestRejection: {
    jobId?: string;
    jobSlug?: string;
    jobTitle: string;
    date: string;
    feedback: string | null;
  } | null;
  jobs: Array<{
    id: string;
    slug: string | null;
    title: string;
    company: string;
    location: string;
    createdAt: string;
  }>;
  badges: Badge[];
}
