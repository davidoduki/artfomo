"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useSubscription } from "@/hooks/useSubscription";
import { artists } from "@/data/artists";

const SHOW_TYPES = [
  { value: "solo",        label: "Solo Show" },
  { value: "group",       label: "Group Exhibition" },
  { value: "art_fair",    label: "Art Fair" },
  { value: "biennale",    label: "Biennale" },
  { value: "museum_show", label: "Museum Show" },
  { value: "online",      label: "Online Exhibition" },
];

const INSTITUTION_TIERS = [
  { value: "museum_major",       label: "Museum (Major)" },
  { value: "museum_regional",    label: "Museum (Regional)" },
  { value: "gallery_tier1",      label: "Tier 1 Gallery" },
  { value: "gallery_tier2",      label: "Tier 2 Gallery" },
  { value: "gallery_tier3",      label: "Tier 3 Gallery" },
  { value: "art_fair_mega",      label: "Art Fair (Mega)" },
  { value: "art_fair_major",     label: "Art Fair (Major)" },
  { value: "art_fair_regional",  label: "Art Fair (Regional)" },
  { value: "independent",        label: "Independent Space" },
  { value: "online",             label: "Online Platform" },
];

export default function NewExhibitionPage() {
  const { canAccess } = useSubscription();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    artist_slug: "",
    title: "",
    show_type: "solo",
    institution_tier: "gallery_tier1",
    venue: "",
    venue_city: "",
    venue_country: "",
    start_date: "",
    end_date: "",
    description: "",
  });

  if (!canAccess("exhibition_upload")) {
    redirect("/pricing");
  }

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.artist_slug || !form.title) {
      setError("Artist and exhibition title are required.");
      return;
    }

    startTransition(async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setError("Not authenticated."); return; }

      const { error: insertError } = await supabase
        .from("exhibition_uploads")
        .insert({
          user_id: user.id,
          artist_slug: form.artist_slug,
          title: form.title,
          show_type: form.show_type,
          institution_tier: form.institution_tier,
          venue: form.venue || null,
          venue_city: form.venue_city || null,
          venue_country: form.venue_country || null,
          start_date: form.start_date || null,
          end_date: form.end_date || null,
          description: form.description || null,
          status: "pending",
        });

      if (insertError) {
        setError(insertError.message);
        return;
      }

      router.push("/dashboard/pro/exhibitions");
    });
  };

  const inputClass = "mt-1 w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900";
  const labelClass = "block text-sm font-medium text-stone-700";

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Add Exhibition</h1>
        <p className="mt-1 text-stone-500">
          Upload an exhibition to an artist&apos;s profile. Reviewed by ArtFOMO within 24h.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-stone-200 bg-white p-6 space-y-4">
          <h2 className="text-base font-semibold text-stone-900">Exhibition Details</h2>

          <div>
            <label className={labelClass}>Artist *</label>
            <select value={form.artist_slug} onChange={set("artist_slug")} required className={inputClass}>
              <option value="">Select an artist…</option>
              {artists.map((a) => <option key={a.slug} value={a.slug}>{a.name}</option>)}
            </select>
          </div>

          <div>
            <label className={labelClass}>Exhibition Title *</label>
            <input type="text" value={form.title} onChange={set("title")} required placeholder="e.g. Threshold Conditions" className={inputClass} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Exhibition Type</label>
              <select value={form.show_type} onChange={set("show_type")} className={inputClass}>
                {SHOW_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Institution Tier</label>
              <select value={form.institution_tier} onChange={set("institution_tier")} className={inputClass}>
                {INSTITUTION_TIERS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-6 space-y-4">
          <h2 className="text-base font-semibold text-stone-900">Venue</h2>

          <div>
            <label className={labelClass}>Venue Name</label>
            <input type="text" value={form.venue} onChange={set("venue")} placeholder="Gallery / Museum / Fair name" className={inputClass} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>City</label>
              <input type="text" value={form.venue_city} onChange={set("venue_city")} placeholder="New York" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Country</label>
              <input type="text" value={form.venue_country} onChange={set("venue_country")} placeholder="USA" className={inputClass} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Start Date</label>
              <input type="date" value={form.start_date} onChange={set("start_date")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>End Date</label>
              <input type="date" value={form.end_date} onChange={set("end_date")} className={inputClass} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-stone-900">Description (optional)</h2>
          <textarea
            value={form.description}
            onChange={set("description")}
            rows={4}
            placeholder="Brief description of the exhibition…"
            className={`${inputClass} resize-none`}
          />
        </div>

        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-stone-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-stone-700 transition-colors disabled:opacity-50"
          >
            {isPending ? "Submitting…" : "Submit Exhibition"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-stone-300 px-6 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
          >
            Cancel
          </button>
        </div>

        <p className="text-xs text-stone-400">
          Submissions are reviewed by the ArtFOMO team within 24h. Approved exhibitions are immediately added to the artist&apos;s profile timeline.
        </p>
      </form>
    </div>
  );
}
