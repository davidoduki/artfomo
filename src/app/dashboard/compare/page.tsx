"use client";

import { useState } from "react";
import Link from "next/link";
import { artists, getMomentumColor, getMomentumIcon } from "@/data/artists";
import { useSubscription } from "@/hooks/useSubscription";
import { FeatureCard } from "@/components/subscription/FeatureCard";
import { TIER_LABELS } from "@/lib/subscription";

export default function ComparePage() {
  const { canAccess, requiredTier } = useSubscription();
  const [selected, setSelected] = useState<string[]>([]);

  const canCompare = canAccess("compare_2");
  const canCompare4 = canAccess("compare_4");
  const maxSelectable = canCompare4 ? 4 : canCompare ? 2 : 0;

  const toggleArtist = (slug: string) => {
    setSelected((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= maxSelectable) return prev;
      return [...prev, slug];
    });
  };

  const selectedArtists = selected
    .map((slug) => artists.find((a) => a.slug === slug))
    .filter(Boolean) as typeof artists;

  if (!canCompare) {
    const tier = requiredTier("compare_2");
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-stone-900">Compare Artists</h1>
          <p className="mt-1 text-stone-500">Compare momentum, scores, and market signals side by side.</p>
        </div>
        <div className="max-w-sm">
          <FeatureCard
            feature="compare_2"
            title="Artist Compare Tool"
            description="Compare up to 2 artists side by side. Upgrade to Advisor for 4-artist comparisons with PDF export."
            requiredTier={tier}
            icon="⚖️"
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Compare Artists</h1>
        <p className="mt-1 text-stone-500">
          Select up to {maxSelectable} artists to compare.
          {!canCompare4 && (
            <Link href="/pricing" className="ml-1 text-stone-400 hover:text-stone-600">
              Upgrade to {TIER_LABELS[requiredTier("compare_4")]} for 4-artist comparisons →
            </Link>
          )}
        </p>
      </div>

      {/* Comparison view */}
      {selectedArtists.length >= 2 && (
        <div className="mb-8 overflow-x-auto rounded-2xl border border-stone-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100">
                <th className="px-6 py-4 text-left font-medium text-stone-500">Metric</th>
                {selectedArtists.map((a) => (
                  <th key={a.slug} className="px-6 py-4 text-center font-semibold text-stone-900">
                    {a.name}
                    <button
                      onClick={() => toggleArtist(a.slug)}
                      className="ml-2 text-xs text-stone-300 hover:text-red-600"
                    >
                      ✕
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: "FOMO Score",   render: (a: typeof artists[0]) => <strong>{a.momentumScore}</strong> },
                { label: "Momentum",     render: (a: typeof artists[0]) => (
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase ${getMomentumColor(a.momentum)}`}>
                    {getMomentumIcon(a.momentum)} {a.momentum}
                  </span>
                )},
                { label: "Medium",       render: (a: typeof artists[0]) => a.medium },
                { label: "Location",     render: (a: typeof artists[0]) => a.location },
                { label: "Price Range",  render: (a: typeof artists[0]) => a.priceRange },
                { label: "Galleries",    render: (a: typeof artists[0]) => a.galleries.join(", ") || "—" },
              ].map(({ label, render }, i) => (
                <tr key={label} className={i % 2 === 0 ? "" : "bg-stone-50/50"}>
                  <td className="px-6 py-3 font-medium text-stone-600">{label}</td>
                  {selectedArtists.map((a) => (
                    <td key={a.slug} className="px-6 py-3 text-center text-stone-700">
                      {render(a)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedArtists.length < 2 && (
        <div className="mb-6 rounded-xl border border-dashed border-stone-300 bg-stone-50 p-6 text-center text-sm text-stone-400">
          Select {2 - selectedArtists.length} more artist{selectedArtists.length === 1 ? "" : "s"} below to start comparing.
        </div>
      )}

      {/* Artist selector */}
      <h2 className="mb-4 text-lg font-semibold text-stone-900">
        Select artists ({selected.length}/{maxSelectable})
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {artists.map((artist) => {
          const isSelected = selected.includes(artist.slug);
          const isDisabled = !isSelected && selected.length >= maxSelectable;
          return (
            <button
              key={artist.slug}
              onClick={() => toggleArtist(artist.slug)}
              disabled={isDisabled}
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                isSelected
                  ? "border-stone-900 bg-stone-900 text-white"
                  : isDisabled
                  ? "cursor-not-allowed border-stone-200 opacity-40"
                  : "border-stone-200 bg-white hover:border-stone-400"
              }`}
            >
              <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg">
                <img src={artist.image} alt={artist.name} className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-semibold ${isSelected ? "text-white" : "text-stone-900"}`}>{artist.name}</p>
                <p className={`text-xs ${isSelected ? "text-stone-300" : "text-stone-400"}`}>{artist.medium} · {artist.momentumScore}</p>
              </div>
              {isSelected && (
                <svg className="h-4 w-4 flex-shrink-0 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
