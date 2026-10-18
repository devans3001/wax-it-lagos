"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* Robust reveals: content is fully visible in the SSR HTML and only
   animates FROM an offset once JS runs. If JS ever fails, nothing is
   hidden — this is the fix for the CSS-hidden pattern. */

export function Reveal({
  children,
  delay = 0,
  y = 44,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const tween = gsap.from(el, {
      y,
      opacity: 0,
      duration: 1,
      delay,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%" },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, y]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* Word-by-word headline reveal, same fail-safe pattern. */
export function SplitReveal({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = el.querySelectorAll<HTMLElement>("[data-word]");
    const tween = gsap.from(words, {
      y: 42,
      opacity: 0,
      rotateX: -32,
      transformPerspective: 600,
      duration: 0.9,
      stagger: 0.06,
      delay,
      ease: "power3.out",
    });
    return () => {
      tween.kill();
    };
  }, [delay]);
  return (
    <span ref={ref} className={className} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-top pb-1 -mb-1">
          <span data-word className="inline-block will-change-transform">
            {w}
            {i < text.split(" ").length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </span>
  );
}

export function Magnetic({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * 0.28;
      const y = (e.clientY - (r.top + r.height / 2)) * 0.28;
      gsap.to(el, { x, y, duration: 0.4, ease: "power2.out" });
    };
    const leave = () => gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function Counter({
  value,
  decimals = 0,
  suffix = "",
  className = "",
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: value,
      duration: 1.8,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 90%" },
      onUpdate: () => {
        el.textContent = obj.v.toFixed(decimals) + suffix;
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [value, decimals, suffix]);
  return (
    <span ref={ref} className={className}>
      {(0).toFixed(decimals) + suffix}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  accent,
  dark = false,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  dark?: boolean;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <Reveal>
        <p
          className={`text-xs font-bold tracking-[0.3em] uppercase ${
            dark ? "text-blush" : "text-clay"
          }`}
        >
          {eyebrow}
        </p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2
          className={`mt-3 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.02] font-medium ${
            dark ? "text-cream" : "text-cocoa"
          }`}
        >
          {title}{" "}
          {accent && <em className={dark ? "text-clay-2" : "text-clay"}>{accent}</em>}
        </h2>
      </Reveal>
    </div>
  );
}

/* Animated silk-thread divider — an SVG wave whose stroke draws itself. */
export function SilkDivider({ dark = false }: { dark?: boolean }) {
  const ref = useRef<SVGPathElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const len = el.getTotalLength();
    const tween = gsap.fromTo(
      el,
      { strokeDasharray: len, strokeDashoffset: len },
      {
        strokeDashoffset: 0,
        duration: 1.8,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%" },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);
  return (
    <div className="py-6" aria-hidden="true">
      <svg viewBox="0 0 1200 40" className="w-full h-8" fill="none">
        <path
          ref={ref}
          d="M0 20 C 100 4, 200 36, 300 20 S 500 4, 600 20 S 800 36, 900 20 S 1100 4, 1200 20"
          stroke={dark ? "#e8b4a0" : "#c96f4a"}
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}
