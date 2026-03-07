"use client";

import { useEffect } from "react";
import Link from "next/link";
import { TIER_LABELS, TIER_PRICING, TIER_TAGLINES } from "@/lib/subscription";
import type { FeatureKey, SubscriptionTier } from "@/lib/types";

interface UpgradeModalProps {
  feature: FeatureKey;
  featureLabel: string;
  requiredTier: SubscriptionTier;
  onClose: () => void;
}

export function UpgradeModal({
  featureLabel,
  requiredTier,
  onClose,
}: UpgradeModalProps) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const price = TIER_PRICING[requiredTier].annual;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-stone-200 bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="text-lg">🔒</span>
              <span className="text-xs font-medium uppercase tracking-wide text-stone-400">
                {TIER_LABELS[requiredTier]} feature
              </span>
            </div>
            <h2 className="text-base font-semibold text-stone-900">
              {featureLabel}
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              {TIER_TAGLINES[requiredTier]}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Price */}
        {price > 0 && (
          <div className="mb-4 rounded-xl border border-stone-100 bg-stone-50 px-4 py-3">
            <span className="text-2xl font-bold text-stone-900">${price}</span>
            <span className="text-sm text-stone-500"> /mo · billed annually</span>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col gap-2">
          <Link
            href="/pricing"
            className="w-full rounded-xl bg-stone-900 py-2.5 text-center text-sm font-medium text-white hover:bg-stone-700 transition-colors"
          >
            Upgrade to {TIER_LABELS[requiredTier]}
          </Link>
          <Link
            href="/pricing"
            className="w-full rounded-xl border border-stone-200 py-2.5 text-center text-sm text-stone-600 hover:bg-stone-50 transition-colors"
          >
            See all plans
          </Link>
        </div>
      </div>
    </div>
  );
}
