"use client";

/* Wax It Lagos mark — a wax droplet with a steam swirl inside. */
export function LogoLockup({ dark = false }: { dark?: boolean }) {
  const ring = dark ? "#e8b4a0" : "#c96f4a";
  return (
    <a href="#top" className="flex items-center gap-2.5" aria-label="Wax It Lagos — home">
      <svg width="34" height="34" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path
          d="M20 3 C 20 3, 34 17, 34 25.5 A 14 12.5 0 1 1 6 25.5 C 6 17, 20 3, 20 3 Z"
          fill={ring}
        />
        <path
          d="M13 26 C 15 20, 19 17, 24 19 C 28 21, 29 25, 26 28 C 23 31, 17 30, 15 27"
          stroke="#fbf3ea"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="17" cy="15" r="1.6" fill="#fbf3ea" />
      </svg>
      <span className="leading-none">
        <span className={`block font-display text-[22px] font-semibold tracking-wide ${dark ? "text-cream" : "text-cocoa"}`}>
          Wax It Lagos
        </span>
        <span className={`block text-[9px] font-bold tracking-[0.34em] uppercase ${dark ? "text-blush" : "text-clay"}`}>
          Smooth is a feeling
        </span>
      </span>
    </a>
  );
}
