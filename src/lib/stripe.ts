import Stripe from "stripe";
import type { SubscriptionTier, BillingInterval } from "./types";

// Singleton Stripe instance (server-side only)
// Key may be absent during build — actual calls will fail at runtime if not configured
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_placeholder", {
  apiVersion: "2026-02-25.clover",
  typescript: true,
});

// Price ID lookup table — populated from env vars
export const STRIPE_PRICE_IDS: Record<string, string | undefined> = {
  collector_monthly: process.env.STRIPE_PRICE_COLLECTOR_MONTHLY,
  collector_annual:  process.env.STRIPE_PRICE_COLLECTOR_ANNUAL,
  advisor_monthly:   process.env.STRIPE_PRICE_ADVISOR_MONTHLY,
  advisor_annual:    process.env.STRIPE_PRICE_ADVISOR_ANNUAL,
  pro_monthly:       process.env.STRIPE_PRICE_PRO_MONTHLY,
  pro_annual:        process.env.STRIPE_PRICE_PRO_ANNUAL,
};

export function getPriceId(
  tier: SubscriptionTier,
  interval: BillingInterval
): string {
  const key = `${tier}_${interval}`;
  const priceId = STRIPE_PRICE_IDS[key];
  if (!priceId) {
    throw new Error(`No Stripe price ID configured for ${key}. Add ${`STRIPE_PRICE_${tier.toUpperCase()}_${interval.toUpperCase()}`} to your env vars.`);
  }
  return priceId;
}

/** Map a Stripe subscription status to our internal status */
export function mapStripeStatus(
  stripeStatus: string
): "active" | "trialing" | "past_due" | "canceled" | "incomplete" | "paused" {
  const map: Record<string, "active" | "trialing" | "past_due" | "canceled" | "incomplete" | "paused"> = {
    active:            "active",
    trialing:          "trialing",
    past_due:          "past_due",
    canceled:          "canceled",
    unpaid:            "past_due",
    incomplete:        "incomplete",
    incomplete_expired:"canceled",
    paused:            "paused",
  };
  return map[stripeStatus] ?? "incomplete";
}
