-- Fix existing fields with invalid coordinates
-- Run this in your Supabase SQL editor

-- Step 1: Check current field data
SELECT id, name, coordinates, location, crop_type, area, created_at
FROM fields
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'justfun2842@gmail.com')
ORDER BY created_at DESC;

-- Step 2: Update fields with invalid coordinates (0,0 or null) to Dankaur location
-- Dankaur, Uttar Pradesh coordinates: 28.3670°N, 77.5673°E
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
    OR coordinates::text LIKE '%"0"%'
    OR coordinates::text LIKE '%0.0000%'
  );

-- Step 3: Verify the update
SELECT id, name, coordinates, location, crop_type, area
FROM fields 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'justfun2842@gmail.com')
ORDER BY created_at DESC;

-- Step 4: Clear any cached satellite data to force refresh (OPTIONAL)
-- Note: Only run this if you have a field_data_cache table
-- DELETE FROM field_data_cache
-- WHERE field_id IN (
--   SELECT id FROM fields 
--   WHERE user_id = (SELECT id FROM auth.users WHERE email = 'justfun2842@gmail.com')
-- );
