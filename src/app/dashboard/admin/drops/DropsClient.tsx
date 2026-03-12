"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Drop } from "@/lib/types";

export default function DropsClient() {
  const router = useRouter();
  const [drops, setDrops] = useState<Drop[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "available" | "sold_out">("all");
  const [search, setSearch] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  const loadDrops = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/drops");
    if (res.ok) {
      const data = await res.json();
      setDrops(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadDrops();
  }, [loadDrops]);

  const handleMarkSold = async (id: string) => {
    const res = await fetch(`/api/admin/drops/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sold_out: true }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setActionError(data.error ?? "Failed to mark as sold.");
      return;
    }
    setActionError(null);
    await loadDrops();
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/drops/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setActionError(data.error ?? "Failed to delete drop.");
      return;
    }
    setActionError(null);
    await loadDrops();
  };

  const filtered = drops
    .filter((d) => {
      if (filter === "available") return !d.sold_out;
      if (filter === "sold_out") return d.sold_out;
      return true;
    })
    .filter(
      (d) =>
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        (d.artist_name ?? d.artist_slug).toLowerCase().includes(search.toLowerCase())
    );

  const soldOutCount = drops.filter((d) => d.sold_out).length;
  const availableCount = drops.filter((d) => !d.sold_out).length;

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Manage Drops</h1>
          <p className="mt-1 text-stone-500">
            {drops.length} total drops &middot; {soldOutCount} sold out &middot;{" "}
            {availableCount} available
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard/admin/drops/new")}
          className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
        >
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

      {/* Action error */}
      {actionError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      )}

      {/* Drops table */}
      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
        {loading ? (
          <div className="py-12 text-center text-stone-400 text-sm">Loading…</div>
        ) : (
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
                {filtered.map((drop) => (
                  <tr
                    key={drop.id}
                    className="border-b border-stone-100 last:border-0 hover:bg-stone-50"
                  >
                    <td className="px-6 py-4 font-medium text-stone-900">{drop.title}</td>
                    <td className="px-6 py-4 text-stone-500">
                      {drop.artist_name ?? drop.artist_slug}
                    </td>
                    <td className="px-6 py-4 text-stone-500">{drop.date}</td>
                    <td className="px-6 py-4 font-medium text-stone-700">{drop.price}</td>
                    <td className="px-6 py-4">
                      {drop.sold_out ? (
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
                        <button
                          onClick={() => router.push(`/dashboard/admin/drops/${drop.id}/edit`)}
                          className="rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-600 transition hover:bg-stone-50"
                        >
                          Edit
                        </button>
                        {!drop.sold_out && (
                          <button
                            onClick={() => handleMarkSold(drop.id)}
                            className="rounded-lg border border-amber-200 px-3 py-1.5 text-xs font-medium text-amber-700 transition hover:bg-amber-50"
                          >
                            Mark Sold
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(drop.id, drop.title)}
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="py-12 text-center text-stone-400">
            {drops.length === 0 ? "No drops yet. Click \"New Drop\" to add one." : "No drops match your filters."}
          </div>
        )}
      </div>
    </div>
  );
}
