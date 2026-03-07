"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { TIER_LABELS, TIER_PRICING } from "@/lib/subscription";
import type { SubscriptionTier, SubscriptionStatus, BillingInterval } from "@/lib/types";

interface ProfileClientProps {
  initialName: string;
  email: string;
  tier: SubscriptionTier;
  subscriptionStatus: SubscriptionStatus | null;
  subscriptionPeriodEnd: string | null;
  billingInterval: BillingInterval | null;
  trialEndsAt: string | null;
  hasStripeCustomer: boolean;
}

export function ProfileClient({
  initialName,
  email,
  tier,
  subscriptionStatus,
  subscriptionPeriodEnd,
  billingInterval,
  trialEndsAt,
  hasStripeCustomer,
}: ProfileClientProps) {
  const [name, setName] = useState(initialName);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [portalLoading, setPortalLoading] = useState(false);
  const supabase = createClient();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("profiles")
          .update({ full_name: name })
          .eq("id", user.id);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  const openBillingPortal = async () => {
    setPortalLoading(true);
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      setPortalLoading(false);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const isTrialing = subscriptionStatus === "trialing";
  const isPastDue = subscriptionStatus === "past_due";
  const price = billingInterval ? TIER_PRICING[tier][billingInterval] : null;

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Profile Settings</h1>
        <p className="mt-1 text-stone-500">Manage your account information.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal info */}
        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-stone-900">Personal Info</h2>
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="mt-1 w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="mt-1 w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-500"
              />
              <p className="mt-1 text-xs text-stone-400">Managed through your Google account.</p>
            </div>
          </div>
        </div>

        {/* Subscription */}
        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-stone-900">Subscription</h2>
            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">
              {TIER_LABELS[tier]}
            </span>
          </div>

          <div className="mt-4 space-y-2 text-sm text-stone-600">
            {tier === "free" ? (
              <p>You&apos;re on the free plan.</p>
            ) : (
              <>
                {price !== null && (
                  <p>
                    <span className="font-medium">${price}/mo</span>
                    {billingInterval && <span className="text-stone-400"> · billed {billingInterval}</span>}
                  </p>
                )}
                {isTrialing && trialEndsAt && (
                  <p className="text-blue-700">
                    Trial ends {formatDate(trialEndsAt)}
                  </p>
                )}
                {isPastDue && (
                  <p className="text-red-700 font-medium">
                    Payment failed — please update your billing details.
                  </p>
                )}
                {subscriptionPeriodEnd && !isTrialing && (
                  <p className="text-stone-400">
                    {subscriptionStatus === "canceled" ? "Access until " : "Renews "}
                    {formatDate(subscriptionPeriodEnd)}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="mt-4 flex gap-3">
            {tier === "free" ? (
              <Link
                href="/pricing"
                className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 transition-colors"
              >
                Upgrade plan
              </Link>
            ) : (
              hasStripeCustomer && (
                <button
                  type="button"
                  onClick={openBillingPortal}
                  disabled={portalLoading}
                  className="rounded-lg border border-stone-300 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors disabled:opacity-50"
                >
                  {portalLoading ? "Opening…" : "Manage billing"}
                </button>
              )
            )}
            {tier !== "free" && (
              <Link
                href="/pricing"
                className="rounded-lg border border-stone-200 px-4 py-2 text-sm text-stone-500 hover:bg-stone-50 transition-colors"
              >
                Change plan
              </Link>
            )}
          </div>
        </div>

        {/* Preferences */}
        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-stone-900">Preferences</h2>
          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900" />
              <span className="text-sm text-stone-700">Email me when a watched artist has a new drop</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900" />
              <span className="text-sm text-stone-700">Email me weekly momentum reports</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900" />
              <span className="text-sm text-stone-700">Email me about new blog posts</span>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-stone-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800 disabled:opacity-50"
          >
            Save Changes
          </button>
          {saved && <span className="text-sm text-green-700">Changes saved!</span>}
        </div>
      </form>

      {/* Danger zone */}
      <div className="mt-12 rounded-xl border border-red-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-red-700">Danger Zone</h2>
        <p className="mt-1 text-sm text-stone-500">
          Permanently delete your account and all associated data.
        </p>
        <button className="mt-4 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50">
          Delete Account
        </button>
      </div>
    </div>
  );
}
