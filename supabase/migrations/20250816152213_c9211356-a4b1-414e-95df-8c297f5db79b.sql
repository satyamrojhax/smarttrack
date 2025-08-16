-- Fix security vulnerability: Restrict community_messages access to authenticated users only

-- Drop the existing policy that allows public access
DROP POLICY IF EXISTS "Anyone can view community messages" ON public.community_messages;

-- Create a new secure policy that only allows authenticated users to view messages
CREATE POLICY "Authenticated users can view community messages" 
ON public.community_messages 
FOR SELECT 
USING (auth.uid() IS NOT NULL);