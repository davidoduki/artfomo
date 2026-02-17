"use client";

import { useState } from "react";
import { artists } from "@/data/artists";

interface FlatDrop {
  artistName: string;
  artistSlug: string;
  title: string;
  date: string;
  price: string;
  soldOut: boolean;
}

export default function AdminDropsPage() {
  const allDrops: FlatDrop[] = artists.flatMap((artist) =>
    artist.recentDrops.map((drop) => ({
      artistName: artist.name,
      artistSlug: artist.slug,
      title: drop.title,
      date: drop.date,
      price: drop.price,
      soldOut: drop.soldOut,
    }))
  );

  const [filter, setFilter] = useState<"all" | "available" | "sold_out">("all");
  const [search, setSearch] = useState("");

  const filtered = allDrops
    .filter((d) => {
      if (filter === "available") return !d.soldOut;
      if (filter === "sold_out") return d.soldOut;
      return true;
    })
    .filter(
      (d) =>
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        d.artistName.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const soldOutCount = allDrops.filter((d) => d.soldOut).length;
  const availableCount = allDrops.filter((d) => !d.soldOut).length;

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Manage Drops</h1>
          <p className="mt-1 text-stone-500">
            {allDrops.length} total drops &middot; {soldOutCount} sold out &middot;{" "}
            {availableCount} available
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Drop
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="Search drops or artists..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
        />
        <div className="flex gap-2">
          {(["all", "available", "sold_out"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                filter === f
                  ? "bg-stone-900 text-white"
                  : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
              }`}
            >
              {f === "all" ? "All" : f === "available" ? "Available" : "Sold Out"}
            </button>
          ))}
        </div>
      </div>

      {/* Drops table */}
      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-left">
                <th className="px-6 py-3 font-semibold text-stone-500">Drop Title</th>
                <th className="px-6 py-3 font-semibold text-stone-500">Artist</th>
                <th className="px-6 py-3 font-semibold text-stone-500">Date</th>
                <th className="px-6 py-3 font-semibold text-stone-500">Price</th>
                <th className="px-6 py-3 font-semibold text-stone-500">Status</th>
                <th className="px-6 py-3 font-semibold text-stone-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((drop, i) => (
                <tr
                  key={`${drop.artistSlug}-${drop.title}-${i}`}
                  className="border-b border-stone-100 last:border-0 hover:bg-stone-50"
                >
                  <td className="px-6 py-4 font-medium text-stone-900">
                    {drop.title}
                  </td>
                  <td className="px-6 py-4 text-stone-500">{drop.artistName}</td>
                  <td className="px-6 py-4 text-stone-500">{drop.date}</td>
                  <td className="px-6 py-4 font-medium text-stone-700">
                    {drop.price}
                  </td>
                  <td className="px-6 py-4">
                    {drop.soldOut ? (
                      <span className="inline-flex rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700">
                        Sold Out
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                        Available
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-600 transition hover:bg-stone-50">
                        Edit
                      </button>
                      {!drop.soldOut && (
                        <button className="rounded-lg border border-amber-200 px-3 py-1.5 text-xs font-medium text-amber-700 transition hover:bg-amber-50">
                          Mark Sold
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-stone-400">
            No drops match your filters.
          </div>
        )}
      </div>
    </div>
  );
}
