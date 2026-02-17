"use client";

import { useState } from "react";
import Link from "next/link";
import { artists as allArtists, getMomentumColor, getMomentumIcon } from "@/data/artists";
import type { Artist } from "@/data/artists";

export default function AdminArtistsPage() {
  const [search, setSearch] = useState("");
  const [artistList] = useState<Artist[]>(allArtists);

  const filtered = artistList.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.medium.toLowerCase().includes(search.toLowerCase()) ||
      a.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Manage Artists</h1>
          <p className="mt-1 text-stone-500">
            {artistList.length} artists in the directory.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Artist
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search artists..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
        />
      </div>

      {/* Artists table */}
      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-left">
                <th className="px-6 py-3 font-semibold text-stone-500">Artist</th>
                <th className="px-6 py-3 font-semibold text-stone-500">Medium</th>
                <th className="px-6 py-3 font-semibold text-stone-500">Location</th>
                <th className="px-6 py-3 font-semibold text-stone-500">Momentum</th>
                <th className="px-6 py-3 font-semibold text-stone-500">Price Range</th>
                <th className="px-6 py-3 font-semibold text-stone-500">Drops</th>
                <th className="px-6 py-3 font-semibold text-stone-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((artist) => (
                <tr
                  key={artist.slug}
                  className="border-b border-stone-100 last:border-0 hover:bg-stone-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-lg">
                        <img
                          src={artist.image}
                          alt={artist.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <Link
                        href={`/artists/${artist.slug}`}
                        className="font-medium text-stone-900 hover:text-red-700 transition"
                      >
                        {artist.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-stone-500">{artist.medium}</td>
                  <td className="px-6 py-4 text-stone-500">{artist.location}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase ${getMomentumColor(artist.momentum)}`}
                    >
                      {getMomentumIcon(artist.momentum)} {artist.momentumScore}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-stone-500">{artist.priceRange}</td>
                  <td className="px-6 py-4 text-stone-500">
                    {artist.recentDrops.length}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-600 transition hover:bg-stone-50">
                        Edit
                      </button>
                      <button className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-stone-400">
            No artists match your search.
          </div>
        )}
      </div>
    </div>
  );
}
