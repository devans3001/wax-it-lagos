"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Reveal, SectionHeading } from "./ui";

const CompareCanvas = dynamic(() => import("./PhotoStages").then((m) => m.ComparePhotos), { ssr: false });

/* Before/after on real skin: a matched photo pair (the before is an edit
   of the after, so the seam never makes the picture jump). Two ways to
   reveal it — drag the handle, or flip to Scroll and let the page drive
   the same wipe while the card stays pinned. */
export default function Compare() {
  const [value, setValue] = useState(88);
  const [mode, setMode] = useState<"drag" | "scroll">("scroll");
  const wrapRef = useRef<HTMLDivElement | null>(null);

  /* Switching modes changes the page height by ~140vh (the scroll runway).
     GSAP's ScrollTriggers (the pinned Journey above) cache the old layout,
     which made the sections below slide over each other — refresh them
     after every switch so Menu / Voices keep their true positions. */
  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        ScrollTrigger.refresh();
      } catch {
        /* gsap unavailable — layout still works, only pin offsets age */
      }
    }, 140);
    return () => clearTimeout(t);
  }, [mode]);

  useEffect(() => {
    if (mode !== "scroll") return;
    let raf = 0;
    const compute = () => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const distance = wrap.offsetHeight - window.innerHeight;
      if (distance <= 0) return;
      const p = Math.min(1, Math.max(0, -rect.top / distance));
      setValue(88 - p * 80);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [mode]);

  const card = (
    <div className="relative overflow-hidden rounded-[2rem] border border-cocoa/10 bg-gradient-to-br from-cream-2 to-cream shadow-xl shadow-clay/10">
      <div className="relative h-[380px] sm:h-[480px]">
        <CompareCanvas value={value} />
      </div>
      {/* labels */}
      <span
        className="absolute top-5 left-5 rounded-full bg-cocoa/85 px-4 py-1.5 text-xs font-bold text-cream transition-opacity duration-300"
        style={{ opacity: value > 16 ? 1 : 0 }}
      >
        BEFORE — before the visit
      </span>
      <span
        className="absolute top-5 right-5 rounded-full bg-clay px-4 py-1.5 text-xs font-bold text-[#22302a] transition-opacity duration-300"
        style={{ opacity: value < 84 ? 1 : 0 }}
      >
        AFTER — after Wax It
      </span>
      {/* handle line */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-cream/80 shadow-[0_0_12px_rgba(0,0,0,0.45)] pointer-events-none"
        style={{ left: `${value}%` }}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-12 w-12 rounded-full bg-cocoa text-cream flex items-center justify-center text-lg font-bold shadow-lg pointer-events-none"
        style={{ left: `${value}%` }}
      >
        ↔
      </div>
      {mode === "drag" ? (
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          aria-label="Before and after comparison"
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
        />
      ) : (
        <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-cocoa/85 px-4 py-1.5 text-xs font-bold text-cream pointer-events-none">
          ↓ keep scrolling — watch the skin change
        </span>
      )}
    </div>
  );

  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeading
          align="center"
          eyebrow="Before / After"
          title="Before the visit."
          accent="After Wax It."
        />
        <Reveal className="mt-4 text-center">
          <p className="text-cocoa/70 text-lg max-w-2xl mx-auto">
            Left: skin that is overdue — stubble, ingrowns, dull. Right: the same skin after
            one visit — clear, smooth, catching the light. Drag the handle, or switch to
            Scroll and let the page do it.
          </p>
        </Reveal>

        <div className="mt-10 flex justify-center sm:justify-end">
          <div className="inline-flex rounded-full border border-cocoa/15 bg-cream p-1" role="group" aria-label="Comparison mode">
            {(["drag", "scroll"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`rounded-full px-5 py-2 text-sm font-bold capitalize transition-colors ${
                  mode === m ? "bg-cocoa text-cream" : "text-cocoa/60 hover:text-cocoa"
                }`}
              >
                {m === "drag" ? "↔ Drag" : "↓ Scroll"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div ref={wrapRef} className={mode === "scroll" ? "relative h-[240vh]" : "relative"}>
        <div className={mode === "scroll" ? "sticky top-[10vh]" : ""}>
          <div className="max-w-7xl mx-auto px-5 sm:px-8 mt-6">{card}</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <Reveal className="mt-6 text-center">
          <p className="text-sm text-cocoa/60">
            Smooth for up to four weeks — hair grows back finer, sparser, softer.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
