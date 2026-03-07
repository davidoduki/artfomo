"use client";

import Link from "next/link";
import { useSubscription } from "@/hooks/useSubscription";

export function TrialCountdownBanner() {
  const { isTrialing, trialDaysLeft } = useSubscription();

  if (!isTrialing || trialDaysLeft === null) return null;

  const isUrgent = trialDaysLeft <= 3;

  return (
    <div
      className={`flex items-center justify-between gap-4 px-4 py-2.5 text-sm ${
        isUrgent
          ? "bg-red-50 text-red-900"
          : "bg-blue-50 text-blue-900"
      }`}
    >
      <span>
        {trialDaysLeft === 0
          ? "Your trial ends today."
          : `${trialDaysLeft} day${trialDaysLeft === 1 ? "" : "s"} left in your free trial.`}
        {" "}Don't lose access to your data.
      </span>
      <Link
        href="/pricing"
        className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
          isUrgent
            ? "border border-red-300 bg-red-100 text-red-900 hover:bg-red-200"
            : "border border-blue-300 bg-blue-100 text-blue-900 hover:bg-blue-200"
        }`}
      >
        Add payment method →
      </Link>
    </div>
  );
}
