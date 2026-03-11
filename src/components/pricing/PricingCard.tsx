"use client";

import { useState } from "react";
import Link from "next/link";
import { TIER_LABELS, TIER_TAGLINES, TIER_PRICING, canAccessFeature, PRICING_FEATURE_LIST } from "@/lib/subscription";
import type { SubscriptionTier } from "@/lib/types";

interface PricingCardProps {
  tier: SubscriptionTier;
  isAnnual: boolean;
  highlighted?: boolean;
  currentTier?: SubscriptionTier;
}

export function PricingCard({
  tier,
  isAnnual,
  highlighted = false,
  currentTier,
}: PricingCardProps) {
  const [loading, setLoading] = useState(false);

  const price = isAnnual
    ? TIER_PRICING[tier].annual
    : TIER_PRICING[tier].monthly;
  const isCurrentTier = currentTier === tier;
  const isFree = tier === "free";

  // CTA label
  let ctaLabel = `Get ${TIER_LABELS[tier]}`;
  if (isCurrentTier) ctaLabel = "Current plan";
  else if (isFree) ctaLabel = "Get started free";
  if (loading) ctaLabel = "Redirecting…";

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, interval: isAnnual ? "annual" : "monthly" }),
      });
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        alert(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  };

  const ctaClass = `mb-6 w-full rounded-xl py-2.5 text-center text-sm font-medium transition-colors ${
    isCurrentTier
      ? highlighted
        ? "bg-white/20 text-white cursor-default"
        : "border border-stone-200 bg-stone-50 text-stone-500 cursor-default"
      : highlighted
      ? "bg-white text-stone-900 hover:bg-stone-100 disabled:opacity-60"
      : "bg-stone-900 text-white hover:bg-stone-700 disabled:opacity-60"
  }`;

  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-6 ${
        highlighted
          ? "border-stone-900 bg-stone-900 text-white shadow-xl"
          : "border-stone-200 bg-white"
      }`}
    >
      {highlighted && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-red-700 px-3 py-1 text-xs font-semibold text-white shadow">
            Most Popular for Galleries
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="mb-1 text-sm font-semibold uppercase tracking-wide opacity-60">
          {TIER_LABELS[tier]}
        </div>
        <div className="mb-2 flex items-end gap-1">
          {price === 0 ? (
            <span className="text-4xl font-bold">Free</span>
          ) : (
            <>
              <span className="text-4xl font-bold">${price}</span>
              <span className="mb-1 opacity-60">/mo</span>
            </>
          )}
        </div>
        {isAnnual && price > 0 && (
          <div className="text-xs opacity-50">
            billed annually (${TIER_PRICING[tier].annualTotal}/yr)
          </div>
        )}
        <p className={`mt-2 text-sm ${highlighted ? "opacity-70" : "text-stone-500"}`}>
          {TIER_TAGLINES[tier]}
        </p>
      </div>

      {/* CTA */}
      {isCurrentTier ? (
        <Link href="/dashboard" className={ctaClass}>{ctaLabel}</Link>
      ) : isFree ? (
        <Link href="/login" className={ctaClass}>{ctaLabel}</Link>
      ) : (
        <button onClick={handleCheckout} disabled={loading} className={ctaClass}>
          {ctaLabel}
        </button>
      )}

      {/* Feature list */}
      <ul className="flex flex-col gap-2">
        {PRICING_FEATURE_LIST.map(({ label, key }) => {
          const included = canAccessFeature(tier, key);
          return (
            <li
              key={key}
              className={`flex items-center gap-2 text-sm ${
                included
                  ? highlighted
                    ? "text-white"
                    : "text-stone-700"
                  : highlighted
                  ? "opacity-30"
                  : "text-stone-300"
              }`}
            >
              {included ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                  <circle cx="7" cy="7" r="7" fill={highlighted ? "rgba(255,255,255,0.2)" : "#e7e5e4"} />
                  <path d="M4 7l2 2 4-4" stroke={highlighted ? "white" : "#78716c"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                  <circle cx="7" cy="7" r="7" fill="transparent" stroke={highlighted ? "rgba(255,255,255,0.15)" : "#e7e5e4"} strokeWidth="1" />
                  <path d="M5 5l4 4M9 5l-4 4" stroke={highlighted ? "rgba(255,255,255,0.3)" : "#d6d3d1"} strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              )}
              {label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
