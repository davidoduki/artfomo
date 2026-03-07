import type {
  SubscriptionTier,
  SubscriptionStatus,
  FeatureKey,
  SlotType,
  Profile,
} from "./types";

// ── Tier hierarchy ───────────────────────────────────────────
export const TIER_ORDER: Record<SubscriptionTier, number> = {
  free: 0,
  collector: 1,
  advisor: 2,
  pro: 3,
};

// ── Access matrix ────────────────────────────────────────────
// Each tier lists the features it unlocks (additive by intent — but
// explicitly listed per tier so a single source of truth is clear).
const TIER_FEATURES: Record<SubscriptionTier, FeatureKey[]> = {
  free: [
    "alerts_basic",
  ],
  collector: [
    "full_ranking",
    "heat_index_full",
    "compare_2",
    "watchlist_50",
    "alerts_basic",
    "alerts_full",
  ],
  advisor: [
    "full_ranking",
    "heat_index_full",
    "artist_analytics_full",
    "gallery_intelligence",
    "regional_heatmap",
    "compare_2",
    "compare_4",
    "compare_export",
    "watchlist_50",
    "watchlist_200",
    "alerts_basic",
    "alerts_full",
    "alerts_custom",
    "claim_artist_1",
    "claim_gallery_1",
    "exhibition_upload",
  ],
  pro: [
    "full_ranking",
    "heat_index_full",
    "artist_analytics_full",
    "gallery_intelligence",
    "regional_heatmap",
    "compare_2",
    "compare_4",
    "compare_export",
    "watchlist_50",
    "watchlist_200",
    "watchlist_unlimited",
    "alerts_basic",
    "alerts_full",
    "alerts_custom",
    "alerts_webhook",
    "claim_artist_1",
    "claim_artist_multi",
    "claim_gallery_1",
    "claim_gallery_multi",
    "exhibition_upload",
    "exhibition_bulk",
    "featured_slots",
    "api_access",
    "white_glove",
  ],
};

// ── Slot limits ──────────────────────────────────────────────
const SLOT_LIMITS: Record<SubscriptionTier, Record<SlotType, number>> = {
  free:      { watchlist: 5,    claimed_artists: 0,  claimed_galleries: 0, featured_slots: 0 },
  collector: { watchlist: 50,   claimed_artists: 0,  claimed_galleries: 0, featured_slots: 0 },
  advisor:   { watchlist: 200,  claimed_artists: 1,  claimed_galleries: 1, featured_slots: 1 },
  pro:       { watchlist: 9999, claimed_artists: 20, claimed_galleries: 5, featured_slots: 3 },
};

// ── Core helpers ─────────────────────────────────────────────

export function canAccessFeature(
  tier: SubscriptionTier,
  feature: FeatureKey
): boolean {
  return TIER_FEATURES[tier].includes(feature);
}

export function getSlotLimit(tier: SubscriptionTier, slotType: SlotType): number {
  return SLOT_LIMITS[tier][slotType];
}

export function isSubscriptionActive(profile: Profile): boolean {
  if (profile.subscription_tier === "free") return true;
  const status = profile.subscription_status as SubscriptionStatus | null;
  if (!status) return false;
  if (status === "trialing") {
    return profile.trial_ends_at
      ? new Date(profile.trial_ends_at) > new Date()
      : false;
  }
  return status === "active";
}

/** Returns the tier the user can actually use today.
 *  Lapsed/canceled subscriptions fall back to 'free'. */
export function getEffectiveTier(profile: Profile): SubscriptionTier {
  if (profile.subscription_tier === "free") return "free";
  return isSubscriptionActive(profile) ? profile.subscription_tier : "free";
}

/** Returns the LOWEST tier that includes a given feature (used by upgrade prompts). */
export function requiredTierForFeature(feature: FeatureKey): SubscriptionTier {
  const tiers: SubscriptionTier[] = ["free", "collector", "advisor", "pro"];
  return tiers.find((t) => TIER_FEATURES[t].includes(feature)) ?? "pro";
}

// ── Pricing (single source of truth for all UI) ──────────────

export const TIER_PRICING: Record<
  SubscriptionTier,
  { monthly: number; annual: number; annualTotal: number }
> = {
  free:      { monthly: 0,  annual: 0,  annualTotal: 0   },
  collector: { monthly: 12, annual: 9,  annualTotal: 108 },
  advisor:   { monthly: 33, annual: 25, annualTotal: 300 },
  pro:       { monthly: 60, annual: 45, annualTotal: 540 },
};

export const TIER_LABELS: Record<SubscriptionTier, string> = {
  free: "Free",
  collector: "Collector",
  advisor: "Advisor",
  pro: "Pro",
};

export const TIER_TAGLINES: Record<SubscriptionTier, string> = {
  free: "Get a feel for the market",
  collector: "Your data edge as a collector",
  advisor: "For advisors, consultants & galleries",
  pro: "Full-stack intelligence for institutions",
};

// Features shown on the pricing comparison table (in display order)
export const PRICING_FEATURE_LIST: {
  label: string;
  key: FeatureKey;
  description?: string;
}[] = [
  { label: "Global FOMO Score ranking",   key: "full_ranking",          description: "Top 25 on Free, all 10,000+ on paid" },
  { label: "Full Heat Index",             key: "heat_index_full" },
  { label: "Artist analytics",            key: "artist_analytics_full", description: "Rank history, price signals, exhibition timeline" },
  { label: "Gallery intelligence",        key: "gallery_intelligence" },
  { label: "Regional heat maps",          key: "regional_heatmap" },
  { label: "Compare artists",             key: "compare_2",             description: "2 artists on Collector, 4 on Advisor/Pro" },
  { label: "Export comparisons (PDF)",    key: "compare_export" },
  { label: "Watchlist",                   key: "watchlist_50",          description: "5 free · 50 Collector · 200 Advisor · unlimited Pro" },
  { label: "Email alerts",               key: "alerts_full" },
  { label: "Custom threshold alerts",    key: "alerts_custom" },
  { label: "Webhook alerts",             key: "alerts_webhook" },
  { label: "Claim artist/gallery profile", key: "claim_artist_1" },
  { label: "Exhibition uploads",         key: "exhibition_upload" },
  { label: "Bulk CSV upload",            key: "exhibition_bulk" },
  { label: "Featured exhibition slots",  key: "featured_slots",        description: "1/mo Advisor · 3/mo Pro" },
  { label: "API access",                 key: "api_access" },
  { label: "White glove services",       key: "white_glove" },
];
