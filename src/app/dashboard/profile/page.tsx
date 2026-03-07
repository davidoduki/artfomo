import { getProfile } from "@/lib/auth";
import { getEffectiveTier } from "@/lib/subscription";
import { ProfileClient } from "./ProfileClient";

export default async function ProfilePage() {
  const profile = await getProfile();
  const tier = profile ? getEffectiveTier(profile) : "free";

  return (
    <ProfileClient
      initialName={profile?.full_name ?? ""}
      email={profile?.email ?? ""}
      tier={tier}
      subscriptionStatus={profile?.subscription_status ?? null}
      subscriptionPeriodEnd={profile?.subscription_period_end ?? null}
      billingInterval={profile?.billing_interval ?? null}
      trialEndsAt={profile?.trial_ends_at ?? null}
      hasStripeCustomer={Boolean(profile?.stripe_customer_id)}
    />
  );
}
