-- ArtFOMO Subscription Schema Migration
-- Run this in Supabase SQL Editor AFTER schema.sql has been applied.
-- Safe to run multiple times (uses IF NOT EXISTS / DO blocks).

-- ============================================================
-- 1. ENUM TYPES
-- ============================================================
DO $$ BEGIN
  CREATE TYPE public.subscription_tier AS ENUM ('free', 'collector', 'advisor', 'pro');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.subscription_status AS ENUM (
    'active', 'trialing', 'past_due', 'canceled', 'incomplete', 'paused'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.billing_interval AS ENUM ('monthly', 'annual');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- 2. EXTEND PROFILES TABLE
-- ============================================================
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS subscription_tier    public.subscription_tier    NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS stripe_customer_id   text                        UNIQUE,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text                      UNIQUE,
  ADD COLUMN IF NOT EXISTS subscription_status  public.subscription_status,
  ADD COLUMN IF NOT EXISTS subscription_period_end timestamptz,
  ADD COLUMN IF NOT EXISTS billing_interval     public.billing_interval,
  ADD COLUMN IF NOT EXISTS trial_ends_at        timestamptz;

-- Indexes for Stripe webhook lookups
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer ON public.profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_sub      ON public.profiles(stripe_subscription_id);

-- ============================================================
-- 3. SUBSCRIPTIONS AUDIT LOG
-- ============================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                      uuid      PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 uuid      NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_subscription_id  text      NOT NULL,
  stripe_customer_id      text      NOT NULL,
  tier                    public.subscription_tier    NOT NULL,
  status                  public.subscription_status  NOT NULL,
  billing_interval        public.billing_interval,
  current_period_start    timestamptz,
  current_period_end      timestamptz,
  cancel_at_period_end    boolean   NOT NULL DEFAULT false,
  canceled_at             timestamptz,
  trial_start             timestamptz,
  trial_end               timestamptz,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Webhook uses service role key (bypasses RLS), so no INSERT policy needed for users.

DO $$ BEGIN
  CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- 4. CLAIMED PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.claimed_profiles (
  id           uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid    NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  profile_type text    NOT NULL CHECK (profile_type IN ('artist', 'gallery')),
  profile_slug text    NOT NULL,
  verified     boolean NOT NULL DEFAULT false,
  verified_at  timestamptz,
  verified_by  uuid    REFERENCES public.profiles(id),
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE(profile_type, profile_slug)  -- one claim per artist/gallery globally
);

ALTER TABLE public.claimed_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view verified claimed profiles" ON public.claimed_profiles;
CREATE POLICY "Anyone can view verified claimed profiles"
  ON public.claimed_profiles FOR SELECT USING (verified = true);

DROP POLICY IF EXISTS "Users can view own claims" ON public.claimed_profiles;
CREATE POLICY "Users can view own claims"
  ON public.claimed_profiles FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own claims" ON public.claimed_profiles;
CREATE POLICY "Users can insert own claims"
  ON public.claimed_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 5. EXHIBITION UPLOADS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.exhibition_uploads (
  id               uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid    NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  artist_slug      text    NOT NULL,
  title            text    NOT NULL,
  description      text,
  show_type        text    CHECK (show_type IN (
                     'solo', 'group', 'art_fair', 'biennale', 'museum_show', 'online'
                   )),
  institution_tier text    CHECK (institution_tier IN (
                     'museum_major', 'museum_regional', 'gallery_tier1', 'gallery_tier2',
                     'gallery_tier3', 'art_fair_mega', 'art_fair_major', 'art_fair_regional',
                     'independent', 'online'
                   )),
  venue            text,
  venue_city       text,
  venue_country    text,
  start_date       date,
  end_date         date,
  image_urls       text[]  NOT NULL DEFAULT '{}',
  press_links      text[]  NOT NULL DEFAULT '{}',
  published        boolean NOT NULL DEFAULT false,
  status           text    NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.exhibition_uploads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own exhibition uploads" ON public.exhibition_uploads;
CREATE POLICY "Users can manage own exhibition uploads"
  ON public.exhibition_uploads FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Published exhibitions are public" ON public.exhibition_uploads;
CREATE POLICY "Published exhibitions are public"
  ON public.exhibition_uploads FOR SELECT USING (published = true);

DO $$ BEGIN
  CREATE TRIGGER update_exhibitions_updated_at
    BEFORE UPDATE ON public.exhibition_uploads
    FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- 6. FEATURED EXHIBITION SLOTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.featured_exhibition_slots (
  id                      uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  exhibition_id           uuid    NOT NULL REFERENCES public.exhibition_uploads(id) ON DELETE CASCADE,
  user_id                 uuid    NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  slot_type               text    NOT NULL CHECK (slot_type IN ('homepage', 'category', 'regional')),
  homepage_rotation       boolean NOT NULL DEFAULT false,
  newsletter_inclusion    boolean NOT NULL DEFAULT false,
  editorial_upgrade       boolean NOT NULL DEFAULT false,
  starts_at               timestamptz NOT NULL,
  ends_at                 timestamptz NOT NULL,
  stripe_payment_intent_id text,
  created_at              timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.featured_exhibition_slots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own featured slots" ON public.featured_exhibition_slots;
CREATE POLICY "Users can view own featured slots"
  ON public.featured_exhibition_slots FOR SELECT USING (auth.uid() = user_id);

-- ============================================================
-- 7. WHITE GLOVE REQUESTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.white_glove_requests (
  id           uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid    NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  service_type text    NOT NULL CHECK (service_type IN (
                 'onboarding', 'intelligence_briefing', 'collector_introductions',
                 'press_distribution', 'api_access'
               )),
  notes        text,
  status       text    NOT NULL DEFAULT 'pending' CHECK (status IN (
                 'pending', 'in_progress', 'completed', 'rejected'
               )),
  handled_by   uuid    REFERENCES public.profiles(id),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.white_glove_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own white glove requests" ON public.white_glove_requests;
CREATE POLICY "Users can manage own white glove requests"
  ON public.white_glove_requests FOR ALL USING (auth.uid() = user_id);

DO $$ BEGIN
  CREATE TRIGGER update_white_glove_updated_at
    BEFORE UPDATE ON public.white_glove_requests
    FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- 8. WATCHLIST LIMIT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION public.check_watchlist_limit()
RETURNS TRIGGER AS $$
DECLARE
  current_count integer;
  tier_limit    integer;
  user_tier     public.subscription_tier;
BEGIN
  SELECT subscription_tier INTO user_tier
    FROM public.profiles WHERE id = NEW.user_id;

  SELECT count(*) INTO current_count
    FROM public.watchlist WHERE user_id = NEW.user_id;

  tier_limit := CASE user_tier
    WHEN 'free'      THEN 5
    WHEN 'collector' THEN 50
    WHEN 'advisor'   THEN 200
    WHEN 'pro'       THEN 2147483647
    ELSE 5
  END;

  IF current_count >= tier_limit THEN
    RAISE EXCEPTION 'Watchlist limit reached for your subscription tier (limit: %)', tier_limit;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS enforce_watchlist_limit ON public.watchlist;
CREATE TRIGGER enforce_watchlist_limit
  BEFORE INSERT ON public.watchlist
  FOR EACH ROW EXECUTE PROCEDURE public.check_watchlist_limit();

-- ============================================================
-- 9. ADMIN POLICIES (for admin users to manage all data)
-- ============================================================
DROP POLICY IF EXISTS "Admins can view all subscriptions" ON public.subscriptions;
CREATE POLICY "Admins can view all subscriptions"
  ON public.subscriptions FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can manage claimed profiles" ON public.claimed_profiles;
CREATE POLICY "Admins can manage claimed profiles"
  ON public.claimed_profiles FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can manage exhibition uploads" ON public.exhibition_uploads;
CREATE POLICY "Admins can manage exhibition uploads"
  ON public.exhibition_uploads FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can manage white glove requests" ON public.white_glove_requests;
CREATE POLICY "Admins can manage white glove requests"
  ON public.white_glove_requests FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
