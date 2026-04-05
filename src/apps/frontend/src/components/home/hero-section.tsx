"use client";

import { Button } from "@radix-ui/themes";
import { Shield, Clock, XCircle, ChevronDown } from "lucide-react";
import Link from "next/link";
import { type Variants, type Easing, motion } from "framer-motion";
import {
  startTransition,
  type CSSProperties,
  useEffect,
  useState,
} from "react";
import {
  buildRejectionCardLayout,
  getRejectionCardViewport,
  type PositionedRejectionCard,
} from "@/lib/rejection-cards";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.25, 0.4, 0.25, 1] as Easing,
    },
  },
};

const trustBadges = [
  { icon: XCircle, text: "Sıfır Olumlu Geri Dönüş Garantisi" },
  { icon: Shield, text: "Verileriniz Ret Sonrası Anında Silinir" },
  { icon: Clock, text: "Dünyanın En Hızlı Ret Yanıtı" },
];

function useDecorativeRejectionCards() {
  const [cards, setCards] = useState<PositionedRejectionCard[]>([]);

  useEffect(() => {
    let frameId = 0;
    let currentLayoutKey = "";
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const syncCards = () => {
      frameId = 0;

      const viewport = getRejectionCardViewport(window.innerWidth);
      const nextLayoutKey = `${viewport}-${reducedMotionQuery.matches ? "reduce" : "full"}`;

      if (nextLayoutKey === currentLayoutKey) {
        return;
      }

      currentLayoutKey = nextLayoutKey;

      startTransition(() => {
        setCards(
          buildRejectionCardLayout({
            width: window.innerWidth,
            reducedMotion: reducedMotionQuery.matches,
          }),
        );
      });
    };

    const scheduleSync = () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(syncCards);
    };

    scheduleSync();

    const handleResize = () => {
      const viewport = getRejectionCardViewport(window.innerWidth);
      const nextLayoutKey = `${viewport}-${reducedMotionQuery.matches ? "reduce" : "full"}`;

      if (nextLayoutKey !== currentLayoutKey) {
        scheduleSync();
      }
    };

    window.addEventListener("resize", handleResize, { passive: true });
    reducedMotionQuery.addEventListener("change", scheduleSync);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener("resize", handleResize);
      reducedMotionQuery.removeEventListener("change", scheduleSync);
    };
  }, []);

  return cards;
}

function RejectionCardLayer({ cards }: { cards: PositionedRejectionCard[] }) {
  if (!cards.length) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="hero-rejection-cloud absolute inset-0 pointer-events-none overflow-hidden"
    >
      {cards.map((card) => {
        const animationStyle = {
          opacity: card.opacity,
          "--card-float-delay": `${card.floatDelayMs}ms`,
          "--card-float-duration": `${card.floatDurationMs}ms`,
          "--card-float-distance": `${card.floatDistancePx}px`,
        } as CSSProperties;

        return (
          <div
            key={card.id}
            className="hero-rejection-card-shell absolute z-0"
            style={{
              top: card.top,
              ...(card.side === "left"
                ? { left: card.offset }
                : { right: card.offset }),
              transform: `rotate(${card.rotation}deg)`,
            }}
          >
            <div
              className="hero-rejection-card-enter"
              style={{ animationDelay: `${card.enterDelayMs}ms` }}
            >
              <div
                className={
                  card.floatDistancePx > 0 ? "hero-rejection-card-float" : ""
                }
                style={animationStyle}
              >
                <div className="hero-rejection-card-surface border border-border/60 rounded-xl px-3 py-2.5 shadow-md max-w-32 sm:max-w-40 sm:px-4 sm:py-3 sm:shadow-lg lg:max-w-44">
                  <div className="flex items-start gap-2.5 sm:gap-3">
                    <card.icon
                      size={16}
                      className="text-red-400 mt-0.5 shrink-0"
                    />
                    <div>
                      <p className="text-[11px] font-medium text-foreground leading-snug sm:text-xs">
                        {card.text}
                      </p>
                      <p className="text-[9px] text-muted-light mt-0.5 sm:text-[10px]">
                        {card.subtext}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function HeroSection() {
  const decorativeCards = useDecorativeRejectionCards();

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center py-16 px-4 overflow-hidden">
      {/* Decorative grid */}
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />

      {/* Gradient orbs */}
      <motion.div
        className="absolute top-20 left-1/4 w-72 h-72 bg-accent/10 rounded-full blur-[100px] pointer-events-none"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-500/8 rounded-full blur-[120px] pointer-events-none"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <RejectionCardLayer cards={decorativeCards} />

      {/* Main content */}
      <motion.div
        className="relative z-10 mx-auto max-w-4xl text-center space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl leading-[1.05]"
        >
          Kariyerinize Dürüst Bir, <br className="hidden sm:block" />
          <motion.span
            className="inline-block bg-linear-to-r from-accent via-purple-500 to-accent-light bg-clip-text text-transparent bg-size-[200%_auto]"
            animate={{ backgroundPosition: ["0% center", "200% center"] }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            'Maalesef' Arası Verin.
          </motion.span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={itemVariants}
          className="mx-auto max-w-xl text-base text-muted leading-relaxed sm:text-lg"
        >
          <span className="text-foreground font-medium">&ldquo;Maalesef,</span>{" "}
          size uygun bir pozisyon bulamadık...&rdquo; demek için sabırsızlanan
          tek kariyer platformu.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Button
              data-umami-event="home_hero_section_go_jobs_click"
              asChild
              size="3"
              className="h-12 bg-foreground text-background font-semibold px-8 rounded-full shadow-xl shadow-foreground/10"
            >
              <Link
                data-umami-event="home_hero_section_go_jobs_click_2"
                href="/jobs"
                className="inline-flex items-center gap-2"
              >
                İlanlara Gözatın
              </Link>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Button
              data-umami-event="home_hero_section_about_click"
              asChild
              size="3"
              variant="soft"
              className="h-12 px-6 rounded-full border border-border/70 text-foreground hover:text-foreground"
            >
              <Link href="/about">Amaç ne?</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-light"
        >
          {trustBadges.map((item, i) => (
            <motion.div
              // biome-ignore lint/suspicious/noArrayIndexKey: Static content
              key={i}
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 + i * 0.15, duration: 0.5 }}
            >
              <item.icon size={15} className="text-muted-light/80" />
              <span>{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent pointer-events-none" />

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
        onClick={() => {
          window.scrollTo({
            top: window.innerHeight - 64,
            behavior: "smooth",
          });
        }}
      >
        <span className="text-[10px] font-medium text-muted-light uppercase tracking-widest">
          Aşağı Kaydır
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="p-1 px-2 rounded-full border border-border-hover bg-surface/50 backdrop-blur-sm shadow-sm"
        >
          <ChevronDown size={16} className="text-muted" />
        </motion.div>
      </motion.div>
    </section>
  );
}
