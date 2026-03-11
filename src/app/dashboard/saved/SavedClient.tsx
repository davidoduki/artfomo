"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getMomentumColor, getMomentumIcon } from "@/data/artists";
import type { MomentumLevel } from "@/data/artists";

type Artist = {
  slug: string;
  name: string;
  medium: string;
  location: string;
  priceRange: string;
  momentum: MomentumLevel;
  image: string;
};

interface SavedClientProps {
  initialSavedSlugs: string[];
  savedArtists: Artist[];
  allArtists: Artist[];
}

export function SavedClient({
  initialSavedSlugs,
  savedArtists: initialSaved,
  allArtists,
}: SavedClientProps) {
  const [savedSlugs, setSavedSlugs] = useState(initialSavedSlugs);
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();

  const savedArtists = allArtists.filter((a) => savedSlugs.includes(a.slug));

  const toggleSaved = (slug: string) => {
    const isSaved = savedSlugs.includes(slug);
    startTransition(async () => {
      if (isSaved) {
        await supabase.from("saved_artists").delete().eq("artist_slug", slug);
        setSavedSlugs((prev) => prev.filter((s) => s !== slug));
      } else {
        const { error } = await supabase
          .from("saved_artists")
          .insert({ artist_slug: slug });
        if (!error) {
          setSavedSlugs((prev) => [...prev, slug]);
        }
      }
    });
  };

  // Suppress unused warning — initialSaved used only for SSR hydration order
  void initialSaved;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Saved Artists</h1>
        <p className="mt-1 text-stone-500">Artists you&apos;ve bookmarked for later.</p>
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
                <img src={artist.image} alt={artist.name} className="h-full w-full object-cover" />
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
                  disabled={isPending}
                  className="rounded-lg p-1.5 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
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
                <span className="text-sm font-bold text-stone-600">{artist.priceRange}</span>
              </div>
            </div>
          ))}
        </div>
      )}

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
