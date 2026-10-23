"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import {
  business,
  gallery,
  marqueeWords,
  packages,
  proofStats,
  signatureServices,
} from "@/lib/data";
import { Counter, Magnetic, Reveal, SectionHeading, WaveDivider, SplitReveal } from "./ui";
import { LogoLockup } from "./Logo";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const PhotoBath = dynamic(() => import("./PhotoStages").then((m) => m.PhotoBath), { ssr: false });

/* --------------------------------- NAV -------------------------------- */
export function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-3 sm:mx-6 mt-3 flex items-center justify-between rounded-full border border-cocoa/10 bg-cream/80 backdrop-blur-md px-4 sm:px-6 py-2.5 shadow-sm">
        <LogoLockup />
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-cocoa/80">
          <a href="#services" className="hover:text-clay">Treatments</a>
          <a href="#journey" className="hover:text-clay">The visit</a>
          <a href="#menu" className="hover:text-clay">Menu</a>
          <a href="#voices" className="hover:text-clay">Reviews</a>
          <a href="#visit" className="hover:text-clay">Find us</a>
        </nav>
        <a
          href={business.phoneHref}
          className="rounded-full bg-cocoa px-5 py-2.5 text-sm font-bold text-cream hover:bg-clay transition-colors min-h-[40px] flex items-center"
        >
          Call to book
        </a>
      </div>
    </header>
  );
}

