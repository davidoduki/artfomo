"use client";

import { useState, useEffect } from "react";

const ARTISTS = [
  "Basquiat",
  "Kusama",
  "Banksy",
  "Haring",
  "Koons",
  "Abramović",
  "Hockney",
  "Wiley",
];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % ARTISTS.length);
        setVisible(true);
      }, 600);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#fafaf8]">
      <div className="mx-auto max-w-5xl px-6 pt-32 pb-8 text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-1.5 text-sm text-stone-600 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
          Live market signals — updated daily
        </div>

        {/* Headline */}
        <h1 className="text-5xl font-bold tracking-tight text-stone-900 sm:text-7xl leading-[1.1]">
          Don&apos;t Miss the Next{" "}
          <span
            className="inline-block italic text-red-700 transition-opacity duration-500"
            style={{ opacity: visible ? 1 : 0 }}
          >
            {ARTISTS[index]}
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-500 sm:text-xl leading-relaxed">
          The data-driven directory of hot emerging artists, limited
          drops, and market momentum — built for collectors who
          move early.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="#waitlist"
            className="inline-flex h-12 items-center rounded-full bg-stone-900 px-8 text-base font-semibold text-white shadow-md transition hover:bg-stone-800 hover:shadow-lg"
          >
            Get Early Access
          </a>
          <a
            href="#features"
            className="inline-flex h-12 items-center rounded-full border border-stone-300 bg-white px-8 text-base font-medium text-stone-700 transition hover:bg-stone-50 hover:border-stone-400"
          >
            See Trending Artists
          </a>
        </div>
      </div>

      {/* Hero image — gallery scene */}
      <div className="mx-auto mt-12 max-w-5xl px-6 pb-24">
        <div className="overflow-hidden rounded-2xl border border-stone-200 shadow-lg">
          <img
            src="/images/hero-gallery.svg"
            alt="Gallery interior with contemporary artwork on display"
            className="w-full"
          />
        </div>
      </div>

      {/* Social proof */}
      <div className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            "Built from marketplace signals, gallery activity, and collector demand",
            "Updated daily with real-time momentum tracking",
            "Designed for collectors, advisors, and art-curious investors",
          ].map((text) => (
            <div
              key={text}
              className="rounded-xl border border-stone-200 bg-white px-5 py-4 text-sm text-stone-500 shadow-sm"
            >
              {text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
