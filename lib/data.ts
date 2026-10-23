import { BATH, IG_BACK, IG_LYMPH, IG_REFLEX, IG_ROOM, IG_THERAPIST, IG_WAX, JOURNEY_IMGS, LAB_IMGS } from "./photos";

/* Wax It Lagos — verified facts, Oct 18, 2026.
   Sources: Fresha listing (rating, reviews, package prices), Facebook
   business listing (phone, address), Google business profile (categories,
   amenities, payments, review quotes), fashionpoliceng (top waxing spa).
   Anything NOT verified is marked "Confirmed at booking" — the salon's
   waxing menu prices live on Fresha and were not publicly readable. */

export const business = {
  name: "Wax It Lagos",
  tagline: "Smooth is a feeling.",
  category: "Waxing spa",
  address: "7A Taiye Olowu Street, Lekki Phase 1, Lagos",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Wax+It+Lagos+7A+Taiye+Olowu+Street+Lekki+Phase+1",
  phoneDisplay: "+234 701 177 2168",
  phoneHref: "tel:+2347011772168",
  instagram: "@waxitlagos",
  instagramUrl: "https://www.instagram.com/waxitlagos/",
  rating: 4.8,
  reviewCount: 871,
  reviewSource: "Fresha + Google",
  /* Hours were NOT verifiable from any public listing at build time.
     The site shows the placeholder note below — swap in real hours. */
  hoursNote: "Hours vary — check Fresha for today's opening times.",
};

export const proofStats = [
  { value: 4.8, decimals: 1, suffix: "★", label: "Average rating" },
  { value: 871, decimals: 0, suffix: "+", label: "Reviews on Fresha & Google" },
  { value: 100, decimals: 0, suffix: "%", label: "Smooth-skin obsession" },
];

/* Signature treatments — waxing menu prices are placeholders (Fresha). */
export const signatureServices = [
  {
    name: "Brazilian Wax",
    blurb: "The full works, front to back. Precise, quick, and calmer than you expect.",
    price: "Confirmed at booking",
    time: "±40 min",
    image: LAB_IMGS.wax,
  },
  {
    name: "Full Leg Wax",
    blurb: "Thigh to ankle, hair out from the root — smooth for up to four weeks.",
    price: "Confirmed at booking",
    time: "±45 min",
    image: IG_WAX,
  },
  {
    name: "Facial & Brow Wax",
    blurb: "Brows, upper lip, chin — a clean frame for your face, shaped to you.",
    price: "Confirmed at booking",
    time: "±20 min",
    image: LAB_IMGS.scrub,
  },
  {
    name: "Underarm Wax",
    blurb: "The quickest confidence reset. In, out, sleeveless-ready.",
    price: "Confirmed at booking",
    time: "±15 min",
    image: LAB_IMGS.hammam,
  },
];

/* REAL Fresha package prices, verified Oct 18, 2026. */
export const packages = [
  { name: "Citrus Body Scrub", time: "1 hr", price: "₦60,000", note: "Polish + glow." },
  { name: "Decadent Duo", time: "1 hr 40 min", price: "₦225,000", note: "The two-person ritual." },
  { name: "REJUVENATED", time: "2 hr 30 min", price: "₦98,000", note: "The full reset." },
  { name: "Children's Treat", time: "30 min", price: "₦30,000", note: "Little ones, pampered." },
];

export const journeyStages = [
  {
    title: "Arrive",
    body: "You walk into a calm room, not a clinic. Music low, light warm, someone who actually smiles. Tea if you want it.",
    word: "ARRIVE",
  },
  {
    title: "Prep",
    body: "Skin is cleansed and prepped, hair trimmed if needed. Your therapist explains exactly what happens next — no surprises.",
    word: "PREP",
  },
  {
    title: "Wax",
    body: "Warm wax, quick pull, steady hands. Fatima, Godia and the team have done this thousands of times — it shows in the speed.",
    word: "WAX",
  },
  {
    title: "Glow",
    body: "Soothing finish, aftercare in plain words, and skin that stays smooth for weeks. You leave lighter than you arrived.",
    word: "GLOW",
  },
];

/* Real quotes — Fresha & Google reviews, sources noted. */
export const testimonials = [
  {
    quote:
      "My experience at Wax It Lagos was impeccable!!! The staff were extremely polite, patient, and kind. The Hammam scrub was truly one of the best I have had.",
    name: "Sheba B.",
    source: "Fresha review",
  },
  {
    quote:
      "Wax It Lagos has the best relaxation and beauty services in Lagos. I want a solo spa date and I didn't feel alone! It's worth every penny and yes, I'll be visiting again soon.",
    name: "Amoura Fragrances",
    source: "Google review",
  },
  {
    quote:
      "I had a wonderful session with Godia — she was excellent, very skilled, and made the experience enjoyable.",
    name: "Fresha customer",
    source: "Fresha review",
  },
  {
    quote:
      "Lovely experience as always. You guys should look into a monthly membership or auto reminder for appointments. It's a good way to retain customers.",
    name: "Ify O.",
    source: "Fresha review",
  },
  {
    quote:
      "I had an amazing experience with my friend here… although a little pricey, it was worth every penny.",
    name: "Deborah Motunrayo Joseph",
    source: "Google review",
  },
];

export const gallery = [
  {
    src: BATH,
    alt: "The hammam bath — emerald water, brass rim, candlelight",
    label: "The bath",
  },
  {
    src: IG_BACK,
    alt: "Real moment from the spa — hands working over an oiled leg",
    label: "The release",
  },
  {
    src: IG_LYMPH,
    alt: "Real moment from the spa — lymphatic drainage massage",
    label: "The restore",
  },
  {
    src: IG_REFLEX,
    alt: "Real moment from the spa — foot reflexology in progress",
    label: "The details",
  },
  {
    src: IG_THERAPIST,
    alt: "Real moment from the spa — a facial treatment in progress",
    label: "The facial",
  },
  {
    src: IG_ROOM,
    alt: "Real moment from the spa — a massage in the treatment room",
    label: "The unwind",
  },
];

export const marqueeWords = ["SMOOTH", "CALM", "GLOW", "SOFT", "WAX IT"];
