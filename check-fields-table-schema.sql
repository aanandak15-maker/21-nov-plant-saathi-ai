-- Check the actual fields table schema in Supabase
-- Run this in Supabase SQL Editor to see what columns exist

SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'fields'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Also check for any constraints
SELECT
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'fields'
  AND tc.table_schema = 'public';
