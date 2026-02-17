"use client";

import { useState } from "react";
import Link from "next/link";
import { artists } from "@/data/artists";
import { getMomentumColor, getMomentumIcon } from "@/data/artists";

export default function WatchlistPage() {
  // In production, this comes from Supabase. For now, start with first 3 artists as demo.
  const [watchedSlugs, setWatchedSlugs] = useState<string[]>([
    "amara-osei",
    "kai-tanaka",
    "elena-vasquez",
  ]);

  const watchedArtists = artists.filter((a) => watchedSlugs.includes(a.slug));
  const availableArtists = artists.filter((a) => !watchedSlugs.includes(a.slug));

  const removeFromWatchlist = (slug: string) => {
    setWatchedSlugs((prev) => prev.filter((s) => s !== slug));
  };

  const addToWatchlist = (slug: string) => {
    setWatchedSlugs((prev) => [...prev, slug]);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">My Watchlist</h1>
        <p className="mt-1 text-stone-500">
          Track artists and get notified when their momentum changes.
        </p>
      </div>

      {/* Watched artists */}
      {watchedArtists.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 bg-white p-12 text-center">
          <p className="text-stone-500">Your watchlist is empty.</p>
          <p className="mt-1 text-sm text-stone-400">
            Add artists below to start tracking them.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {watchedArtists.map((artist) => (
            <div
              key={artist.slug}
              className="flex items-center justify-between rounded-xl border border-stone-200 bg-white px-6 py-4"
            >
              <Link
                href={`/artists/${artist.slug}`}
                className="flex items-center gap-4 flex-1 min-w-0"
              >
                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-stone-900 hover:text-red-700 transition">
                    {artist.name}
                  </p>
                  <p className="text-sm text-stone-400">
                    {artist.medium} &middot; {artist.priceRange}
                  </p>
                </div>
              </Link>
              <div className="flex items-center gap-4">
                <span
                  className={`hidden sm:inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold uppercase ${getMomentumColor(artist.momentum)}`}
                >
                  {getMomentumIcon(artist.momentum)} {artist.momentum}
                </span>
                <span className="text-lg font-bold text-stone-700">
                  {artist.momentumScore}
                </span>
                <button
                  onClick={() => removeFromWatchlist(artist.slug)}
                  className="rounded-lg border border-stone-200 p-2 text-stone-400 transition hover:border-red-200 hover:text-red-600"
                  title="Remove from watchlist"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add more */}
      {availableArtists.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-stone-900">Add to Watchlist</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {availableArtists.map((artist) => (
              <button
                key={artist.slug}
                onClick={() => addToWatchlist(artist.slug)}
                className="flex items-center gap-3 rounded-xl border border-dashed border-stone-300 bg-white p-4 text-left transition hover:border-stone-400 hover:shadow-sm"
              >
                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-stone-900">{artist.name}</p>
                  <p className="text-xs text-stone-400">{artist.medium}</p>
                </div>
                <svg className="h-5 w-5 flex-shrink-0 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
