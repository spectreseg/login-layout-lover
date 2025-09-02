-- Fix security vulnerability: Restrict profile viewing to authenticated users only
-- This replaces the overly permissive policy that allowed anyone to view profiles

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Users can view profile names" ON public.profiles;

-- Create new policy that requires authentication
CREATE POLICY "Authenticated users can view profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (true);

-- This ensures only logged-in users can see profile information
-- while still allowing authenticated users to see each other's basic info
-- which is needed for the food sharing functionality