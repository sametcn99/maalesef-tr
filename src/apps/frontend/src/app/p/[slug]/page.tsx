import type { Metadata } from "next";
import { getPublicProfile } from "@/lib/api";
import ProfileView from "./profile-view";
import { XCircle } from "lucide-react";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const profile = await getPublicProfile(slug);
    if (!profile) return { title: "Profil Bulunamadı" };

    return {
      title: `${profile.name} - Kullanıcı Profili | maalesef.`,
      description: `${profile.name} adlı kullanıcının başvuru istatistiklerini görüntüleyin.`,
      openGraph: {
        title: `${profile.name} - Kullanıcı Profili`,
        description: `maalesef. uygulamasında ${profile.name} adlı kullanıcının başvuru istatistikleri.`,
        type: "profile",
      },
    };
  } catch (_error) {
    return { title: "Profil Bulunamadı | maalesef." };
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  let profile = null;
  try {
    profile = await getPublicProfile(slug);
  } catch (_err) {
    // If fetch fails, we assume not found or error.
  }

  if (!profile) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <div className="mb-4 rounded-full bg-red-100 p-4 text-red-500 shadow-sm">
          <XCircle size={32} aria-hidden="true" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Profil Bulunamadı
        </h1>
        <p className="max-w-md text-gray-500">
          Aradığınız profil mevcut değil, gizli veya bağlantı geçersiz olabilir.
        </p>
      </div>
    );
  }

  return <ProfileView profile={profile} />;
}
