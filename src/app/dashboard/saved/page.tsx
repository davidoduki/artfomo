import { createClient } from "@/lib/supabase/server";
import { artists, getMomentumColor, getMomentumIcon } from "@/data/artists";
import { SavedClient } from "./SavedClient";

export default async function SavedArtistsPage() {
  const supabase = await createClient();

  const { data: savedRows } = await supabase
    .from("saved_artists")
    .select("artist_slug")
    .order("created_at", { ascending: false });

  const savedSlugs = (savedRows ?? []).map((r) => r.artist_slug as string);
  const savedArtists = savedSlugs
    .map((slug) => artists.find((a) => a.slug === slug))
    .filter(Boolean) as typeof artists;

  return (
    <SavedClient
      initialSavedSlugs={savedSlugs}
      savedArtists={savedArtists}
      allArtists={artists}
      getMomentumColor={getMomentumColor}
      getMomentumIcon={getMomentumIcon}
    />
  );
}
