-- =============================================
-- Migration 3: Manual Monetization (Phase 2B)
-- Adds manual_pending status, RLS INSERT/UPDATE policies,
-- and unique partial index for 1 active subscription per user.
-- Run in Supabase SQL Editor AFTER migration-2-monetization.sql
-- =============================================

-- 1) Update subscriptions status CHECK to include 'manual_pending'
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_status_check;
ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_status_check
    CHECK (status IN ('pending','manual_pending','authorized','paused','cancelled','expired'));

-- 2) Update boosts status CHECK to include 'manual_pending'
ALTER TABLE boosts DROP CONSTRAINT IF EXISTS boosts_status_check;
ALTER TABLE boosts ADD CONSTRAINT boosts_status_check
    CHECK (status IN ('pending','manual_pending','active','expired','cancelled'));

-- 3) Unique partial index: only 1 authorized subscription per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_one_active_per_user
    ON subscriptions (user_id)
    WHERE status = 'authorized';

-- 4) Performance indexes
CREATE INDEX IF NOT EXISTS idx_boosts_listing_status ON boosts (listing_id, status, ends_at);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status ON subscriptions (user_id, status);

-- =============================================
-- 5) RLS Policies — Subscriptions
-- =============================================

-- INSERT: user can create their own subscription request
CREATE POLICY "Users can insert own subscriptions"
    ON subscriptions FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- UPDATE: admin only
CREATE POLICY "Admin can update subscriptions"
    ON subscriptions FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- SELECT: admin can read all subscriptions (for admin panel)
CREATE POLICY "Admin can read all subscriptions"
    ON subscriptions FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- =============================================
-- 6) RLS Policies — Boosts
-- =============================================

-- INSERT: user can create their own boost request
CREATE POLICY "Users can insert own boosts"
    ON boosts FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- UPDATE: admin only
CREATE POLICY "Admin can update boosts"
    ON boosts FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- SELECT: admin can read all boosts (for admin panel)
CREATE POLICY "Admin can read all boosts"
    ON boosts FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- =============================================
-- Done! Verify:
-- =============================================
-- SELECT * FROM subscriptions;
-- SELECT * FROM boosts;
-- \d subscriptions  -- check constraint
-- \d boosts         -- check constraint
