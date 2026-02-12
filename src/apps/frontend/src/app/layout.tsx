import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Providers } from "@/components/layout/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://maalesef.tr"),
  title: {
    default: "maalesef — İş Başvuru Simülatörü",
    template: "%s | maalesef",
  },
  description:
    "Gerçek hayattaki iş başvuru süreçlerinde yaşanan olumsuz geri dönüş deneyimini simüle eden deneysel bir platform. Reddedilme deneyimini yaşayın, istatistiklerinizi görün.",
  keywords: [
    "iş başvurusu",
    "reddedilme simülasyonu",
    "kariyer",
    "mülakat",
    "iş arama",
    "maalesef",
    "simülasyon",
  ],
  authors: [{ name: "Maalesef Ekibi" }],
  creator: "Maalesef",
  publisher: "Maalesef",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://maalesef.tr",
    title: "maalesef — İş Başvuru Simülatörü",
    description:
      "Gerçek hayattaki iş başvuru süreçlerinde yaşanan olumsuz geri dönüş deneyimini simüle eden deneysel bir platform.",
    siteName: "maalesef",
  },
  twitter: {
    card: "summary_large_image",
    title: "maalesef — İş Başvuru Simülatörü",
    description:
      "Gerçek hayattaki iş başvuru süreçlerinde yaşanan olumsuz geri dönüş deneyimini simüle eden deneysel bir platform.",
    creator: "@maalesef_tr",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <script
          defer
          src="https://umami.sametcc.me/script.js"
          data-website-id="d55656b6-247e-498f-9464-09584ca2b71e"
          data-do-not-track="true"
        ></script>
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
