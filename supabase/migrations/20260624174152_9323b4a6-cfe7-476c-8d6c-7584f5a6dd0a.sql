
-- ============================================================
-- Lock down overly permissive RLS policies and channel access
-- ============================================================

-- 1. profiles: restrict public SELECT to authenticated only (no anonymous)
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
CREATE POLICY "Authenticated users can view profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);
REVOKE SELECT ON public.profiles FROM anon;

-- 2. content_contributors: replace permissive ALL policy with service-role-only writes
DROP POLICY IF EXISTS "System can manage contributors" ON public.content_contributors;
CREATE POLICY "Service role can manage contributors"
  ON public.content_contributors FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

-- 3. notifications: restrict INSERTs to service role only
DROP POLICY IF EXISTS "Authenticated users can insert notifications" ON public.notifications;
CREATE POLICY "Service role can insert notifications"
  ON public.notifications FOR INSERT
  TO service_role
  WITH CHECK (true);

-- 4. referral_codes: restrict UPDATE to owner only, and SELECT to authenticated
DROP POLICY IF EXISTS "System can update referral codes" ON public.referral_codes;
CREATE POLICY "Users can update their own referral code"
  ON public.referral_codes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Service role can update any referral code"
  ON public.referral_codes FOR UPDATE
  TO service_role
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can view active referral codes" ON public.referral_codes;
CREATE POLICY "Authenticated users can view active referral codes"
  ON public.referral_codes FOR SELECT
  TO authenticated
  USING (is_active = true);
REVOKE SELECT ON public.referral_codes FROM anon;

-- 5. referrals: restrict system insert/update to service role
DROP POLICY IF EXISTS "System can insert referrals" ON public.referrals;
DROP POLICY IF EXISTS "System can update referrals" ON public.referrals;
CREATE POLICY "Service role can insert referrals"
  ON public.referrals FOR INSERT
  TO service_role
  WITH CHECK (true);
CREATE POLICY "Service role can update referrals"
  ON public.referrals FOR UPDATE
  TO service_role
  USING (true) WITH CHECK (true);

-- 6. user_roles: add RESTRICTIVE policy that blocks any non-service-role INSERT
CREATE POLICY "Block direct role inserts"
  ON public.user_roles
  AS RESTRICTIVE
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (false);

-- 7. timed_interactions: restrict public SELECT to authenticated only
DROP POLICY IF EXISTS "Anyone can view visible timed interactions" ON public.timed_interactions;
CREATE POLICY "Authenticated users can view visible timed interactions"
  ON public.timed_interactions FOR SELECT
  TO authenticated
  USING (is_visible = true);
REVOKE SELECT ON public.timed_interactions FROM anon;

-- 8. user_levels: restrict public SELECT to authenticated only
DROP POLICY IF EXISTS "Users can view all levels for leaderboard" ON public.user_levels;
CREATE POLICY "Authenticated users can view levels for leaderboard"
  ON public.user_levels FOR SELECT
  TO authenticated
  USING (true);
REVOKE SELECT ON public.user_levels FROM anon;

-- 9. Realtime channel authorization: require authenticated subscribers
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated users can use realtime" ON realtime.messages;
CREATE POLICY "Authenticated users can use realtime"
  ON realtime.messages FOR SELECT
  TO authenticated
  USING (true);
