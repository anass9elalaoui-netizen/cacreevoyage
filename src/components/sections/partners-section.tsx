"use client";

import React from "react";
import { LogoCarousel } from "@/components/ui/logo-carousel";

interface Partner {
  name: string;
  logo: {
    url?: string;
    alt?: string;
  };
}

interface PartnersSectionProps {
  title?: string;
  description?: string;
  columnCount?: number;
  partners?: Partner[];
}

// Default fallbacks when CMS data is not yet configured
const DEFAULT_TITLE = "Nos Partenaires d'Excellence";
const DEFAULT_DESCRIPTION =
  "Nous collaborons avec les leaders mondiaux de l'aviation, de l'hôtellerie et de l'assurance pour vous garantir un voyage en toute sérénité.";

const DEFAULT_PARTNERS: Partner[] = [
  { name: "Turkish Airlines", logo: { url: "/partners/turkish-airlines.svg" } },
  { name: "Royal Air Maroc", logo: { url: "/partners/royal-air-maroc.svg" } },
  { name: "Attijariwafa Bank", logo: { url: "/partners/attijariwafa.svg" } },
  { name: "Emirates Airlines", logo: { url: "/partners/emirates.svg" } },
  { name: "Qatar Airways", logo: { url: "/partners/qatar-airways.svg" } },
];

/**
 * Dynamically creates a React component wrapper for each partner logo image.
 * The LogoCarousel expects `img: React.ComponentType<{ className?: string }>`.
 */
function buildLogoEntries(partners: Partner[]) {
  return partners.map((partner, idx) => ({
    name: partner.name,
    id: idx + 1,
    img: ({ className }: { className?: string }) => (
      <div className={`${className ?? ""} relative`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={partner.logo?.url || ""}
          alt={partner.name}
          className="absolute inset-0 w-full h-full object-contain opacity-60 grayscale hover:grayscale-0 hover:opacity-100 dark:invert transition-all duration-300"
        />
      </div>
    ),
  }));
}

export function PartnersSection({
  title,
  description,
  columnCount,
  partners,
}: PartnersSectionProps) {
  const resolvedTitle = title || DEFAULT_TITLE;
  const resolvedDescription = description || DEFAULT_DESCRIPTION;
  const resolvedColumns = columnCount || 3;
  const resolvedPartners = partners && partners.length > 0 ? partners : DEFAULT_PARTNERS;

  const logoEntries = React.useMemo(
    () => buildLogoEntries(resolvedPartners),
    [resolvedPartners]
  );

  return (
    <section className="w-full py-24 bg-slate-50 dark:bg-[#0a0f1c] overflow-hidden">
      <div className="mx-auto flex w-full max-w-screen-xl flex-col items-center space-y-12 px-4">
        <div className="text-center space-y-4">
          <p className="text-sm font-semibold tracking-widest text-amber-600 uppercase">
            Ils nous font confiance
          </p>
          <h3 className="tracking-tight pb-3 bg-clip-text text-transparent bg-gradient-to-t from-slate-700 to-slate-900 dark:from-slate-200 dark:to-white text-3xl sm:text-4xl lg:text-5xl font-bold">
            {resolvedTitle}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            {resolvedDescription}
          </p>
        </div>

        <LogoCarousel columnCount={resolvedColumns} logos={logoEntries} />
      </div>
    </section>
  );
}
