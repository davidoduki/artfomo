export type UserRole = "admin" | "editor" | "user";

// ── Subscription ────────────────────────────────────────────
export type SubscriptionTier = "free" | "collector" | "advisor" | "pro";
export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "incomplete"
  | "paused";
export type BillingInterval = "monthly" | "annual";

// Every feature that can be gated behind a tier
export type FeatureKey =
  | "full_ranking"           // See beyond top 25 artists
  | "heat_index_full"        // Full Heat Index data
  | "artist_analytics_full"  // Full analytics (all-time history, price data)
  | "gallery_intelligence"   // Gallery scores + breakout alumni
  | "regional_heatmap"       // Interactive world map
  | "compare_2"              // Compare 2 artists (Collector+)
  | "compare_4"              // Compare 4 artists (Advisor+)
  | "compare_export"         // Export comparison as PDF
  | "watchlist_50"           // Up to 50 watchlist items
  | "watchlist_200"          // Up to 200 watchlist items
  | "watchlist_unlimited"    // Unlimited watchlist (Pro)
  | "alerts_basic"           // Score spike + new exhibition alerts
  | "alerts_full"            // Full alert suite (price move, gallery change, fair debut)
  | "alerts_custom"          // Custom threshold alerts
  | "alerts_webhook"         // Webhook delivery
  | "claim_artist_1"         // Claim 1 artist profile
  | "claim_artist_multi"     // Claim up to 20 artist profiles
  | "claim_gallery_1"        // Claim 1 gallery profile
  | "claim_gallery_multi"    // Claim up to 5 gallery profiles
  | "exhibition_upload"      // Manual exhibition upload
  | "exhibition_bulk"        // CSV bulk upload
  | "featured_slots"         // Featured exhibition slots
  | "api_access"             // ArtFOMO data API
  | "white_glove";           // White glove concierge services

export type SlotType =
  | "watchlist"
  | "claimed_artists"
  | "claimed_galleries"
  | "featured_slots";

// ── Profile ─────────────────────────────────────────────────
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  // Subscription
  subscription_tier: SubscriptionTier;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: SubscriptionStatus | null;
  subscription_period_end: string | null;
  billing_interval: BillingInterval | null;
  trial_ends_at: string | null;
  created_at: string;
  updated_at: string;
}

// ── Content ──────────────────────────────────────────────────
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  author_id: string;
  author_name?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Drop {
  id: string;
  title: string;
  artist_slug: string;
  artist_name?: string;
  price: string;
  date: string;
  sold_out: boolean;
  image: string | null;
  description: string | null;
  created_at: string;
}

export interface WatchlistItem {
  id: string;
  user_id: string;
  artist_slug: string;
  created_at: string;
}

export interface SavedArtist {
  id: string;
  user_id: string;
  artist_slug: string;
  created_at: string;
}
