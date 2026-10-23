"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Reveal, SectionHeading } from "./ui";

const LabCanvas = dynamic(() => import("./PhotoStages").then((m) => m.LabPhoto), { ssr: false });

const MODES = [
  {
    id: "wax",
    label: "Waxing",
    copy: "The core ritual. Warm wax, quick pull, skin that forgets hair for weeks.",
  },
  {
    id: "scrub",
    label: "Body Scrub",
    copy: "Citrus polish that lifts dull skin away and leaves the glow underneath.",
  },
  {
    id: "hammam",
    label: "Hammam",
    copy: "Steam, scrub, silence. The treatment reviewers call one of the best they've had.",
  },
  {
    id: "massage",
    label: "Massage",
    copy: "Deep tissue that finds the knot and stays until it lets go.",
  },
];

/* The Ritual Lab: switch treatments, watch the bath re-dress itself. */
export default function Lab() {
  const [active, setActive] = useState("wax");
  const current = MODES.find((m) => m.id === active)!;

  return (
    <section className="py-24 sm:py-32 bg-cream-2 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeading eyebrow="The ritual lab" title="Pick a treatment." accent="See it up close." />
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 items-center">
          <div>
            <div className="flex flex-wrap gap-2">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActive(m.id)}
                  aria-pressed={active === m.id}
                  className={`rounded-full px-5 py-3 text-sm font-bold transition-all min-h-[44px] ${
                    active === m.id
                      ? "bg-cocoa text-cream shadow-lg"
                      : "bg-cream border border-cocoa/15 text-cocoa/70 hover:border-clay hover:text-clay"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <p className="mt-8 font-display text-3xl sm:text-4xl leading-snug min-h-[7rem]">{current.copy}</p>
            <p className="mt-4 text-sm text-cocoa/60">
              Every treatment, photographed up close in the spa's own colours. Pick one and look.
            </p>
          </div>
          <div className="relative h-[340px] sm:h-[440px] rounded-[2rem] overflow-hidden bg-gradient-to-br from-cream-2 to-cream border border-cocoa/10 shadow-xl shadow-clay/10">
            <LabCanvas mode={active} />
          </div>
        </div>
      </div>
    </section>
  );
}
