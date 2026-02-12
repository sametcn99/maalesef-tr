import { type Testimonial, testimonials } from "@/lib/testimonials";
import { Quote } from "lucide-react";

// Kolonlara eşit dağıt
function splitIntoColumns(items: Testimonial[], cols: number): Testimonial[][] {
  const columns: Testimonial[][] = Array.from({ length: cols }, () => []);
  items.forEach((item, i) => {
    columns[i % cols].push(item);
  });
  return columns;
}

function MarqueeColumn({
  items,
  duration,
  reverse = false,
  className,
}: {
  items: Testimonial[];
  duration: number;
  reverse?: boolean;
  className?: string;
}) {
  // Duplicate to create seamless loop
  const doubled = [...items, ...items];

  return (
    <div className={`relative h-full overflow-hidden ${className}`}>
      {/* Top fade */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-linear-to-b from-background to-transparent z-10 pointer-events-none" />
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-background to-transparent z-10 pointer-events-none" />

      <div
        className={`marquee-scroll ${reverse ? "marquee-reverse" : ""} marquee-speed-${duration}`}
      >
        {doubled.map((t, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: Marquee content
            key={i}
            className="mb-4 p-5 bg-surface rounded-xl border border-border shadow-sm hover:shadow-md hover:border-border-hover transition-all duration-300 group"
          >
            <Quote className="text-accent/15 h-5 w-5 mb-2 group-hover:text-accent/30 transition-colors" />
            <p className="text-sm text-muted leading-relaxed mb-3">{t.text}</p>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-linear-to-br from-accent to-purple-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                {t.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="font-medium text-foreground text-sm truncate">
                  {t.name}
                </div>
                <div className="text-xs text-muted-light truncate">
                  {t.role}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const columns = splitIntoColumns(testimonials, 4);

  return (
    <section className="py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-16">
        <h2 className="text-3xl font-bold text-center">
          Kullanıcılarımız Ne Diyor?
        </h2>
        <p className="text-muted text-center mt-4 text-lg">
          Binlerce kullanıcının profesyonel reddedilme deneyimi
        </p>
        <p className="text-muted-light/60 text-center mt-2 text-xs italic">
          (Bu bölümdeki kullanıcılar ve yorumlar tamamen hayal ürünüdür)
        </p>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 h-175">
          <MarqueeColumn items={columns[0]} duration={220} />
          <MarqueeColumn
            items={columns[1]}
            duration={180}
            reverse
            className="hidden md:block"
          />
          <MarqueeColumn
            items={columns[2]}
            duration={200}
            className="hidden lg:block"
          />
          <MarqueeColumn
            items={columns[3]}
            duration={160}
            reverse
            className="hidden xl:block"
          />
        </div>
      </div>
    </section>
  );
}
