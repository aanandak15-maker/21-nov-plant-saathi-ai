-- Diagnostic queries to understand your fields table structure

-- 1. Check what columns exist in the fields table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'fields'
ORDER BY ordinal_position;

-- 2. Check current field data for your user
SELECT id, name, coordinates, location, crop_type, area, status, created_at
FROM fields
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'justfun2842@gmail.com')
ORDER BY created_at DESC;

-- 3. Check if coordinates contain 0.0000 values
SELECT 
  id, 
  name, 
  coordinates,
  location,
  CASE 
    WHEN coordinates IS NULL THEN 'NULL coordinates'
    WHEN coordinates = '[]'::jsonb THEN 'Empty array'
    WHEN coordinates::text LIKE '%0.0000%' THEN 'Contains 0.0000'
    WHEN coordinates::text LIKE '%"0"%' THEN 'Contains zero'
    ELSE 'Valid coordinates'
  END as coordinate_status
FROM fields
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'justfun2842@gmail.com');

-- 4. Check field_data_cache table
SELECT field_id, data_type, cached_at
FROM field_data_cache
WHERE field_id IN (
  SELECT id FROM fields 
  WHERE user_id = (SELECT id FROM auth.users WHERE email = 'justfun2842@gmail.com')
)
ORDER BY cached_at DESC;
