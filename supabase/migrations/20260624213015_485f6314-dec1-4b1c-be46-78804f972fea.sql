
-- Fix conversation_participants self-join bug
DROP POLICY IF EXISTS "Users can add participants" ON public.conversation_participants;
CREATE POLICY "Users can add participants"
ON public.conversation_participants
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.conversation_participants cp
    WHERE cp.conversation_id = conversation_participants.conversation_id
      AND cp.user_id = auth.uid()
  )
);

-- Remove blanket realtime SELECT policy on messages
DROP POLICY IF EXISTS "Authenticated users can use realtime" ON public.messages;

-- Profiles
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated can view public profile fields"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

REVOKE SELECT ON public.profiles FROM authenticated;
GRANT SELECT (
  id, user_id, username, display_name, avatar_url, bio, cover_photo_url, social_links,
  is_verified, followers_count, following_count, total_views, total_likes,
  show_timed_interactions, show_contributor_badges, created_at, updated_at
) ON public.profiles TO authenticated;

CREATE OR REPLACE FUNCTION public.get_my_profile_private()
RETURNS TABLE (
  phone_number text,
  phone_verified boolean,
  vicoin_balance integer,
  icoin_balance integer,
  kyc_status text,
  referred_by text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT phone_number, phone_verified, vicoin_balance, icoin_balance, kyc_status, referred_by
  FROM public.profiles
  WHERE user_id = auth.uid();
$$;
REVOKE EXECUTE ON FUNCTION public.get_my_profile_private() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_profile_private() TO authenticated;

-- Referral codes
DROP POLICY IF EXISTS "Authenticated users can view active referral codes" ON public.referral_codes;

-- User levels
DROP POLICY IF EXISTS "Authenticated users can view levels for leaderboard" ON public.user_levels;

CREATE OR REPLACE FUNCTION public.get_leaderboard(p_limit integer DEFAULT 50)
RETURNS TABLE (
  rank bigint,
  user_id uuid,
  username text,
  display_name text,
  avatar_url text,
  level integer,
  total_xp integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    ROW_NUMBER() OVER (ORDER BY ul.total_xp DESC, ul.level DESC) AS rank,
    ul.user_id,
    p.username,
    p.display_name,
    p.avatar_url,
    ul.level,
    ul.total_xp
  FROM public.user_levels ul
  JOIN public.profiles p ON p.user_id = ul.user_id
  ORDER BY ul.total_xp DESC, ul.level DESC
  LIMIT COALESCE(p_limit, 50);
$$;
REVOKE EXECUTE ON FUNCTION public.get_leaderboard(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_leaderboard(integer) TO authenticated;

-- Storage
DROP POLICY IF EXISTS "Public can view content uploads" ON storage.objects;
DROP POLICY IF EXISTS "Public can view studio media" ON storage.objects;

-- SECURITY DEFINER lockdown
REVOKE EXECUTE ON FUNCTION public.atomic_request_payout(uuid, integer, text, text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.atomic_convert_coins(uuid, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.atomic_tip_creator(uuid, uuid, integer, text, uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.atomic_update_balance(uuid, integer, text, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.atomic_request_payout(uuid, integer, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.atomic_convert_coins(uuid, integer, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.atomic_tip_creator(uuid, uuid, integer, text, uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.atomic_update_balance(uuid, integer, text, text, text) TO service_role;

REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_contributor_stats() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_comment_likes_count() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_content_likes_count() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_follow_counts() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_conversation_last_message() FROM PUBLIC, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;
