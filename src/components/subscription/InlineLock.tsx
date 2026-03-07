"use client";

import Link from "next/link";
import { useSubscription } from "@/hooks/useSubscription";
import { TIER_LABELS, TIER_PRICING } from "@/lib/subscription";
import type { FeatureKey } from "@/lib/types";

interface InlineLockProps {
  feature: FeatureKey;
  children: React.ReactNode;
  /** Override the default upgrade label */
  upgradeLabel?: string;
  /** Compact mode — smaller badge, less blur */
  compact?: boolean;
}

export function InlineLock({
  feature,
  children,
  upgradeLabel,
  compact = false,
}: InlineLockProps) {
  const { canAccess, requiredTier } = useSubscription();

  if (canAccess(feature)) return <>{children}</>;

  const tier = requiredTier(feature);
  const price = TIER_PRICING[tier].annual;
  const label =
    upgradeLabel ??
    `Unlock with ${TIER_LABELS[tier]}${price > 0 ? ` · $${price}/mo` : ""}`;

  return (
    <div className="relative inline-block w-full">
      {/* Blurred content */}
      <div
        className={`select-none pointer-events-none ${
          compact ? "blur-[3px]" : "blur-sm"
        }`}
        aria-hidden="true"
      >
        {children}
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Link
          href="/pricing"
          className={`flex items-center gap-1.5 rounded-full border border-stone-300 bg-white/90 text-stone-700 shadow-sm backdrop-blur-sm hover:bg-stone-50 transition-colors ${
            compact
              ? "px-2.5 py-1 text-xs"
              : "px-3.5 py-1.5 text-xs font-medium"
          }`}
        >
          <LockIcon size={compact ? 10 : 12} />
          {label}
        </Link>
      </div>
    </div>
  );
}

function LockIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <rect x="2" y="5" width="8" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4 5V3.5a2 2 0 1 1 4 0V5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
