"use client";

import Link from "next/link";
import { TIER_LABELS, TIER_PRICING } from "@/lib/subscription";
import type { FeatureKey, SubscriptionTier } from "@/lib/types";

interface FeatureCardProps {
  feature: FeatureKey;
  title: string;
  description: string;
  requiredTier: SubscriptionTier;
  /** Optional icon (emoji or component) */
  icon?: React.ReactNode;
}

export function FeatureCard({
  title,
  description,
  requiredTier,
  icon,
}: FeatureCardProps) {
  const price = TIER_PRICING[requiredTier].annual;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-stone-50 p-5">
      {icon && (
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-200 text-lg">
          {icon}
        </div>
      )}

      <div>
        <div className="mb-0.5 flex items-center gap-2">
          <span className="text-sm font-semibold text-stone-900">{title}</span>
          <span className="rounded-full border border-stone-300 bg-white px-2 py-0.5 text-xs text-stone-500">
            {TIER_LABELS[requiredTier]}
          </span>
        </div>
        <p className="text-sm text-stone-500">{description}</p>
      </div>

      <Link
        href="/pricing"
        className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-full bg-stone-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-stone-700 transition-colors"
      >
        Upgrade to {TIER_LABELS[requiredTier]}
        {price > 0 && <span className="opacity-70">· ${price}/mo</span>}
      </Link>

      <Link href="/pricing" className="text-xs text-stone-400 hover:text-stone-600 transition-colors">
        See all plans →
      </Link>
    </div>
  );
}
