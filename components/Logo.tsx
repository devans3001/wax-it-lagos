"use client";

/* The Wax It Lagos logo, recreated as a crisp vector from their own
   brand mark (the gold interlaced lotus over WAXIT / SPA | WAX).
   Their published logo only exists as a tiny social avatar, so this
   faithful redrawing keeps it sharp at every size — and their original
   artwork can drop straight in if they hand it over. */

export function LotusMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 52"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* side petals — the centre petal, rotated about the base */}
      <path d="M32 3 C39 13 40 23 32 33 C24 23 25 13 32 3 Z" transform="rotate(-38 32 38)" />
      <path d="M32 3 C39 13 40 23 32 33 C24 23 25 13 32 3 Z" transform="rotate(38 32 38)" />
      {/* centre petal */}
      <path d="M32 3 C39 13 40 23 32 33 C24 23 25 13 32 3 Z" />
      {/* inner petal */}
      <path d="M32 15 C35.5 20 35.5 26 32 31 C28.5 26 28.5 20 32 15 Z" strokeWidth="1.8" />
      {/* base swooshes */}
      <path d="M7 40 C19 48.5 45 48.5 57 40" />
      <path d="M16 46.5 C26 51 38 51 48 46.5" strokeWidth="1.8" opacity="0.65" />
    </svg>
  );
}

export function LogoLockup({ dark = false }: { dark?: boolean }) {
  return (
    <a href="#top" className="flex items-center gap-3" aria-label="Wax It Lagos — home">
      <LotusMark className={`h-9 w-11 shrink-0 ${dark ? "text-clay" : "text-clay"}`} />
      <span className="leading-none">
        <span
          className={`block font-display text-[21px] font-semibold tracking-[0.24em] ${
            dark ? "text-cream" : "text-cocoa"
          }`}
        >
          WAXIT
        </span>
        <span
          className={`mt-1 block text-[8.5px] font-bold tracking-[0.44em] uppercase ${
            dark ? "text-clay" : "text-cocoa/60"
          }`}
        >
          Spa <span className="text-clay">|</span> Wax
        </span>
      </span>
    </a>
  );
}
