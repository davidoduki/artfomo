-- Run this once in the Supabase SQL Editor to grant admin access
-- to the site owner. After running, refresh your dashboard session.

UPDATE profiles
SET role = 'admin'
WHERE email = 'davidoduki@gmail.com';
