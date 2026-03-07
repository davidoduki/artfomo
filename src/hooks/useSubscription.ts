"use client";

import { useProfile } from "@/context/ProfileContext";
import {
  canAccessFeature,
  getSlotLimit,
  getEffectiveTier,
  requiredTierForFeature,
  isSubscriptionActive,
} from "@/lib/subscription";
import type { FeatureKey, SlotType, SubscriptionTier } from "@/lib/types";

export interface UseSubscriptionReturn {
  /** The tier the user can actually use today (lapsed → 'free') */
  tier: SubscriptionTier;
  /** Check if the user can use a specific feature */
  canAccess: (feature: FeatureKey) => boolean;
  /** Slots remaining before hitting the tier limit */
  remainingSlots: (slotType: SlotType, currentUsage: number) => number;
  /** Lowest tier that unlocks a feature (for upgrade prompts) */
  requiredTier: (feature: FeatureKey) => SubscriptionTier;
  /** Is this user currently in a trial? */
  isTrialing: boolean;
  /** Days left in trial (null if not trialing) */
  trialDaysLeft: number | null;
  /** Is the subscription in good standing? */
  isActive: boolean;
}

export function useSubscription(): UseSubscriptionReturn {
  const { profile } = useProfile();

  const tier = profile ? getEffectiveTier(profile) : "free";

  const isTrialing = profile?.subscription_status === "trialing";
  const trialDaysLeft =
    isTrialing && profile?.trial_ends_at
      ? Math.max(
          0,
          Math.ceil(
            (new Date(profile.trial_ends_at).getTime() - Date.now()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : null;

  return {
    tier,
    canAccess: (feature: FeatureKey) => canAccessFeature(tier, feature),
    remainingSlots: (slotType: SlotType, currentUsage: number) =>
      Math.max(0, getSlotLimit(tier, slotType) - currentUsage),
    requiredTier: requiredTierForFeature,
    isTrialing,
    trialDaysLeft,
    isActive: profile ? isSubscriptionActive(profile) : false,
  };
}
