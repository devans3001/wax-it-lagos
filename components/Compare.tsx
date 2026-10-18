"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Reveal, SectionHeading } from "./ui";

const CompareCanvas = dynamic(() => import("./three").then((m) => m.CompareCanvas), { ssr: false });

/* Before/after: drag the handle. The silk goes from creased + dull to
   smooth + glossy — exactly what four weeks of waxing feels like. */
export default function Compare() {
  const [value, setValue] = useState(55);
  const slider = useRef(55);

  const onChange = (v: number) => {
    slider.current = v;
    setValue(v);
  };

  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeading
          align="center"
          eyebrow="Before / After"
          title="Drag it."
          accent="Feel the difference."
        />
        <Reveal className="mt-4 text-center">
          <p className="text-cocoa/70 text-lg">
            Left: skin between appointments. Right: four weeks of Wax It Lagos.
          </p>
        </Reveal>

        <Reveal className="mt-12">
          <div className="relative overflow-hidden rounded-[2rem] border border-cocoa/10 bg-gradient-to-br from-cream-2 to-peach shadow-xl shadow-clay/10">
            <div className="relative h-[380px] sm:h-[480px]">
              <CompareCanvas slider={slider} />
            </div>
            {/* labels */}
            <span className="absolute top-5 left-5 rounded-full bg-cocoa/85 px-4 py-1.5 text-xs font-bold text-cream">
              BEFORE — creased
            </span>
            <span className="absolute top-5 right-5 rounded-full bg-clay px-4 py-1.5 text-xs font-bold text-cream">
              AFTER — silk
            </span>
            {/* handle line */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-cocoa/70 pointer-events-none"
              style={{ left: `${value}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-12 w-12 rounded-full bg-cocoa text-cream flex items-center justify-center text-lg font-bold shadow-lg pointer-events-none"
              style={{ left: `${value}%` }}
            >
              ↔
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={value}
              onChange={(e) => onChange(Number(e.target.value))}
              aria-label="Before and after comparison"
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
            />
          </div>
        </Reveal>
        <Reveal className="mt-6 text-center">
          <p className="text-sm text-cocoa/60">
            Smooth for up to four weeks — hair grows back finer, sparser, softer.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
