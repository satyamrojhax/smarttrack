-- Fix security vulnerability: Strengthen profiles table RLS policies to prevent anonymous access
-- Use unique policy names to avoid conflicts

-- Drop all existing policies completely
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view own profile only" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can insert own profile only" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can update own profile only" ON public.profiles;

-- Create secure policies with explicit authentication requirements
CREATE POLICY "secure_profiles_select_v2" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (id = auth.uid());

CREATE POLICY "secure_profiles_insert_v2" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (id = auth.uid());

CREATE POLICY "secure_profiles_update_v2" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;