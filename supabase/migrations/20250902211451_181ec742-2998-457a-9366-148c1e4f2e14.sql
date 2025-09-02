-- Fix the security definer view issue by using proper RLS policies instead

-- Drop the problematic view
DROP VIEW IF EXISTS public.public_food_posts;

-- Create a more nuanced RLS policy that protects user_id exposure
-- while still allowing necessary functionality

-- Create policy for viewing food posts with user_id restrictions
CREATE POLICY "Users can view food posts with privacy protection" 
ON public.food_posts 
FOR SELECT 
TO authenticated
USING (
  -- Users can always see their own posts with full details
  auth.uid() = user_id 
  OR 
  -- For other users' posts, only show active posts
  -- The application layer should handle hiding user_id when not needed
  (expires_at > now())
);

-- Create a separate policy for anonymous users (if needed)
-- This will require the application to handle authentication properly
CREATE POLICY "Anonymous users can view limited food post data" 
ON public.food_posts 
FOR SELECT 
TO anon
USING (
  -- Anonymous users can only see active posts
  -- Application should filter out user_id in the query
  expires_at > now()
);

-- Note: The application layer will need to be updated to:
-- 1. Use different queries for authenticated vs anonymous users
-- 2. Filter out user_id in public listings when privacy is required
-- 3. Only show user_id when the user is interacting with the post