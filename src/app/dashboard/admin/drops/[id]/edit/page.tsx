"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

export default function EditDropPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [title, setTitle] = useState("");
  const [artistSlug, setArtistSlug] = useState("");
  const [artistName, setArtistName] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [soldOut, setSoldOut] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/drops/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title ?? "");
        setArtistSlug(data.artist_slug ?? "");
        setArtistName(data.artist_name ?? "");
        setPrice(data.price ?? "");
        setDate(data.date ?? "");
        setDescription(data.description ?? "");
        setImage(data.image ?? "");
        setSoldOut(data.sold_out ?? false);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load drop.");
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const res = await fetch(`/api/admin/drops/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        artist_slug: artistSlug,
        artist_name: artistName || null,
        price,
        date,
        description: description || null,
        image: image || null,
        sold_out: soldOut,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to save drop.");
      setSaving(false);
      return;
    }

    router.push("/dashboard/admin/drops");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-stone-400 text-sm">
        Loading…
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link
          href="/dashboard/admin/drops"
          className="text-sm text-stone-500 hover:text-stone-900 transition"
        >
          &larr; Back to Drops
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-stone-900">Edit Drop</h1>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-stone-200 bg-white p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Drop title"
              required
              className="mt-1 w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700">
                Artist Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={artistSlug}
                onChange={(e) => setArtistSlug(e.target.value)}
                placeholder="artist-name"
                required
                className="mt-1 w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-mono text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700">
                Artist Name
              </label>
              <input
                type="text"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                placeholder="Display name"
                className="mt-1 w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="$1,200"
                required
                className="mt-1 w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm text-stone-900 outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700">
              Image URL
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
              className="mt-1 w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the drop..."
              rows={3}
              className="mt-1 w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 resize-none"
            />
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={soldOut}
              onChange={(e) => setSoldOut(e.target.checked)}
              className="h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900"
            />
            <span className="text-sm text-stone-700">Mark as Sold Out</span>
          </label>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-stone-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
          <Link
            href="/dashboard/admin/drops"
            className="rounded-lg border border-stone-200 px-6 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
