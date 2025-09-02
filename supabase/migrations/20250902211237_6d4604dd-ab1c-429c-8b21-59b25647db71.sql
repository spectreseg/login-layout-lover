-- Fix privacy vulnerability: Restrict food_posts viewing to protect user_id exposure
-- This prevents tracking of individual users' food sharing patterns and locations

-- Drop the overly permissive policy that allows anyone to see all food posts
DROP POLICY IF EXISTS "Users can view all food posts" ON public.food_posts;

-- Create new restrictive policies for food posts
-- Policy 1: Allow authenticated users to view active food posts with user_id
CREATE POLICY "Authenticated users can view active food posts" 
ON public.food_posts 
FOR SELECT 
TO authenticated
USING (expires_at > now());

-- Policy 2: Allow anonymous users to view active food posts but without user_id visibility
-- This is achieved by creating a separate view for public access
CREATE OR REPLACE VIEW public.public_food_posts AS
SELECT 
  id,
  title,
  description,
  location,
  servings,
  image_url,
  expires_at,
  created_at,
  updated_at,
  finished_by
FROM public.food_posts
WHERE expires_at > now();

-- Grant access to the public view
GRANT SELECT ON public.public_food_posts TO anon, authenticated;

-- Create RLS policy for the public view
ALTER VIEW public.public_food_posts SET (security_barrier = true);

-- Note: The original table policies remain for authenticated users to see user_ids
-- when they need to interact with posts (notifications, etc.)
-- but anonymous users and general browsing will use the view without user_ids