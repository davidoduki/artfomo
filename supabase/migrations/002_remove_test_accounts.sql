-- Remove legacy test/seed accounts from auth (cascades to profiles)
-- Run this once in Supabase SQL Editor

DELETE FROM auth.users
WHERE email IN (
  'admin@artfomo.com',
  'collector@example.com',
  'investor@example.com'
);

-- Confirm the real owner account has admin role
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'davidoduki@gmail.com';
