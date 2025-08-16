-- Fix security vulnerability: Strengthen profiles table RLS policies to prevent anonymous access

-- Drop existing policies to recreate them with stronger security
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create secure policies that explicitly require authentication and prevent anonymous access
CREATE POLICY "Authenticated users can view own profile only" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Authenticated users can insert own profile only" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (id = auth.uid());

CREATE POLICY "Authenticated users can update own profile only" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Ensure the profiles table has RLS enabled (should already be enabled)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Add a comment for documentation
COMMENT ON TABLE public.profiles IS 'Student profiles table with strict RLS policies - only authenticated users can access their own profile data';