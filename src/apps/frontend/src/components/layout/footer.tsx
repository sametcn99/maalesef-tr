import Image from "next/image";
import Link from "next/link";
import { siGithub, siX } from "simple-icons";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Logo and Tagline */}
          <div className="space-y-6">
            <div className="flex items-center gap-2.5">
              <Image
                src="/favicon.ico"
                alt="Logo"
                width={32}
                height={32}
                className="rounded-lg shadow-sm"
              />
              <span className="text-xl font-bold tracking-tight text-foreground transition-colors hover:text-accent">
                maalesef
              </span>
            </div>
            <p className="max-w-xs text-sm leading-6 text-muted">
              Samimi kariyer platformu. Hayallerinizdeki ret cevabına giden en
              kısa yol.
            </p>
            <div className="flex space-x-5">
              <Link
                href="https://x.com/maaleseftr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted transition-colors hover:text-accent"
                title="X (Twitter)"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-5 w-5 fill-current"
                >
                  <path d={siX.path} />
                </svg>
                <span className="sr-only">X (Twitter)</span>
              </Link>
              <Link
                href="https://sametcc.me/repo/maalesef-tr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted transition-colors hover:text-accent"
                title="GitHub"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-5 w-5 fill-current"
                >
                  <path d={siGithub.path} />
                </svg>
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="mt-16 xl:col-span-2 xl:mt-0">
            <div className="grid grid-cols-2 gap-8 md:flex md:justify-end md:gap-24 text-right">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-foreground uppercase tracking-wider">
                  Platform
                </h3>
                <ul className="mt-6 space-y-4">
                  <li>
                    <Link
                      data-umami-event="layout_footer_go_jobs_click"
                      href="/jobs"
                      className="text-sm leading-6 text-muted transition-colors hover:text-foreground"
                    >
                      İlanlar
                    </Link>
                  </li>
                  <li>
                    <Link
                      data-umami-event="layout_footer_go_jobs_new_click"
                      href="/jobs/new"
                      className="text-sm leading-6 text-muted transition-colors hover:text-foreground"
                    >
                      İlan Yayınla
                    </Link>
                  </li>
                  <li>
                    <Link
                      data-umami-event="footer_profile_click"
                      href="/profile"
                      className="text-sm leading-6 text-muted transition-colors hover:text-foreground"
                    >
                      Profilim
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold leading-6 text-foreground uppercase tracking-wider">
                  Detaylar
                </h3>
                <ul className="mt-6 space-y-4">
                  <li>
                    <Link
                      data-umami-event="layout_footer_go_about_click"
                      href="/about"
                      className="text-sm leading-6 text-muted transition-colors hover:text-foreground"
                    >
                      Hakkında
                    </Link>
                  </li>
                  <li>
                    <Link
                      data-umami-event="layout_footer_go_mailto_contact_sametcc_me_click"
                      href="https://sametcc.me"
                      target="_blank"
                      className="text-sm leading-6 text-muted transition-colors hover:text-foreground"
                    >
                      İletişim
                    </Link>
                  </li>
                  <li>
                    <Link
                      data-umami-event="layout_footer_go_gizlilik_politikasi_click"
                      href="/gizlilik-politikasi"
                      className="text-sm leading-6 text-muted transition-colors hover:text-foreground"
                    >
                      Gizlilik Politikası
                    </Link>
                  </li>
                  <li>
                    <Link
                      data-umami-event="layout_footer_go_kullanim_sartlari_click"
                      href="/kullanim-sartlari"
                      className="text-sm leading-6 text-muted transition-colors hover:text-foreground"
                    >
                      Kullanım Şartları
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 border-t border-border pt-8 sm:mt-20 lg:mt-24">
          <div className="flex flex-col items-center justify-center">
            <p className="text-xs leading-5 text-muted-light">
              &copy; {currentYear} maalesef. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
