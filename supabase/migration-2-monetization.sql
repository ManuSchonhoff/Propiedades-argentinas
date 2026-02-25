-- =============================================
-- Migration 2: Monetización — Plans, Subscriptions, Boosts, Webhooks
-- Run in Supabase SQL Editor AFTER migration-1c.sql
-- =============================================

-- 1) Plans
CREATE TABLE IF NOT EXISTS plans (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code text UNIQUE NOT NULL,
    name text NOT NULL,
    price_ars numeric NOT NULL,
    listing_limit int NOT NULL DEFAULT 5,
    mp_preapproval_plan_id text,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Plans are publicly readable"
    ON plans FOR SELECT
    USING (true);

-- 2) Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id uuid NOT NULL REFERENCES plans(id),
    mp_preapproval_id text,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','authorized','paused','cancelled','expired')),
    current_period_end timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own subscriptions"
    ON subscriptions FOR SELECT
    USING (auth.uid() = user_id);

-- Auto-update updated_at on subscriptions
CREATE OR REPLACE FUNCTION public.update_subscriptions_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER set_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.update_subscriptions_updated_at();

-- 3) Boost Products
CREATE TABLE IF NOT EXISTS boost_products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code text UNIQUE NOT NULL,
    name text NOT NULL,
    price_ars numeric NOT NULL,
    duration_hours int NOT NULL,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE boost_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Boost products are publicly readable"
    ON boost_products FOR SELECT
    USING (true);

-- 4) Boosts
CREATE TABLE IF NOT EXISTS boosts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    boost_product_id uuid NOT NULL REFERENCES boost_products(id),
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','expired','cancelled')),
    starts_at timestamptz,
    ends_at timestamptz,
    mp_payment_id text,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE boosts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own boosts"
    ON boosts FOR SELECT
    USING (auth.uid() = user_id);

-- 5) Mercado Pago Webhook Events (log + idempotency)
CREATE TABLE IF NOT EXISTS mp_webhook_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    topic text NOT NULL,
    resource_id text NOT NULL,
    payload jsonb,
    received_at timestamptz DEFAULT now(),
    processed boolean DEFAULT false,
    UNIQUE(topic, resource_id)
);

ALTER TABLE mp_webhook_events ENABLE ROW LEVEL SECURITY;
-- No client access — only service role / server-side

-- =============================================
-- SEED DATA
-- =============================================

-- Plans (ARS)
INSERT INTO plans (code, name, price_ars, listing_limit) VALUES
    ('S', 'Plan Starter', 9990, 5),
    ('M', 'Plan Profesional', 24990, 20),
    ('L', 'Plan Inmobiliaria', 49990, 100)
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    price_ars = EXCLUDED.price_ars,
    listing_limit = EXCLUDED.listing_limit;

-- Boost Products (ARS)
INSERT INTO boost_products (code, name, price_ars, duration_hours) VALUES
    ('BOOST_24H', 'Destacar 24 horas', 1990, 24),
    ('BOOST_72H', 'Destacar 3 días', 4990, 72),
    ('BOOST_7D', 'Destacar 7 días', 8990, 168)
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    price_ars = EXCLUDED.price_ars,
    duration_hours = EXCLUDED.duration_hours;

-- Done! Verify:
-- SELECT * FROM plans;
-- SELECT * FROM boost_products;
-- SELECT * FROM subscriptions;
-- SELECT * FROM boosts;
-- SELECT * FROM mp_webhook_events;
