-- Verification Script - Run this in Supabase SQL Editor to check if indexes were created successfully
-- This will show you which indexes exist and which are missing

-- 1. Check if core tables exist
SELECT 
  'fields' as table_name, 
  COUNT(*) as exists 
FROM information_schema.tables 
WHERE table_name = 'fields'
UNION ALL
SELECT 'field_data', COUNT(*) FROM information_schema.tables WHERE table_name = 'field_data'
UNION ALL
SELECT 'analytics_events', COUNT(*) FROM information_schema.tables WHERE table_name = 'analytics_events'
UNION ALL
SELECT 'view_events', COUNT(*) FROM information_schema.tables WHERE table_name = 'view_events';

-- 2. Check all indexes on critical tables
SELECT 
  tablename as table_name,
  indexname as index_name,
  indexdef as index_definition
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('fields', 'field_data', 'analytics_events', 'view_events', 
                    'educational_videos', 'blogs', 'cart_items', 'orders', 'disease_detections')
ORDER BY tablename, indexname;

-- 3. Check if materialized view exists
SELECT 
  matviewname,
  definition
FROM pg_matviews
WHERE matviewname = 'content_view_counts';

-- 4. Check RLS policies on view_events
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'view_events';

-- 5. Performance check - Count rows in critical tables
SELECT 
  'fields' as table_name, 
  (SELECT COUNT(*) FROM fields) as row_count
UNION ALL
SELECT 'field_data', (SELECT COUNT(*) FROM field_data)
UNION ALL
SELECT 'analytics_events', (SELECT COUNT(*) FROM analytics_events)
UNION ALL
SELECT 'view_events', (SELECT COUNT(*) FROM view_events);
