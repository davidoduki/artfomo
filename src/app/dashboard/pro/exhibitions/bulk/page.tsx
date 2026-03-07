"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useSubscription } from "@/hooks/useSubscription";
import { redirect } from "next/navigation";

const CSV_TEMPLATE_HEADER = "artist_slug,title,show_type,institution_tier,venue,venue_city,venue_country,start_date,end_date,description";
const CSV_TEMPLATE_EXAMPLE = "jane-doe,Threshold Conditions,solo,gallery_tier1,White Cube,London,UK,2025-03-01,2025-04-15,A solo show exploring…";

const VALID_SHOW_TYPES = ["solo","group","art_fair","biennale","museum_show","online"];
const VALID_INSTITUTION_TIERS = ["museum_major","museum_regional","gallery_tier1","gallery_tier2","gallery_tier3","art_fair_mega","art_fair_major","art_fair_regional","independent","online"];

type ParsedRow = {
  artist_slug: string;
  title: string;
  show_type: string;
  institution_tier: string;
  venue: string;
  venue_city: string;
  venue_country: string;
  start_date: string;
  end_date: string;
  description: string;
};

type RowError = { row: number; message: string };

function parseCSV(text: string): { rows: ParsedRow[]; errors: RowError[] } {
  const lines = text.trim().split("\n");
  const errors: RowError[] = [];
  const rows: ParsedRow[] = [];

  if (lines.length === 0) return { rows, errors };

  // Skip header
  const dataLines = lines[0].startsWith("artist_slug") ? lines.slice(1) : lines;

  if (dataLines.length > 500) {
    errors.push({ row: 0, message: "Maximum 500 rows per upload." });
    return { rows, errors };
  }

  dataLines.forEach((line, i) => {
    if (!line.trim()) return;
    const parts = line.split(",").map((p) => p.trim());
    if (parts.length < 2) {
      errors.push({ row: i + 2, message: "Too few columns." });
      return;
    }
    const [artist_slug, title, show_type = "solo", institution_tier = "gallery_tier1", venue = "", venue_city = "", venue_country = "", start_date = "", end_date = "", ...descParts] = parts;
    const description = descParts.join(",");

    if (!artist_slug) { errors.push({ row: i + 2, message: "Missing artist_slug." }); return; }
    if (!title) { errors.push({ row: i + 2, message: "Missing title." }); return; }
    if (!VALID_SHOW_TYPES.includes(show_type)) { errors.push({ row: i + 2, message: `Invalid show_type: "${show_type}".` }); return; }
    if (!VALID_INSTITUTION_TIERS.includes(institution_tier)) { errors.push({ row: i + 2, message: `Invalid institution_tier: "${institution_tier}".` }); return; }

    rows.push({ artist_slug, title, show_type, institution_tier, venue, venue_city, venue_country, start_date, end_date, description });
  });

  return { rows, errors };
}

export default function BulkUploadPage() {
  const { canAccess } = useSubscription();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<{ rows: ParsedRow[]; errors: RowError[] } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [submitResult, setSubmitResult] = useState<{ inserted: number } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!canAccess("exhibition_bulk")) {
    redirect("/pricing");
  }

  const downloadTemplate = () => {
    const content = `${CSV_TEMPLATE_HEADER}\n${CSV_TEMPLATE_EXAMPLE}\n`;
    const blob = new Blob([content], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "artfomo-exhibitions-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setPreview(parseCSV(text));
      setSubmitResult(null);
      setSubmitError(null);
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (!preview || preview.errors.length > 0 || preview.rows.length === 0) return;

    startTransition(async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setSubmitError("Not authenticated."); return; }

      const insertData = preview.rows.map((r) => ({
        user_id: user.id,
        artist_slug: r.artist_slug,
        title: r.title,
        show_type: r.show_type,
        institution_tier: r.institution_tier,
        venue: r.venue || null,
        venue_city: r.venue_city || null,
        venue_country: r.venue_country || null,
        start_date: r.start_date || null,
        end_date: r.end_date || null,
        description: r.description || null,
        status: "pending",
      }));

      const { error } = await supabase.from("exhibition_uploads").insert(insertData);

      if (error) { setSubmitError(error.message); return; }
      setSubmitResult({ inserted: preview.rows.length });
    });
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Bulk Exhibition Upload</h1>
        <p className="mt-1 text-stone-500">Import historical exhibition data via CSV. Maximum 500 rows per upload.</p>
      </div>

      {/* Template download */}
      <div className="mb-6 rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="mb-2 text-base font-semibold text-stone-900">Step 1 — Download the template</h2>
        <p className="mb-4 text-sm text-stone-500">Fill in the template with your exhibition data, then upload below.</p>
        <button
          onClick={downloadTemplate}
          className="rounded-lg border border-stone-300 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
        >
          ↓ Download CSV Template
        </button>
        <div className="mt-4 rounded-lg bg-stone-50 px-4 py-3 font-mono text-xs text-stone-500 overflow-x-auto">
          {CSV_TEMPLATE_HEADER}
        </div>
      </div>

      {/* File upload */}
      <div className="mb-6 rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="mb-2 text-base font-semibold text-stone-900">Step 2 — Upload your CSV</h2>
        <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={handleFile} className="block w-full text-sm text-stone-700 file:mr-4 file:rounded-full file:border-0 file:bg-stone-900 file:px-4 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-stone-700" />
      </div>

      {/* Preview */}
      {preview && (
        <div className="mb-6 rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-stone-900">Step 3 — Review & Import</h2>

          {preview.errors.length > 0 && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="mb-2 text-sm font-semibold text-red-700">{preview.errors.length} error(s) found — fix before importing:</p>
              <ul className="space-y-1">
                {preview.errors.map((err, i) => (
                  <li key={i} className="text-sm text-red-600">Row {err.row}: {err.message}</li>
                ))}
              </ul>
            </div>
          )}

          {preview.errors.length === 0 && preview.rows.length > 0 && (
            <>
              <p className="mb-4 text-sm text-stone-600">
                <strong>{preview.rows.length}</strong> exhibitions ready to import.
              </p>
              <div className="mb-4 max-h-48 overflow-y-auto rounded-lg border border-stone-100 text-xs">
                {preview.rows.slice(0, 10).map((r, i) => (
                  <div key={i} className={`flex gap-4 px-3 py-2 ${i % 2 === 0 ? "" : "bg-stone-50"}`}>
                    <span className="w-32 truncate font-medium">{r.artist_slug}</span>
                    <span className="flex-1 truncate text-stone-500">{r.title}</span>
                    <span className="text-stone-400">{r.venue_city}</span>
                  </div>
                ))}
                {preview.rows.length > 10 && (
                  <div className="px-3 py-2 text-stone-400">…and {preview.rows.length - 10} more</div>
                )}
              </div>
              <button
                onClick={handleImport}
                disabled={isPending}
                className="rounded-lg bg-stone-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-stone-700 transition-colors disabled:opacity-50"
              >
                {isPending ? "Importing…" : `Import ${preview.rows.length} exhibitions`}
              </button>
            </>
          )}
        </div>
      )}

      {submitResult && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-900">
          <p className="font-semibold">Import complete!</p>
          <p>{submitResult.inserted} exhibitions submitted for review. You&apos;ll be notified when approved.</p>
          <button onClick={() => router.push("/dashboard/pro/exhibitions")} className="mt-3 text-green-700 underline hover:text-green-900">View all exhibitions →</button>
        </div>
      )}

      {submitError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{submitError}</div>
      )}
    </div>
  );
}
