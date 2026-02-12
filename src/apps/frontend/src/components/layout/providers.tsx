"use client";

import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/auth-context";
import { JobPostingProvider } from "@/context/job-posting-context";
import { Theme } from "@radix-ui/themes";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Theme appearance="light">
      <AuthProvider>
        <JobPostingProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#ffffff",
                color: "#18181b",
                border: "1px solid #e4e4e7",
                fontSize: "0.875rem",
              },
            }}
          />
        </JobPostingProvider>
      </AuthProvider>
    </Theme>
  );
}
