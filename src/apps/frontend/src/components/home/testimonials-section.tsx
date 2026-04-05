"use client";

import { type Testimonial, testimonials } from "@/lib/testimonials";
import { Quote } from "lucide-react";
import { memo, startTransition, useEffect, useRef, useState } from "react";

const COLUMN_CONFIG: ReadonlyArray<{
  duration: number;
  reverse?: boolean;
  className?: string;
}> = [
  { duration: 220 },
  { duration: 180, reverse: true, className: "hidden md:block" },
  { duration: 200, className: "hidden lg:block" },
  { duration: 160, reverse: true, className: "hidden xl:block" },
];

const TESTIMONIALS_PER_COLUMN = 12;

function shuffleTestimonials(items: readonly Testimonial[]): Testimonial[] {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

function buildColumns(
  items: readonly Testimonial[],
  cols: number,
  itemsPerColumn: number,
): Testimonial[][] {
  const columns: Testimonial[][] = Array.from({ length: cols }, () => []);
  const randomized = shuffleTestimonials(items);
  const visibleItems = randomized.slice(0, cols * itemsPerColumn);

  visibleItems.forEach((item, index) => {
    columns[index % cols].push(item);
  });

  return columns;
}

const MarqueeColumn = memo(function MarqueeColumn({
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
  const loops = [0, 1] as const;

  return (
    <div className={`relative h-full overflow-hidden ${className}`}>
      <div className="absolute top-0 left-0 right-0 h-24 bg-linear-to-b from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-background to-transparent z-10 pointer-events-none" />

      <div
        className={`marquee-scroll ${reverse ? "marquee-reverse" : ""} marquee-speed-${duration}`}
      >
        {loops.map((loop) =>
          items.map((t) => (
            <div
              key={`${t.name}-${t.role}-${t.text}-${loop}`}
              className="mb-4 p-5 bg-surface rounded-xl border border-border shadow-sm hover:shadow-md hover:border-border-hover transition-all duration-300 group"
            >
              <Quote
                aria-hidden="true"
                className="text-accent/15 h-5 w-5 mb-2 group-hover:text-accent/30 transition-colors"
              />
              <p className="text-sm text-muted leading-relaxed mb-3">
                {t.text}
              </p>
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
          )),
        )}
      </div>
    </div>
  );
});

function TestimonialsPlaceholder() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 h-175">
      {COLUMN_CONFIG.map((column) => (
        <div
          key={column.duration}
          className={`relative h-full overflow-hidden ${column.className ?? ""}`}
        >
          <div className="h-full rounded-2xl border border-border bg-linear-to-b from-surface to-background/50" />
          <div className="absolute inset-x-4 top-5 space-y-4">
            <div className="h-28 rounded-xl border border-border/70 bg-background/70" />
            <div className="h-24 rounded-xl border border-border/50 bg-background/55" />
            <div className="h-32 rounded-xl border border-border/40 bg-background/40" />
          </div>
        </div>
      ))}
    </div>
  );
}

export const TestimonialsSection = memo(function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [columns, setColumns] = useState<Testimonial[][] | null>(null);

  useEffect(() => {
    if (columns) {
      return;
    }

    const element = sectionRef.current;

    if (!element) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      startTransition(() => {
        setColumns(
          buildColumns(
            testimonials,
            COLUMN_CONFIG.length,
            TESTIMONIALS_PER_COLUMN,
          ),
        );
      });

      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        observer.disconnect();

        startTransition(() => {
          setColumns(
            buildColumns(
              testimonials,
              COLUMN_CONFIG.length,
              TESTIMONIALS_PER_COLUMN,
            ),
          );
        });
      },
      {
        rootMargin: "300px 0px",
        threshold: 0.15,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [columns]);

  return (
    <section ref={sectionRef} className="py-24 overflow-hidden">
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
        {columns ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 h-175">
            {COLUMN_CONFIG.map((column, index) => (
              <MarqueeColumn
                key={column.duration}
                items={columns[index] ?? []}
                duration={column.duration}
                reverse={column.reverse}
                className={column.className}
              />
            ))}
          </div>
        ) : (
          <TestimonialsPlaceholder />
        )}
      </div>
    </section>
  );
});
