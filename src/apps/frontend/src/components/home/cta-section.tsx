import { Button } from "@radix-ui/themes";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="relative px-4 py-24 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 bg-foreground skew-y-1 transform origin-bottom-right scale-110" />
      <div className="relative z-10 max-w-4xl mx-auto text-center text-background">
        <h2 className="text-4xl font-bold mb-6">
          Kariyerinizde Yeni Bir Sayfa Açmayın
        </h2>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Hemen şimdi başvurun ve son teknoloji AI algoritmamızın sizi neden işe
          almayacağını detaylıca açıklamasını izleyin.
        </p>
        <Button
          data-umami-event="home_cta_section_go_jobs_click"
          asChild
          size="4"
          className="h-14 bg-white text-foreground font-bold px-10 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Link
            data-umami-event="home_cta_section_go_jobs_click_2"
            href="/jobs"
          >
            Reddedilmeye Başla
          </Link>
        </Button>
      </div>
    </section>
  );
}