/* --------------------------------- HERO ------------------------------- */
/* The Hammam Ritual: a brass-rimmed bath of green water, a thin pour   */
/* streaming in, steam curling up through the headline.                 */
export function Hero() {
  // Recalculate reveal triggers once fonts and the canvas chunk settle,
  // so nothing above the fold stays stuck mid-reveal.
  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 1400);
    return () => clearTimeout(id);
  }, []);

  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden bg-[#1e2b25]">
      {/* the ritual stage */}
      <div className="absolute inset-0">
        <PhotoBath />
      </div>
      {/* soft scrims so the headline stays legible */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#1e2b25]/80 via-transparent to-[#1e2b25]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#1e2b25]/60 via-transparent to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-36 sm:pt-44 pb-16 min-h-[100svh] flex flex-col justify-between">
        <div className="max-w-3xl">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-clay/50 bg-white/5 backdrop-blur px-4 py-2 text-xs font-bold tracking-[0.22em] uppercase text-clay-2">
              <span className="inline-block h-2 w-2 rounded-full bg-clay animate-pulse" />
              Lekki's spa · {business.rating}★ · {business.reviewCount} reviews
            </p>
          </Reveal>
          <h1 className="mt-6 font-display text-[17vw] sm:text-8xl lg:text-[7.5rem] leading-[0.92] font-medium text-cream">
            <SplitReveal text="Smooth is" />
            <br />
            <em className="text-clay">
              <SplitReveal text="a feeling." delay={0.25} />
            </em>
          </h1>
          <Reveal delay={0.45}>
            <p className="mt-6 max-w-xl text-lg sm:text-xl leading-relaxed text-cream/75">
              The spa Lekki trusts with its skin. Waxing, hammam, massage and
              scrubs — calm rooms, quick hands, and results that stay smooth
              for weeks, not days.
            </p>
          </Reveal>
          <Reveal delay={0.6}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Magnetic>
                <a
                  href={business.phoneHref}
                  className="inline-flex items-center rounded-full bg-clay px-7 py-4 font-bold text-[#22302a] hover:bg-cream transition-colors min-h-[52px] shadow-lg shadow-clay/30"
                >
                  Call to book →
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href={business.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-full border-2 border-cream/30 bg-white/5 backdrop-blur px-7 py-4 font-bold text-cream hover:border-clay hover:text-clay-2 transition-colors min-h-[52px]"
                >
                  DM on Instagram
                </a>
              </Magnetic>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.75}>
          <div className="flex flex-wrap gap-3 text-xs font-semibold text-cream/80">
            <span className="rounded-full bg-white/10 backdrop-blur border border-white/15 px-4 py-2 animate-floaty">
              ✦ Drag — look around the ritual
            </span>
            <span className="rounded-full bg-white/10 backdrop-blur border border-white/15 px-4 py-2">
              Waxing · Hammam · Massage · Scrubs
            </span>
            <span className="rounded-full bg-white/10 backdrop-blur border border-white/15 px-4 py-2">
              7A Taiye Olowu St, Lekki Phase 1
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------- MARQUEE ------------------------------ */
export function Marquee() {
  const row = [...marqueeWords, ...marqueeWords];
  return (
    <div className="bg-cocoa py-5 overflow-hidden" aria-hidden="true">
      <div className="flex w-max animate-marquee gap-0">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-center">
            {row.map((w, i) => (
              <span key={`${half}-${i}`} className="flex items-center">
                <span className="font-display text-4xl sm:text-5xl text-cream px-6 italic">{w}</span>
                <span className="text-clay-2 text-2xl">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------- PROOF ------------------------------- */
export function Proof() {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {proofStats.map((s) => (
            <Reveal key={s.label}>
              <p className="font-display text-6xl sm:text-7xl font-medium text-cocoa">
                <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-sm font-semibold tracking-wide uppercase text-cocoa/60">{s.label}</p>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="mt-10 max-w-3xl text-lg text-cocoa/70">
            Rated {business.rating} stars across {business.reviewCount} reviews on {business.reviewSource}.
            Lekki's most-reviewed waxing spa didn't get there by accident — it got there one smooth
            appointment at a time.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------ SERVICES ------------------------------ */
export function Services() {
  return (
    <section id="services" className="py-24 sm:py-32 bg-cream-2">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeading eyebrow="The signature smooths" title="Four ways to" accent="feel new." />
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {signatureServices.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.08}>
              <a
                href={business.phoneHref}
                className="group block overflow-hidden rounded-[2rem] bg-cream border border-cocoa/10 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl hover:shadow-clay/20"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <span className="absolute top-4 left-4 rounded-full bg-cream/90 px-3 py-1.5 text-xs font-bold text-cocoa">
                    {s.time}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-3xl font-medium leading-tight">{s.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-cocoa/65">{s.blurb}</p>
                  <p className="mt-4 text-sm font-bold text-clay">{s.price}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="mt-8 text-sm text-cocoa/55">
            Waxing prices are confirmed at booking — the full menu with prices lives on Fresha.
            The four spa packages below show their real Fresha prices.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------ MENU BOARD ---------------------------- */
export function MenuBoard() {
  const waxing = [
    { name: "Brazilian Wax", note: "Front to back, the full works", price: "Confirmed at booking" },
    { name: "Bikini Wax", note: "The classic line", price: "Confirmed at booking" },
    { name: "Full Leg Wax", note: "Thigh to ankle", price: "Confirmed at booking" },
    { name: "Half Leg Wax", note: "Knee down", price: "Confirmed at booking" },
    { name: "Underarm Wax", note: "The 15-minute reset", price: "Confirmed at booking" },
    { name: "Brow Shape & Wax", note: "Clean frame, shaped to you", price: "Confirmed at booking" },
    { name: "Upper Lip & Chin", note: "The finishing touches", price: "Confirmed at booking" },
    { name: "Full Body Wax", note: "Everything, one visit", price: "Confirmed at booking" },
  ];
  return (
    <section id="menu" className="py-24 sm:py-32 bg-cocoa text-cream">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeading
          dark
          eyebrow="The menu"
          title="Pick your"
          accent="smooth."
        />
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <Reveal>
              <h3 className="font-display text-3xl italic text-clay-2">Waxing</h3>
            </Reveal>
            <ul className="mt-6">
              {waxing.map((item, i) => (
                <Reveal key={item.name} delay={i * 0.04}>
                  <li className="flex items-baseline gap-3 py-4 border-b border-cream/10">
                    <span className="font-display text-2xl">{item.name}</span>
                    <span className="hidden sm:inline flex-1 border-b border-dotted border-cream/25 translate-y-[-4px]" />
                    <span className="ml-auto text-sm font-semibold text-blush whitespace-nowrap">{item.price}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
          <div>
            <Reveal>
              <h3 className="font-display text-3xl italic text-clay-2">Spa packages — real Fresha prices</h3>
            </Reveal>
            <ul className="mt-6">
              {packages.map((p, i) => (
                <Reveal key={p.name} delay={i * 0.04}>
                  <li className="flex items-baseline gap-3 py-4 border-b border-cream/10">
                    <span className="font-display text-2xl">{p.name}</span>
                    <span className="text-xs text-cream/60">{p.time}</span>
                    <span className="hidden sm:inline flex-1 border-b border-dotted border-cream/25 translate-y-[-4px]" />
                    <span className="ml-auto font-display text-2xl font-semibold text-clay-2 whitespace-nowrap">{p.price}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
            <Reveal>
              <p className="mt-6 text-sm text-cream/60">
                Package prices verified from the salon's Fresha listing, Oct 2026. Waxing prices
                are confirmed when you book.
              </p>
            </Reveal>
            <Reveal>
              <a
                href={business.phoneHref}
                className="mt-8 inline-flex items-center rounded-full bg-clay px-7 py-4 font-bold text-cream hover:bg-cream hover:text-cocoa transition-colors min-h-[52px]"
              >
                Book your treatment →
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- GALLERY ------------------------------ */
export function Gallery() {
  return (
    <section className="py-24 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeading eyebrow="Inside the spa" title="Calm, on" accent="purpose." />
      </div>
      <div className="mt-12 flex gap-5 overflow-x-auto px-5 sm:px-8 pb-4 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {gallery.map((g, i) => (
          <Reveal key={g.src + i} delay={i * 0.05} className="shrink-0 snap-start">
            <figure className="relative w-[280px] sm:w-[360px] aspect-[4/5] overflow-hidden rounded-[2rem]">
              <img
                src={g.src}
                alt={g.alt}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <figcaption className="absolute bottom-4 left-4 rounded-full bg-cream/90 px-4 py-1.5 text-xs font-bold text-cocoa">
                {g.label}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
      <p className="max-w-7xl mx-auto px-5 sm:px-8 mt-4 text-xs text-cocoa/50">
        Imagery is AI-generated concept photography in the spa's own colours — the salon's real photos replace it at launch.
      </p>
    </section>
  );
}

/* -------------------------------- VISIT ------------------------------- */
export function Visit() {
  return (
    <section id="visit" className="py-24 sm:py-32 bg-cream-2">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <WaveDivider />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          <div>
            <SectionHeading eyebrow="Find us" title="Come get" accent="smooth." />
            <Reveal>
              <p className="mt-6 text-lg text-cocoa/70 leading-relaxed max-w-lg">
                One calm room in Lekki Phase 1. Walk-ins when there's space, bookings
                when there's not — and there usually isn't, so book ahead.
              </p>
            </Reveal>
            <Reveal>
              <dl className="mt-10 space-y-6 text-base">
                <div>
                  <dt className="text-xs font-bold tracking-[0.25em] uppercase text-clay">Address</dt>
                  <dd className="mt-1 font-semibold">{business.address}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold tracking-[0.25em] uppercase text-clay">Phone</dt>
                  <dd className="mt-1">
                    <a href={business.phoneHref} className="font-semibold underline decoration-clay/50 underline-offset-4 hover:text-clay">
                      {business.phoneDisplay}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold tracking-[0.25em] uppercase text-clay">Hours</dt>
                  <dd className="mt-1 text-cocoa/75">{business.hoursNote}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold tracking-[0.25em] uppercase text-clay">Instagram</dt>
                  <dd className="mt-1">
                    <a href={business.instagramUrl} target="_blank" rel="noreferrer" className="font-semibold underline decoration-clay/50 underline-offset-4 hover:text-clay">
                      {business.instagram}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold tracking-[0.25em] uppercase text-clay">Good to know</dt>
                  <dd className="mt-1 text-cocoa/75">
                    Wheelchair-accessible parking &amp; restroom. Cards, NFC and Visa/Mastercard accepted.
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>
          <Reveal>
            <div className="rounded-[2rem] bg-cocoa text-cream p-8 sm:p-10">
              <p className="font-display text-4xl sm:text-5xl leading-tight">
                Your smoothest weeks start with <em className="text-clay-2">one call.</em>
              </p>
              <p className="mt-4 text-cream/70">
                Book on Fresha, call, or DM — whichever you reach for first.
              </p>
              <div className="mt-8 flex flex-col gap-3">
                <a
                  href={business.phoneHref}
                  className="rounded-full bg-clay px-6 py-4 text-center font-bold text-cream hover:bg-cream hover:text-cocoa transition-colors min-h-[52px] flex items-center justify-center"
                >
                  Call {business.phoneDisplay}
                </a>
                <a
                  href={business.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-cream/30 px-6 py-4 text-center font-bold hover:bg-cream/10 transition-colors min-h-[52px] flex items-center justify-center"
                >
                  DM {business.instagram}
                </a>
                <a
                  href={business.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-cream/30 px-6 py-4 text-center font-bold hover:bg-cream/10 transition-colors min-h-[52px] flex items-center justify-center"
                >
                  Get directions →
                </a>
              </div>
              <p className="mt-6 text-xs text-cream/50">
                Find "Wax It Lagos" on Fresha to see live availability and the full price list.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- FOOTER ------------------------------ */
export function Footer() {
  return (
    <footer className="bg-cocoa text-cream pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row justify-between gap-8">
          <LogoLockup dark />
          <nav className="flex flex-wrap gap-6 text-sm font-semibold text-cream/70">
            <a href="#services" className="hover:text-clay-2">Treatments</a>
            <a href="#journey" className="hover:text-clay-2">The visit</a>
            <a href="#menu" className="hover:text-clay-2">Menu</a>
            <a href="#voices" className="hover:text-clay-2">Reviews</a>
            <a href="#visit" className="hover:text-clay-2">Find us</a>
          </nav>
        </div>
        <p className="mt-12 pt-6 border-t border-cream/10 text-xs text-cream/50">
          © 2026 {business.name} · {business.address} · Concept demo site built for {business.name} by Claro&amp;co Tech Solutions.
        </p>
      </div>
    </footer>
  );
}
