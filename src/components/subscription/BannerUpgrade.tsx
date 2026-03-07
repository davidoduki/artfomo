"use client";

import Link from "next/link";
import { useSubscription } from "@/hooks/useSubscription";
import { TIER_LABELS, TIER_PRICING } from "@/lib/subscription";
import type { FeatureKey } from "@/lib/types";

interface BannerUpgradeProps {
  /** How many items the user can currently see */
  shown: number;
  /** Actual total count */
  total: number;
  /** Feature that unlocks full access */
  feature: FeatureKey;
  /** E.g. "artists" or "watchlist slots" */
  label?: string;
}

export function BannerUpgrade({
  shown,
  total,
  feature,
  label = "results",
}: BannerUpgradeProps) {
  const { canAccess, requiredTier } = useSubscription();

  if (canAccess(feature) || shown >= total) return null;

  const tier = requiredTier(feature);
  const price = TIER_PRICING[tier].annual;

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-900">
      <span>
        Showing <strong>{shown}</strong> of <strong>{total}</strong> {label}.{" "}
        Upgrade to unlock all.
      </span>
      <Link
        href="/pricing"
        className="shrink-0 rounded-full border border-amber-400 bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900 hover:bg-amber-200 transition-colors"
      >
        {TIER_LABELS[tier]}{price > 0 ? ` · $${price}/mo` : ""} →
      </Link>
    </div>
  );
}
