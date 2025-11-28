-- View Events Tracking System
-- Replaces direct view counter updates to prevent row locking

-- Create view_events table for tracking all content views
CREATE TABLE IF NOT EXISTS view_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL CHECK (content_type IN ('video', 'blog', 'story', 'gallery')),
  content_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_view_events_content ON view_events(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_view_events_user ON view_events(user_id);
CREATE INDEX IF NOT EXISTS idx_view_events_viewed_at ON view_events(viewed_at DESC);

-- Enable RLS
ALTER TABLE view_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Anyone can log a view
CREATE POLICY "Anyone can log views"
  ON view_events FOR INSERT
  WITH CHECK (true);

-- Only authenticated users can see their own views
CREATE POLICY "Users can see own views"
  ON view_events FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Create materialized view for aggregated counts (refreshed periodically)
CREATE MATERIALIZED VIEW IF NOT EXISTS content_view_counts AS
SELECT 
  content_type,
  content_id,
  COUNT(*) as view_count,
  COUNT(DISTINCT user_id) as unique_viewers,
  MAX(viewed_at) as last_viewed_at
FROM view_events
GROUP BY content_type, content_id;

-- Index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_content_view_counts ON content_view_counts(content_type, content_id);

-- Function to refresh view counts (call this every hour via pg_cron or from your backend)
CREATE OR REPLACE FUNCTION refresh_view_counts()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY content_view_counts;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION refresh_view_counts() TO authenticated;
