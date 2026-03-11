import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { stripe, mapStripeStatus } from "@/lib/stripe";
import type Stripe from "stripe";
import type { SubscriptionTier } from "@/lib/types";

// Use service role key — bypasses RLS so webhooks can write to any row
function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Stripe sends raw bytes — must NOT use Next.js body parsing
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = getAdminClient();

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpsert(supabase, sub);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(supabase, sub);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.customer) {
          await supabase
            .from("profiles")
            .update({ subscription_status: "past_due" })
            .eq("stripe_customer_id", invoice.customer as string);
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.customer) {
          await supabase
            .from("profiles")
            .update({ subscription_status: "active" })
            .eq("stripe_customer_id", invoice.customer as string);
        }
        break;
      }

      default:
        // Ignore unhandled event types
        break;
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleSubscriptionUpsert(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  sub: Stripe.Subscription
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s = sub as any;
  const customerId = sub.customer as string;
  const tier = getTierFromMetadata(sub);
  const status = mapStripeStatus(sub.status);

  const profileUpdate = {
    subscription_tier: tier,
    subscription_status: status,
    stripe_subscription_id: sub.id,
    subscription_period_end: new Date(s.current_period_end * 1000).toISOString(),
    billing_interval: sub.items.data[0]?.price.recurring?.interval === "year"
      ? "annual"
      : "monthly",
    trial_ends_at: s.trial_end
      ? new Date(s.trial_end * 1000).toISOString()
      : null,
  };

  await supabase
    .from("profiles")
    .update(profileUpdate)
    .eq("stripe_customer_id", customerId);

  // Upsert audit log row
  await supabase.from("subscriptions").upsert(
    {
      stripe_subscription_id: sub.id,
      stripe_customer_id: customerId,
      tier,
      status,
      billing_interval: profileUpdate.billing_interval,
      current_period_start: new Date(s.current_period_start * 1000).toISOString(),
      current_period_end: new Date(s.current_period_end * 1000).toISOString(),
      cancel_at_period_end: s.cancel_at_period_end,
      canceled_at: s.canceled_at
        ? new Date(s.canceled_at * 1000).toISOString()
        : null,
      trial_start: s.trial_start
        ? new Date(s.trial_start * 1000).toISOString()
        : null,
      trial_end: s.trial_end
        ? new Date(s.trial_end * 1000).toISOString()
        : null,
    },
    { onConflict: "stripe_subscription_id" }
  );
}

async function handleSubscriptionDeleted(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  sub: Stripe.Subscription
) {
  const customerId = sub.customer as string;

  await supabase
    .from("profiles")
    .update({
      subscription_tier: "free",
      subscription_status: "canceled",
      stripe_subscription_id: null,
      subscription_period_end: null,
    })
    .eq("stripe_customer_id", customerId);

  await supabase
    .from("subscriptions")
    .update({
      status: "canceled",
      canceled_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", sub.id);
}

function getTierFromMetadata(sub: Stripe.Subscription): SubscriptionTier {
  const tier = sub.metadata?.tier as SubscriptionTier | undefined;
  const validTiers: SubscriptionTier[] = ["free", "collector", "advisor", "pro"];
  if (tier && validTiers.includes(tier)) return tier;
  // Fallback: never let a sub with no metadata silently grant free
  console.warn(`Stripe subscription ${sub.id} has no tier metadata. Defaulting to 'free'.`);
  return "free";
}
