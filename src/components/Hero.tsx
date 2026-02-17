"use client";

import { useState, useEffect, useCallback } from "react";

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

const TYPE_SPEED = 100;
const DELETE_SPEED = 60;
const PAUSE_BEFORE_DELETE = 2000;
const PAUSE_BEFORE_TYPE = 400;

export default function Hero() {
  const [displayed, setDisplayed] = useState("Basquiat");
  const [artistIndex, setArtistIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const tick = useCallback(() => {
    const currentArtist = ARTISTS[artistIndex];

    if (!isDeleting) {
      // Typing
      if (displayed.length < currentArtist.length) {
        setDisplayed(currentArtist.slice(0, displayed.length + 1));
        return TYPE_SPEED;
      }
      // Done typing — pause then start deleting
      setIsDeleting(true);
      return PAUSE_BEFORE_DELETE;
    } else {
      // Deleting
      if (displayed.length > 0) {
        setDisplayed(currentArtist.slice(0, displayed.length - 1));
        return DELETE_SPEED;
      }
      // Done deleting — move to next artist
      setIsDeleting(false);
      setArtistIndex((prev) => (prev + 1) % ARTISTS.length);
      return PAUSE_BEFORE_TYPE;
    }
  }, [displayed, artistIndex, isDeleting]);

  useEffect(() => {
    const delay = tick();
    const timeout = setTimeout(() => {
      // Force a re-render which triggers tick again
      setDisplayed((d) => d); // no-op to trigger effect
      tick();
    }, delay);
    return () => clearTimeout(timeout);
  }, [tick]);

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
          <span className="italic text-red-700">
            {displayed}
            <span className="inline-block w-[3px] h-[0.85em] bg-red-700 align-middle ml-0.5 animate-[blink_1s_step-end_infinite]" />
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
