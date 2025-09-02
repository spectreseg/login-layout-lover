-- Fix privacy vulnerability: Restrict profile viewing to own profile and active food sharers only
-- This prevents users from browsing all user profiles while maintaining food sharing functionality

-- Drop the overly permissive policy that allows viewing all profiles
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

-- Create restrictive policy that only allows:
-- 1. Users to view their own profile
-- 2. Users to view profiles of people who have active food posts
CREATE POLICY "Users can view own profile and active food sharers" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (
  auth.uid() = user_id 
  OR 
  user_id IN (
    SELECT DISTINCT user_id 
    FROM public.food_posts 
    WHERE expires_at > now()
  )
);

-- This ensures users can only see:
-- - Their own profile information
-- - Profiles of users who currently have food available for sharing
-- This maintains food sharing functionality while protecting user privacy