import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profilim",
  description: "Başvurularınızı ve bildirimlerinizi takip edin.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
