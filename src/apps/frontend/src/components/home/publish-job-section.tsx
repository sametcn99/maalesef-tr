import { Button } from "@radix-ui/themes";
import Link from "next/link";

export function PublishJobSection() {
  return (
    <section className="py-24 px-4 sm:px-6 border-t border-border bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <h2 className="text-accent font-semibold tracking-wide uppercase text-sm mb-3">
            İlan Alanı
          </h2>
          <h3 className="text-3xl font-bold text-foreground sm:text-4xl mb-4">
            İlanı Aç, Ret Şovunu Başlat
          </h3>
          <p className="text-muted text-lg leading-relaxed mb-8">
            Burada amaç kimseyi gerçekten işe almak değil, yaratıcı şekilde
            reddedilmek. Dakikalar içinde ilanını aç, başvuruları topla ve AI'ın
            tatlı-sert bahaneleriyle eğlenceyi başlat.
          </p>
          <Button
            data-umami-event="home_publish_job_section_go_new_job_click"
            asChild
            size="3"
            className="h-12 px-8 rounded-full"
          >
            <Link
              data-umami-event="home_publish_job_section_go_new_job_click_2"
              href="/jobs/new"
            >
              İlan Oluşturmaya Başla
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
