"use client";

import { useState } from "react";
import Link from "next/link";
import { artists, getMomentumColor, getMomentumIcon } from "@/data/artists";

export default function SavedArtistsPage() {
  const [savedSlugs, setSavedSlugs] = useState<string[]>([
    "amara-osei",
    "marcus-reed",
  ]);

  const savedArtists = artists.filter((a) => savedSlugs.includes(a.slug));

  const toggleSaved = (slug: string) => {
    setSavedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Saved Artists</h1>
        <p className="mt-1 text-stone-500">
          Artists you&apos;ve bookmarked for later.
        </p>
      </div>

      {savedArtists.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 bg-white p-12 text-center">
          <p className="text-stone-500">No saved artists yet.</p>
          <Link
            href="/artists"
            className="mt-3 inline-block text-sm font-medium text-red-700 hover:underline"
          >
            Browse the directory &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {savedArtists.map((artist) => (
            <div
              key={artist.slug}
              className="group rounded-xl border border-stone-200 bg-white p-5 transition hover:shadow-sm"
            >
              <div className="mb-4 h-32 overflow-hidden rounded-lg">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <Link
                    href={`/artists/${artist.slug}`}
                    className="font-semibold text-stone-900 hover:text-red-700 transition"
                  >
                    {artist.name}
                  </Link>
                  <p className="text-sm text-stone-400">
                    {artist.medium} &middot; {artist.location}
                  </p>
                </div>
                <button
                  onClick={() => toggleSaved(artist.slug)}
                  className="rounded-lg p-1.5 text-red-600 transition hover:bg-red-50"
                  title="Remove from saved"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                  </svg>
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase ${getMomentumColor(artist.momentum)}`}
                >
                  {getMomentumIcon(artist.momentum)} {artist.momentum}
                </span>
                <span className="text-sm font-bold text-stone-600">
                  {artist.priceRange}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Browse more */}
      <div className="mt-8 text-center">
        <Link
          href="/artists"
          className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-6 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
        >
          Browse All Artists &rarr;
        </Link>
      </div>
    </div>
  );
}
