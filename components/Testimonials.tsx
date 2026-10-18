"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { testimonials } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

/* Pinned, scroll-driven quote rotator — the standout testimonial moment.
   Scroll down: the section pins, quotes rotate one by one, the progress
   rail fills. Light cocoa room, huge Cormorant quotes. */
export default function Testimonials() {
  const wrap = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const tween = gsap.to(el, {
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top top",
        end: "+=3200",
        scrub: 0.6,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const i = Math.min(testimonials.length - 1, Math.floor(self.progress * testimonials.length));
          setIndex(i);
        },
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  const t = testimonials[index];

  return (
    <section id="voices" className="bg-cocoa text-cream">
      <div ref={wrap} className="relative overflow-hidden">
        <div className="h-[100svh] flex flex-col justify-center max-w-5xl mx-auto px-5 sm:px-8">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-blush">
            Voices · {index + 1} / {testimonials.length}
          </p>
          <blockquote
            key={index}
            className="mt-8 font-display text-4xl sm:text-6xl leading-[1.08] font-medium"
          >
            “{t.quote}”
          </blockquote>
          <p className="mt-8 text-sm font-bold tracking-wide text-cream/80">
            — {t.name} <span className="text-cream/50 font-medium">· {t.source}</span>
          </p>
          {/* progress rail */}
          <div className="mt-12 flex gap-2">
            {testimonials.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                  i <= index ? "bg-clay-2" : "bg-cream/15"
                }`}
              />
            ))}
          </div>
          <p className="mt-6 text-xs font-semibold tracking-widest text-cream/40">
            KEEP SCROLLING — THE VOICES CHANGE
          </p>
        </div>
      </div>
    </section>
  );
}
