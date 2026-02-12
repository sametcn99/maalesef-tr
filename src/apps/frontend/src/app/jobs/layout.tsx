import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Açık Pozisyonlar",
  description:
    "Mevcut iş ilanlarını inceleyin ve size uygun pozisyona başvurun.",
};

export default function JobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
