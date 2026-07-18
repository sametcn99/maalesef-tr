import type { MetadataRoute } from "next";

interface JobItem {
  slug: string | null;
  createdAt: string;
}

interface PaginatedJobsResponse {
  items: JobItem[];
  totalPages: number;
}

async function fetchAllJobSlugs(): Promise<JobItem[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
  const limit = 24;
  const jobs: JobItem[] = [];

  try {
    const firstRes = await fetch(
      `${apiUrl}/jobs?limit=${limit}&page=1&sort=oldest`,
    );

    if (!firstRes.ok) {
      return [];
    }

    const firstPage: PaginatedJobsResponse = await firstRes.json();
    jobs.push(...firstPage.items);

    const remainingPages = Array.from(
      { length: firstPage.totalPages - 1 },
      (_, i) => i + 2,
    );

    const pageResults = await Promise.allSettled(
      remainingPages.map((page) =>
        fetch(`${apiUrl}/jobs?limit=${limit}&page=${page}&sort=oldest`).then(
          (res) => (res.ok ? res.json() : null),
        ),
      ),
    );

    for (const result of pageResults) {
      if (result.status === "fulfilled" && result.value) {
        jobs.push(...result.value.items);
      }
    }
  } catch {
    return [];
  }

  return jobs;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://maalesef.tr";
  const currentDate = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/gizlilik-politikasi`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/kullanim-sartlari`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  const jobs = await fetchAllJobSlugs();

  const jobEntries: MetadataRoute.Sitemap = jobs
    .filter((job) => job.slug !== null)
    .map((job) => ({
      url: `${baseUrl}/jobs/${job.slug}`,
      lastModified: new Date(job.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  return [...staticEntries, ...jobEntries];
}
