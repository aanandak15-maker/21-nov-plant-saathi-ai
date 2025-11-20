-- SIMPLE COORDINATE FIX - No dependencies on other tables
-- Run this in your Supabase SQL Editor

-- Step 1: Check current field data
SELECT id, name, coordinates, location, crop_type, area, status
FROM fields
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'justfun2842@gmail.com')
ORDER BY created_at DESC;

-- Step 2: Fix fields with invalid coordinates
-- This creates a small rectangular field in Dankaur, Uttar Pradesh
UPDATE fields 
SET 
  coordinates = '[[28.3670, 77.5673], [28.3680, 77.5673], [28.3680, 77.5683], [28.3670, 77.5683]]'::jsonb,
  location = 'Dankaur, Uttar Pradesh, India'
WHERE 
  user_id = (SELECT id FROM auth.users WHERE email = 'justfun2842@gmail.com')
  AND (
    coordinates IS NULL 
    OR coordinates = '[]'::jsonb
    OR coordinates = '[[0, 0]]'::jsonb
    OR coordinates::text LIKE '%0.0000%'
  );

-- Step 3: Verify the fix worked
SELECT 
  id, 
  name, 
  coordinates,
  location,
  crop_type,
  area,
  status
FROM fields
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'justfun2842@gmail.com')
ORDER BY created_at DESC;

-- Expected result: coordinates should show valid lat/lng values
-- Example: [[28.367, 77.5673], [28.368, 77.5673], [28.368, 77.5683], [28.367, 77.5683]]
