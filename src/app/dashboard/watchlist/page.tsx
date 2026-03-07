import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";
import { getEffectiveTier, getSlotLimit } from "@/lib/subscription";
import { artists } from "@/data/artists";
import { WatchlistClient } from "./WatchlistClient";

export default async function WatchlistPage() {
  const supabase = await createClient();
  const profile = await getProfile();
  const tier = profile ? getEffectiveTier(profile) : "free";
  const limit = getSlotLimit(tier, "watchlist");

  // Fetch real watchlist from Supabase
  const { data: watchlistRows } = await supabase
    .from("watchlist")
    .select("artist_slug")
    .order("created_at", { ascending: false });

  const watchedSlugs = (watchlistRows ?? []).map((r) => r.artist_slug as string);
  const watchedArtists = watchedSlugs
    .map((slug) => artists.find((a) => a.slug === slug))
    .filter(Boolean);

  const availableArtists = artists.filter((a) => !watchedSlugs.includes(a.slug));

  return (
    <WatchlistClient
      initialWatchedSlugs={watchedSlugs}
      watchedArtists={watchedArtists as typeof artists}
      availableArtists={availableArtists}
      tier={tier}
      limit={limit}
    />
  );
}
