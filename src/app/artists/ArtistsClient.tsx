"use client";

import { useState } from "react";
import Link from "next/link";
import { mediums, getMomentumColor, getMomentumIcon } from "@/data/artists";
import type { MomentumLevel } from "@/data/artists";

type Artist = {
  slug: string;
  name: string;
  medium: string;
  location: string;
  priceRange: string;
  momentum: string;
  momentumScore: number;
  image: string;
  galleries: string[];
};

interface ArtistsClientProps {
  visibleArtists: Artist[];
  totalCount: number;
  lockedCount: number;
  hasFullAccess: boolean;
}

const momentumLevels: MomentumLevel[] = ["breakout", "rising", "steady", "emerging"];

export function ArtistsClient({
  visibleArtists,
  totalCount,
  lockedCount,
  hasFullAccess,
}: ArtistsClientProps) {
  const [search, setSearch] = useState("");
  const [selectedMedium, setSelectedMedium] = useState<string>("all");
  const [selectedMomentum, setSelectedMomentum] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"momentum" | "name">("momentum");

  const filtered = visibleArtists
    .filter((a) => {
      const matchesSearch =
        search === "" ||
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.medium.toLowerCase().includes(search.toLowerCase()) ||
        a.location.toLowerCase().includes(search.toLowerCase());
      const matchesMedium = selectedMedium === "all" || a.medium === selectedMedium;
      const matchesMomentum = selectedMomentum === "all" || a.momentum === selectedMomentum;
      return matchesSearch && matchesMedium && matchesMomentum;
    })
    .sort((a, b) =>
      sortBy === "momentum"
        ? b.momentumScore - a.momentumScore
        : a.name.localeCompare(b.name)
    );

  return (
    <div className="min-h-screen bg-[#fafaf8] text-stone-900">
      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full border-b border-stone-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-xl font-bold tracking-tight text-stone-900">
            Art<span className="text-red-700">FOMO</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/artists" className="text-sm font-medium text-stone-900">Directory</Link>
            <Link href="/pricing" className="text-sm text-stone-500 hover:text-stone-900 transition">Pricing</Link>
            <Link
              href="/login"
              className="rounded-full bg-stone-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-stone-800"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="pt-32 pb-12">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-stone-400">Artist Directory</p>
          <h1 className="mt-4 text-4xl font-bold text-stone-900 sm:text-5xl">Trending Artists</h1>
          <p className="mt-4 max-w-2xl text-lg text-stone-500">
            Live momentum signals across {totalCount} emerging artists.
            Sorted by market activity, gallery buzz, and collector demand.
          </p>
        </div>
      </div>

      {/* Tier gate banner */}
      {!hasFullAccess && (
        <div className="mx-auto max-w-6xl px-6 pb-4">
          <div className="flex items-center justify-between gap-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-900">
            <span>
              Showing top <strong>{visibleArtists.length}</strong> of{" "}
              <strong>{totalCount}</strong> artists. Unlock the full ranking.
            </span>
            <Link
              href="/pricing"
              className="shrink-0 rounded-full border border-amber-400 bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900 hover:bg-amber-200 transition-colors"
            >
              Collector · $9/mo →
            </Link>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="sticky top-16 z-40 border-y border-stone-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <input
              type="text"
              placeholder="Search artists, mediums, locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
            />
            <select value={selectedMedium} onChange={(e) => setSelectedMedium(e.target.value)} className="rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-700 outline-none focus:border-stone-900">
              <option value="all">All Mediums</option>
              {mediums.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <select value={selectedMomentum} onChange={(e) => setSelectedMomentum(e.target.value)} className="rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-700 outline-none focus:border-stone-900">
              <option value="all">All Momentum</option>
              {momentumLevels.map((m) => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as "momentum" | "name")} className="rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-700 outline-none focus:border-stone-900">
              <option value="momentum">Sort: Momentum</option>
              <option value="name">Sort: A–Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Artist Grid */}
      <div className="mx-auto max-w-6xl px-6 py-12">
        {filtered.length === 0 ? (
          <div className="py-24 text-center text-stone-400">No artists match your filters.</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((artist) => (
              <Link
                key={artist.slug}
                href={`/artists/${artist.slug}`}
                className="group rounded-2xl border border-stone-200 bg-white p-6 transition hover:border-stone-300 hover:shadow-md"
              >
                <div className="mb-5 h-40 overflow-hidden rounded-xl">
                  <img src={artist.image} alt={`Artwork by ${artist.name}`} className="h-full w-full object-cover transition group-hover:scale-105" />
                </div>
                <div className="mb-3 flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${getMomentumColor(artist.momentum)}`}>
                    {getMomentumIcon(artist.momentum)} {artist.momentum}
                  </span>
                  <span className="text-sm font-bold text-stone-700">{artist.momentumScore}</span>
                </div>
                <h3 className="text-lg font-bold text-stone-900 group-hover:text-red-700 transition">{artist.name}</h3>
                <p className="mt-1 text-sm text-stone-400">{artist.medium} · {artist.location}</p>
                <p className="mt-1 text-sm font-medium text-stone-600">{artist.priceRange}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {artist.galleries.slice(0, 2).map((g) => (
                    <span key={g} className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-500">{g}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Locked placeholder rows */}
        {!hasFullAccess && lockedCount > 0 && (
          <div className="mt-6">
            <div className="relative rounded-2xl border border-dashed border-stone-200 bg-stone-50 p-8 text-center">
              <div className="mb-3 text-2xl">🔒</div>
              <p className="font-semibold text-stone-900">
                {lockedCount} more artists ranked
              </p>
              <p className="mt-1 text-sm text-stone-500">
                Upgrade to Collector to see the full ranking of {totalCount} artists.
              </p>
              <Link
                href="/pricing"
                className="mt-4 inline-flex rounded-full bg-stone-900 px-6 py-2 text-sm font-medium text-white hover:bg-stone-700 transition-colors"
              >
                Unlock all rankings · $9/mo →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
