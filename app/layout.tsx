import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { business } from "@/lib/data";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});
const sans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wax It Lagos — Waxing Spa, Lekki Phase 1 | Smooth is a feeling.",
  description:
    "Lekki's 4.8-star waxing spa. Brazilian, full leg, facial and underarm waxing, body scrubs, hammam and massage at 7A Taiye Olowu Street, Lekki Phase 1. 871 reviews.",
  openGraph: {
    title: "Wax It Lagos — Smooth is a feeling.",
    description:
      "4.8★ from 871 reviews. Lekki's waxing spa for skin that stays smooth for weeks.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DaySpa",
    name: business.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: "7A Taiye Olowu Street, Lekki Phase 1",
      addressLocality: "Lagos",
      addressCountry: "NG",
    },
    telephone: "+2347011772168",
    sameAs: [business.instagramUrl],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: business.rating,
      reviewCount: business.reviewCount,
    },
    priceRange: "₦₦",
    paymentAccepted: "Debit Card, NFC Mobile Payments, MasterCard, Visa",
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Wheelchair accessible parking lot", value: true },
      { "@type": "LocationFeatureSpecification", name: "Wheelchair accessible restroom", value: true },
    ],
  };
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
