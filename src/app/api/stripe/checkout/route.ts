import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe, getPriceId } from "@/lib/stripe";

export const dynamic = "force-dynamic";
import type { SubscriptionTier, BillingInterval } from "@/lib/types";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const tier = body.tier as SubscriptionTier;
  const interval = (body.interval ?? "annual") as BillingInterval;
  const trial = Boolean(body.trial);

  if (!tier || tier === "free") {
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
  }

  // Get or create Stripe customer
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, email, full_name")
    .eq("id", user.id)
    .single();

  let customerId = profile?.stripe_customer_id as string | null;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: profile?.email ?? user.email ?? undefined,
      name: profile?.full_name ?? undefined,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;

    await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id);
  }

  const priceId = getPriceId(tier, interval);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  // Trial: Collector 14 days (no CC), Pro 30 days
  const trialDays = trial
    ? tier === "collector"
      ? 14
      : tier === "pro"
      ? 30
      : undefined
    : undefined;

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    ...(trialDays !== undefined && {
      subscription_data: {
        trial_period_days: trialDays,
        metadata: { supabase_user_id: user.id, tier },
      },
      payment_method_collection: "if_required",
    }),
    ...(!trialDays && {
      subscription_data: {
        metadata: { supabase_user_id: user.id, tier },
      },
    }),
    success_url: `${appUrl}/dashboard?upgrade=success&tier=${tier}`,
    cancel_url: `${appUrl}/pricing`,
    allow_promotion_codes: true,
  });

  return NextResponse.json({ url: session.url });
}
