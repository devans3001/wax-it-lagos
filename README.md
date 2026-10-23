# Wax It Lagos — Concept Website

A cinematic, immersive concept site for **Wax It Lagos**, the waxing spa at 7A Taiye Olowu Street, Lekki Phase 1.

Concept: **THE HAMMAM RITUAL, photographed** — AI-generated photoreal photography in the spa's own brand colours (forest green `#2E3E37`, champagne gold `#BFA15C`, cream `#F5F2EA`, sampled from their Instagram). The hero bath photograph parallaxes with real depth (AI depth map) under live steam; the visit travels through photographed rooms that change with each stage; the Ritual Lab shows a photographic close-up per treatment; and the before/after is a matched skin pair — overdue skin vs the same skin after one visit — revealed by dragging the handle or by scrolling (toggle on the card).

## What is real

- **Rating:** 4.8★ from 871 reviews (Fresha + Google)
- **Address, phone** (+234 701 177 2168), Instagram `@waxitlagos` — from the salon's public listings
- **Testimonials** — five real quotes from Fresha/Google reviews, sources noted
- **Package prices** — Citrus Body Scrub ₦60,000, Decadent Duo ₦225,000, REJUVENATED ₦98,000, Children's Treat ₦30,000 (Fresha, verified Oct 2026)

## Before this goes live for the client

1. **Waxing prices** — the waxing menu shows "Confirmed at booking". Replace with the real prices from the salon's Fresha price list in `lib/data.ts`.
2. **Hours** — the hours note is a placeholder ("check Fresha"). Swap in real opening hours.
3. **Photos** — gallery + service images are AI-generated concept photography in the spa's brand colours (embedded as data URIs in `lib/photos/`). The salon's own photos replace them.
4. **Booking** — CTAs call the salon and DM Instagram. Add the salon's direct Fresha booking link when supplied.

## Stack

Next.js 15 · React 19 · Tailwind v4 · GSAP · React Three Fiber · Vercel-ready.

```bash
npm install
npm run dev
```
