"use client";

import React, { useEffect } from "react";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export function InstagramEmbed() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://elfsightcdn.com/platform.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <section className="w-full py-16 lg:py-24 bg-slate-50 dark:bg-[#0B132B] transition-colors duration-700 overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
          <div>
            <span className="uppercase text-amber-600 text-xs font-semibold tracking-wider mb-3 block">
              Notre communauté
            </span>
            <h3 className="tracking-tight pb-1 bg-clip-text text-transparent bg-gradient-to-t from-slate-700 to-slate-900 dark:from-slate-200 dark:to-white text-3xl sm:text-4xl lg:text-5xl font-bold font-heading">
              Suivez-nous sur Instagram
            </h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">
              @cacreevoyage &bull; Moments forts &amp; coulisses
            </p>
          </div>
          <a
            href="https://www.instagram.com/cacreevoyage/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
          >
            <InstagramIcon className="w-5 h-5" />
            S&apos;abonner
          </a>
        </div>

        {/* Widget Wrapper with Glassmorphic Framing */}
        <div className="w-full rounded-2xl md:rounded-3xl overflow-hidden bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200/60 dark:border-white/10 p-2 md:p-4 shadow-sm ring-1 ring-black/5 dark:ring-white/10">
          <div
            className="elfsight-app-f42a9ea1-4ea9-40c3-bd4a-ee2b75433dc2"
            data-elfsight-app-lazy
          ></div>
        </div>
      </div>
    </section>
  );
}
