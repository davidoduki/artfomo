import { redirect } from "next/navigation";
import Link from "next/link";
import { getProfile } from "@/lib/auth";
import { getEffectiveTier, canAccessFeature } from "@/lib/subscription";
import { createClient } from "@/lib/supabase/server";

export default async function ExhibitionsPage() {
  const profile = await getProfile();
  const tier = profile ? getEffectiveTier(profile) : "free";

  if (!canAccessFeature(tier, "exhibition_upload")) {
    redirect("/pricing");
  }

  const supabase = await createClient();
  const { data: exhibitions } = await supabase
    .from("exhibition_uploads")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Exhibitions</h1>
          <p className="mt-1 text-stone-500">Manage and upload exhibition data for your artists.</p>
        </div>
        <div className="flex gap-3">
          {canAccessFeature(tier, "exhibition_bulk") && (
            <Link
              href="/dashboard/pro/exhibitions/bulk"
              className="rounded-lg border border-stone-300 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
            >
              Bulk CSV Upload
            </Link>
          )}
          <Link
            href="/dashboard/pro/exhibitions/new"
            className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 transition-colors"
          >
            + Add Exhibition
          </Link>
        </div>
      </div>

      {!exhibitions || exhibitions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-12 text-center">
          <p className="text-stone-500">No exhibitions uploaded yet.</p>
          <Link
            href="/dashboard/pro/exhibitions/new"
            className="mt-3 inline-block text-sm font-medium text-red-700 hover:underline"
          >
            Upload your first exhibition →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {exhibitions.map((ex) => (
            <div key={ex.id} className="flex items-center justify-between rounded-xl border border-stone-200 bg-white px-6 py-4">
              <div>
                <p className="font-semibold text-stone-900">{ex.title}</p>
                <p className="text-sm text-stone-400">
                  {ex.artist_slug} · {ex.venue_city ?? "—"}
                  {ex.start_date && ` · ${new Date(ex.start_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  ex.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : ex.status === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {ex.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
