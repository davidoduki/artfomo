"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { BannerUpgrade } from "@/components/subscription/BannerUpgrade";
import { getMomentumColor, getMomentumIcon } from "@/data/artists";
import type { SubscriptionTier } from "@/lib/types";

type Artist = {
  slug: string;
  name: string;
  medium: string;
  location: string;
  priceRange: string;
  momentum: string;
  momentumScore: number;
  image: string;
};

interface WatchlistClientProps {
  initialWatchedSlugs: string[];
  watchedArtists: Artist[];
  availableArtists: Artist[];
  tier: SubscriptionTier;
  limit: number;
}

export function WatchlistClient({
  initialWatchedSlugs,
  watchedArtists: initialWatched,
  availableArtists: initialAvailable,
  tier,
  limit,
}: WatchlistClientProps) {
  const [watchedSlugs, setWatchedSlugs] = useState(initialWatchedSlugs);
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();

  const atLimit = watchedSlugs.length >= limit;
  const totalArtists = initialWatched.length + initialAvailable.length;

  const watchedArtists = [...initialWatched, ...initialAvailable].filter((a) =>
    watchedSlugs.includes(a.slug)
  );
  const availableArtists = [...initialWatched, ...initialAvailable].filter(
    (a) => !watchedSlugs.includes(a.slug)
  );

  const removeFromWatchlist = (slug: string) => {
    startTransition(async () => {
      await supabase.from("watchlist").delete().eq("artist_slug", slug);
      setWatchedSlugs((prev) => prev.filter((s) => s !== slug));
    });
  };

  const addToWatchlist = (slug: string) => {
    if (atLimit) return;
    startTransition(async () => {
      const { error } = await supabase
        .from("watchlist")
        .insert({ artist_slug: slug });
      if (!error) {
        setWatchedSlugs((prev) => [...prev, slug]);
      }
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">My Watchlist</h1>
        <p className="mt-1 text-stone-500">
          Track artists and get notified when their momentum changes.
        </p>
      </div>

      {/* Tier limit banner */}
      <div className="mb-6">
        <BannerUpgrade
          shown={limit}
          total={totalArtists}
          feature="watchlist_50"
          label="watchlist slots"
        />
      </div>

      {/* Slot counter */}
      <div className="mb-4 flex items-center gap-2 text-sm text-stone-400">
        <span>
          {watchedSlugs.length} / {limit === 9999 ? "∞" : limit} slots used
        </span>
        {atLimit && tier === "free" && (
          <Link href="/pricing" className="text-red-700 hover:underline font-medium">
            Upgrade to add more →
          </Link>
        )}
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
                  <img src={artist.image} alt={artist.name} className="h-full w-full object-cover" />
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
                  disabled={isPending}
                  className="rounded-lg border border-stone-200 p-2 text-stone-400 transition hover:border-red-200 hover:text-red-600 disabled:opacity-50"
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
            {availableArtists.map((artist) => {
              const locked = atLimit;
              return (
                <button
                  key={artist.slug}
                  onClick={() => addToWatchlist(artist.slug)}
                  disabled={locked || isPending}
                  className={`flex items-center gap-3 rounded-xl border border-dashed bg-white p-4 text-left transition ${
                    locked
                      ? "cursor-not-allowed border-stone-200 opacity-50"
                      : "border-stone-300 hover:border-stone-400 hover:shadow-sm"
                  }`}
                >
                  <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg">
                    <img src={artist.image} alt={artist.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-stone-900">{artist.name}</p>
                    <p className="text-xs text-stone-400">{artist.medium}</p>
                  </div>
                  {locked ? (
                    <svg className="h-5 w-5 flex-shrink-0 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 flex-shrink-0 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
