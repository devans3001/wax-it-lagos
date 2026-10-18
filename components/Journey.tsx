"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { journeyStages } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

const JourneyCanvas = dynamic(() => import("./three").then((m) => m.JourneyCanvas), { ssr: false });

/* Pinned horizontal journey: scroll down, travel sideways through the
   four stages — while the silk behind you goes from rough to smooth. */
export default function Journey() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef(0);

  useEffect(() => {
    const el = wrap.current;
    const tr = track.current;
    if (!el || !tr) return;
    const getDist = () => tr.scrollWidth - window.innerWidth;
    const tween = gsap.to(tr, {
      x: () => -getDist(),
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top top",
        end: () => `+=${getDist()}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          progress.current = self.progress;
        },
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section id="journey" className="bg-cocoa text-cream">
      <div ref={wrap} className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-60">
          <JourneyCanvas progress={progress} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-cocoa/70 via-transparent to-cocoa/80" />
        <div ref={track} className="relative z-10 flex h-[100svh] items-center w-max">
          <div className="w-[88vw] sm:w-[60vw] shrink-0 pl-5 sm:pl-12 pr-6">
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-blush">The visit</p>
            <h2 className="mt-4 font-display text-6xl sm:text-8xl leading-[0.95] font-medium">
              One visit,
              <br />
              <em className="text-clay-2">four moments.</em>
            </h2>
            <p className="mt-6 max-w-md text-cream/70 text-lg">
              Keep scrolling — you travel sideways through the visit, and the silk
              behind you smooths out as you go.
            </p>
            <p className="mt-8 text-sm font-bold tracking-widest text-cream/50">SCROLL →</p>
          </div>
          {journeyStages.map((s, i) => (
            <div key={s.title} className="w-[85vw] sm:w-[55vw] shrink-0 px-5 sm:px-8">
              <p className="font-display text-[22vw] sm:text-[11rem] leading-none text-outline-cream select-none">
                0{i + 1}
              </p>
              <h3 className="mt-[-2rem] font-display text-5xl sm:text-6xl font-medium">{s.title}</h3>
              <p className="mt-4 max-w-md text-cream/75 text-lg leading-relaxed">{s.body}</p>
              <p className="mt-6 text-xs font-bold tracking-[0.35em] text-blush">{s.word}</p>
            </div>
          ))}
          <div className="w-[60vw] sm:w-[40vw] shrink-0 px-5 sm:px-8">
            <p className="font-display text-6xl sm:text-7xl leading-tight">
              Walk out <em className="text-clay-2">lighter.</em>
            </p>
            <a
              href="tel:+2347011772168"
              className="mt-8 inline-flex items-center rounded-full bg-clay px-7 py-4 font-bold text-cream hover:bg-cream hover:text-cocoa transition-colors min-h-[52px]"
            >
              Book the feeling →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
