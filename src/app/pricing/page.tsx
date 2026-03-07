"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { BillingToggle } from "@/components/pricing/BillingToggle";
import { PricingCard } from "@/components/pricing/PricingCard";
import { TIER_PRICING, PRICING_FEATURE_LIST, canAccessFeature, TIER_LABELS } from "@/lib/subscription";
import type { SubscriptionTier } from "@/lib/types";

const TIERS: SubscriptionTier[] = ["free", "collector", "advisor", "pro"];

const FAQ = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. You can cancel your subscription at any time from your account settings. You'll keep access until the end of your billing period.",
  },
  {
    q: "What happens when my trial ends?",
    a: "If you don't add a payment method, your account automatically drops to the Free tier. Your watchlist and data are preserved.",
  },
  {
    q: "Can I switch plans?",
    a: "Yes, upgrade or downgrade any time. Upgrades take effect immediately; downgrades take effect at the end of your billing period.",
  },
  {
    q: "What does 'billed annually' mean?",
    a: "You pay for 12 months upfront at the discounted annual rate. Monthly billing is available at a 25% premium.",
  },
  {
    q: "What's included in white glove services?",
    a: "Pro tier includes a 60-min onboarding call, historical data import (up to 5 years, 10 artists), a monthly 1:1 intelligence briefing, press distribution, and full API access.",
  },
  {
    q: "Where does ArtFOMO data come from?",
    a: "ArtFOMO aggregates data from exhibition listings, gallery rosters, auction records, and press coverage to calculate FOMO Scores. Data is updated weekly.",
  },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 pt-28 pb-16">
        {/* Hero */}
        <div className="mb-12 text-center">
          <h1 className="mb-3 font-serif text-4xl font-bold text-stone-900">
            Simple, transparent pricing
          </h1>
          <p className="mb-8 text-lg text-stone-500">
            From casual browser to institutional intelligence. No surprises.
          </p>
          <div className="flex justify-center">
            <BillingToggle isAnnual={isAnnual} onChange={setIsAnnual} />
          </div>
        </div>

        {/* Pricing cards */}
        <div className="mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TIERS.map((tier) => (
            <PricingCard
              key={tier}
              tier={tier}
              isAnnual={isAnnual}
              highlighted={tier === "pro"}
            />
          ))}
        </div>

        {/* Trial callout */}
        <div className="mb-16 rounded-2xl border border-blue-200 bg-blue-50 px-8 py-6 text-center">
          <p className="mb-1 text-base font-semibold text-blue-900">
            Try Collector free for 14 days
          </p>
          <p className="mb-4 text-sm text-blue-700">
            No credit card required. Full access to rankings, Heat Index, and watchlist for 2 weeks.
          </p>
          <Link
            href="/login?trial=collector"
            className="inline-flex rounded-full bg-blue-700 px-6 py-2 text-sm font-medium text-white hover:bg-blue-800 transition-colors"
          >
            Start free trial →
          </Link>
        </div>

        {/* Feature comparison table */}
        <div className="mb-16">
          <h2 className="mb-6 text-center font-serif text-2xl font-bold text-stone-900">
            Full feature comparison
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100">
                  <th className="py-4 pl-6 pr-4 text-left font-medium text-stone-500">Feature</th>
                  {TIERS.map((tier) => (
                    <th key={tier} className="px-4 py-4 text-center font-semibold text-stone-900">
                      {TIER_LABELS[tier]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PRICING_FEATURE_LIST.map(({ label, key, description }, i) => (
                  <tr
                    key={key}
                    className={`border-b border-stone-50 ${i % 2 === 0 ? "" : "bg-stone-50/50"}`}
                  >
                    <td className="py-3 pl-6 pr-4">
                      <span className="font-medium text-stone-800">{label}</span>
                      {description && (
                        <span className="ml-2 text-xs text-stone-400">{description}</span>
                      )}
                    </td>
                    {TIERS.map((tier) => (
                      <td key={tier} className="px-4 py-3 text-center">
                        {canAccessFeature(tier, key) ? (
                          <span className="text-green-600" aria-label="Included">✓</span>
                        ) : (
                          <span className="text-stone-200" aria-label="Not included">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                {/* Pricing row */}
                <tr className="border-t border-stone-200 bg-stone-50">
                  <td className="py-4 pl-6 pr-4 font-semibold text-stone-900">Price</td>
                  {TIERS.map((tier) => {
                    const price = isAnnual
                      ? TIER_PRICING[tier].annual
                      : TIER_PRICING[tier].monthly;
                    return (
                      <td key={tier} className="px-4 py-4 text-center">
                        <span className="font-bold text-stone-900">
                          {price === 0 ? "Free" : `$${price}/mo`}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Annual nudge */}
        {!isAnnual && (
          <div className="mb-16 rounded-xl border border-green-200 bg-green-50 px-6 py-4 text-center">
            <p className="text-sm text-green-900">
              <strong>Save 25%</strong> by switching to annual billing. Pay once, access for the full year.
            </p>
            <button
              onClick={() => setIsAnnual(true)}
              className="mt-2 text-sm font-medium text-green-800 underline hover:text-green-900"
            >
              Switch to annual →
            </button>
          </div>
        )}

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="mb-6 text-center font-serif text-2xl font-bold text-stone-900">
            Frequently asked questions
          </h2>
          <div className="mx-auto max-w-2xl divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white">
            {FAQ.map((item, i) => (
              <div key={i}>
                <button
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-medium text-stone-900">{item.q}</span>
                  <span className="shrink-0 text-stone-400">
                    {openFaq === i ? "−" : "+"}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="border-t border-stone-100 px-6 pb-4 pt-3">
                    <p className="text-sm text-stone-600">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pro CTA */}
        <div className="rounded-2xl bg-stone-900 px-8 py-10 text-center text-white">
          <h2 className="mb-2 font-serif text-2xl font-bold">
            Running a gallery or institution?
          </h2>
          <p className="mb-6 text-stone-400">
            Pro includes white glove onboarding, a dedicated analyst, and full API access.
            30-day trial available with a discovery call.
          </p>
          <Link
            href="/login?trial=pro"
            className="inline-flex rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-stone-900 hover:bg-stone-100 transition-colors"
          >
            Book a Pro discovery call →
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 px-6 py-8 text-center text-sm text-stone-400">
        <p>© {new Date().getFullYear()} ArtFOMO. All prices in USD.</p>
      </footer>
    </div>
  );
}
