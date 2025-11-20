-- Verification Query: Check if coordinate fix was applied successfully
-- Run this in Supabase SQL Editor to verify the fix worked

-- 1. Check all fields for your user
SELECT 
  id,
  name,
  coordinates,
  location,
  crop_type,
  area,
  status,
  created_at,
  CASE 
    WHEN coordinates IS NULL THEN '❌ NULL'
    WHEN coordinates = '[]'::jsonb THEN '❌ Empty'
    WHEN coordinates::text LIKE '%0.0000%' THEN '❌ Contains 0.0000'
    WHEN coordinates::text LIKE '%28.367%' THEN '✅ Fixed to Dankaur'
    ELSE '✅ Has coordinates'
  END as coordinate_status
FROM fields
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'justfun2842@gmail.com')
ORDER BY created_at DESC;

-- 2. Count fields by status
SELECT 
  CASE 
    WHEN coordinates IS NULL THEN 'NULL coordinates'
    WHEN coordinates = '[]'::jsonb THEN 'Empty array'
    WHEN coordinates::text LIKE '%0.0000%' THEN 'Invalid (0.0000)'
    WHEN coordinates::text LIKE '%28.367%' THEN 'Fixed (Dankaur)'
    ELSE 'Other valid coordinates'
  END as status,
  COUNT(*) as count
FROM fields
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'justfun2842@gmail.com')
GROUP BY status;

-- 3. Show detailed coordinates for each field
SELECT 
  name,
  coordinates,
  location
FROM fields
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'justfun2842@gmail.com')
ORDER BY name;
