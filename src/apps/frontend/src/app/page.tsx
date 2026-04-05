"use client";

import dynamic from "next/dynamic";
import { useJobs } from "@/hooks/use-jobs";
import { useStats } from "@/hooks/use-stats";
import {
  HeroSection,
  StatsSection,
  FeaturedJobsSection,
  PublishJobSection,
  HowItWorksSection,
  CTASection,
} from "@/components/home";

const TestimonialsSection = dynamic(() =>
  import("@/components/home/testimonials-section").then(
    (module) => module.TestimonialsSection,
  ),
);

export default function Home() {
  const { jobs, loading: jobsLoading } = useJobs({ limit: 6 });
  const { stats, loading: statsLoading } = useStats();

  return (
    <div className="relative overflow-hidden w-full">
      {/* Background Elements */}
      <div className="pointer-events-none absolute top-0 right-0 -z-10 h-[600px] w-[600px] bg-accent/5 blur-[120px] rounded-full" />
      <div className="pointer-events-none absolute bottom-0 left-0 -z-10 h-[400px] w-[400px] bg-blue-500/5 blur-[100px] rounded-full" />

      <HeroSection />
      <StatsSection stats={stats} loading={statsLoading} />
      <FeaturedJobsSection jobs={jobs} loading={jobsLoading} />
      <PublishJobSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}
