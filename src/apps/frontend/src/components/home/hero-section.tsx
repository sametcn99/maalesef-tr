"use client";

import { Button } from "@radix-ui/themes";
import { ArrowRight, Shield, Clock, XCircle, ChevronDown } from "lucide-react";
import Link from "next/link";
import {
  type Variants,
  type Easing,
  motion,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { useEffect, useState } from "react";
import { rejectionCards } from "@/lib/rejection-cards";

// Animated counter hook
function useAnimatedCounter(target: number, duration = 2) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(count, target, {
      duration,
      ease: "easeOut",
    });
    const unsubscribe = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [target, duration, count, rounded]);

  return display;
}

// Floating rejection cards data — distributed in 6 columns (3 left, 3 right)
// avoiding center text area and preventing overlaps

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

const _badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as Easing,
    },
  },
};

export function HeroSection() {
  const _rejectionCount = useAnimatedCounter(14_328, 2.5);
  const [mounted, setMounted] = useState(false);
  const [shuffledCards, setShuffledCards] = useState<typeof rejectionCards>([]);
  const [shuffledDelays, setShuffledDelays] = useState<number[]>([]);

  useEffect(() => {
    setMounted(true);
    // Shuffle cards to randomize text positions
    const cards = [...rejectionCards].sort(() => Math.random() - 0.5);
    setShuffledCards(cards);

    // Shuffle delays independently to randomize the appearance sequence
    const delays = rejectionCards
      .map((c) => c.delay)
      .sort(() => Math.random() - 0.5);
    setShuffledDelays(delays);
  }, []);

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

      {/* Floating rejection cards - limited on mobile, full on desktop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {mounted &&
          shuffledCards.map((card, i) => {
            const delay = shuffledDelays[i] ?? card.delay;
            return (
              <motion.div
                key={`${card.text}-${card.top}-${card.left || card.right}`}
                className="absolute glass border border-border/60 rounded-xl px-4 py-3 shadow-lg max-w-40 sm:max-w-48 opacity-70"
                style={{
                  top: card.top,
                  left: card.left,
                  right: card.right,
                  rotate: card.rotation,
                  zIndex: 0,
                }}
                initial={{ opacity: 0, scale: 0.6, y: 40 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: [0, -8, 0],
                }}
                transition={{
                  opacity: { delay: delay, duration: 0.6 },
                  scale: { delay: delay, duration: 0.6, ease: "backOut" },
                  y: {
                    delay: delay + 0.6,
                    duration: 4 + (i % 10),
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  },
                }}
              >
                <div className="flex items-start gap-3">
                  <card.icon
                    size={18}
                    className="text-red-400 mt-0.5 shrink-0"
                  />
                  <div>
                    <p className="text-xs font-medium text-foreground leading-snug">
                      {card.text}
                    </p>
                    <p className="text-[10px] text-muted-light mt-0.5">
                      {card.subtext}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
      </div>

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
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <ArrowRight size={20} />
                </motion.span>
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-light"
        >
          {[
            { icon: XCircle, text: "Sıfır Olumlu Geri Dönüş Garantisi" },
            { icon: Shield, text: "Verileriniz Ret Sonrası Anında Silinir" },
            { icon: Clock, text: "Dünyanın En Hızlı Ret Yanıtı" },
          ].map((item, i) => (
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
