import { getProfile } from "@/lib/auth";
import { getEffectiveTier, canAccessFeature } from "@/lib/subscription";
import { artists } from "@/data/artists";
import { ArtistsClient } from "./ArtistsClient";

const FREE_VISIBLE_COUNT = 25;

export default async function ArtistsDirectory() {
  // Profile is optional — public page, but tier affects what's visible
  let tier: "free" | "collector" | "advisor" | "pro" = "free";
  try {
    const profile = await getProfile();
    if (profile) tier = getEffectiveTier(profile);
  } catch {
    // Not logged in — treat as free
  }

  const hasFullAccess = canAccessFeature(tier, "full_ranking");
  const sortedArtists = [...artists].sort((a, b) => b.momentumScore - a.momentumScore);

  // Free users see top 25; the rest are shown as locked placeholders
  const visibleArtists = hasFullAccess
    ? sortedArtists
    : sortedArtists.slice(0, FREE_VISIBLE_COUNT);
  const lockedCount = hasFullAccess ? 0 : sortedArtists.length - FREE_VISIBLE_COUNT;

  return (
    <ArtistsClient
      visibleArtists={visibleArtists}
      totalCount={sortedArtists.length}
      lockedCount={lockedCount}
      hasFullAccess={hasFullAccess}
    />
  );
}
