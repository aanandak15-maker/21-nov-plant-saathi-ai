-- Migration: Create content management tables
-- Run this in Supabase SQL Editor

-- 1. Educational Videos Table
CREATE TABLE IF NOT EXISTS educational_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_hi TEXT,
  title_bn TEXT,
  description TEXT NOT NULL,
  description_hi TEXT,
  description_bn TEXT,
  youtube_id TEXT NOT NULL,
  thumbnail_url TEXT,
  duration TEXT,
  category TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Farmer Success Stories Table
CREATE TABLE IF NOT EXISTS farmer_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_name TEXT NOT NULL,
  location TEXT NOT NULL,
  achievement TEXT NOT NULL,
  achievement_hi TEXT,
  achievement_bn TEXT,
  image_url TEXT,
  yield_increase DECIMAL(5,2),
  crop_type TEXT,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Community Gallery Table
CREATE TABLE IF NOT EXISTS community_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  caption_hi TEXT,
  caption_bn TEXT,
  category TEXT,
  likes INTEGER DEFAULT 0,
  location TEXT,
  status TEXT DEFAULT 'published' CHECK (status IN ('pending', 'published', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Blogs Table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_url TEXT,
  author_name TEXT DEFAULT 'Plant Saathi Team',
  category TEXT NOT NULL,
  tags TEXT[],
  read_time TEXT,
  views INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_videos_category ON educational_videos(category);
CREATE INDEX IF NOT EXISTS idx_videos_status ON educational_videos(status);
CREATE INDEX IF NOT EXISTS idx_videos_created ON educational_videos(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_stories_status ON farmer_stories(status);
CREATE INDEX IF NOT EXISTS idx_stories_created ON farmer_stories(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_gallery_user ON community_gallery(user_id);
CREATE INDEX IF NOT EXISTS idx_gallery_status ON community_gallery(status);
CREATE INDEX IF NOT EXISTS idx_gallery_created ON community_gallery(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category);
CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(published_at DESC);

-- Row Level Security (RLS) Policies

-- Videos: Public can read published, admins can manage
ALTER TABLE educational_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published videos" ON educational_videos
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage videos" ON educational_videos
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    auth.jwt() ->> 'email' = 'plantsaathiai@gmail.com'
  );

-- Stories: Public can read published, admins can manage
ALTER TABLE farmer_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published stories" ON farmer_stories
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage stories" ON farmer_stories
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    auth.jwt() ->> 'email' = 'plantsaathiai@gmail.com'
  );

-- Gallery: Users can manage their own, public can view published
ALTER TABLE community_gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published gallery" ON community_gallery
  FOR SELECT USING (status = 'published');

CREATE POLICY "Users can insert their own gallery" ON community_gallery
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own gallery" ON community_gallery
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all gallery" ON community_gallery
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    auth.jwt() ->> 'email' = 'plantsaathiai@gmail.com'
  );

-- Blogs: Public can read published, admins can manage
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published blogs" ON blogs
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage blogs" ON blogs
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    auth.jwt() ->> 'email' = 'plantsaathiai@gmail.com'
  );

-- Functions to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON educational_videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stories_updated_at BEFORE UPDATE ON farmer_stories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_updated_at BEFORE UPDATE ON community_gallery
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON blogs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample blog posts (authentic content for Plant Saathi AI)
INSERT INTO blogs (slug, title, excerpt, content, cover_url, category, tags, read_time, status, published_at) VALUES
(
  'ai-disease-detection-accuracy',
  'How AI Disease Detection Achieved >85% Accuracy in Our Pilot',
  'Deep dive into our university pilot testing and the technology behind our disease detection AI.',
  E'# How Plant Saathi AI Achieved >85% Accuracy\n\nOur university pilot program has shown promising results...\n\n## The Technology\n\nWe use convolutional neural networks trained on thousands of crop disease images...\n\n## Pilot Results\n\nIn controlled testing with 500+ images across 15+ common diseases, our model achieved:\n- 87% accuracy on wheat diseases\n- 85% accuracy on rice diseases\n- 83% accuracy on vegetables\n\n*Note: Results are from internal pilot testing and not independently verified yet.*',
  'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=1000',
  'Technology',
  ARRAY['AI', 'Disease Detection', 'Pilot Results'],
  '5 min read',
  'published',
  NOW()
),
(
  'ndvi-satellite-monitoring-guide',
  'Complete Guide to NDVI Satellite Monitoring for Smallholder Farmers',
  'Learn how satellite imagery and NDVI can help you monitor crop health without expensive equipment.',
  E'# NDVI Monitoring for Small Farms\n\n## What is NDVI?\n\nNormalized Difference Vegetation Index (NDVI) uses satellite data to measure plant health...\n\n## How to Use It\n\n1. Connect your field in Plant Saathi\n2. View weekly NDVI maps\n3. Identify problem areas early\n\n## Real Pilot Results\n\nPilot farmers reported detecting stress 1-2 weeks earlier than visual inspection.',
  'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=1000',
  'Farming Tech',
  ARRAY['NDVI', 'Satellite', 'Soil Health'],
  '8 min read',
  'published',
  NOW() - INTERVAL '2 days'
),
(
  'water-management-tips-india',
  'Smart Irrigation: Save 40% Water with AI Scheduling',
  'Step-by-step guide to implementing precision irrigation using Jal Saathi water management.',
  E'# Water Management with Jal Saathi\n\n## The Water Crisis\n\nIndian agriculture uses 80% of freshwater. We need smarter irrigation...\n\n## How Jal Saathi Helps\n\n- Weather-based scheduling\n- Soil moisture estimation\n- Crop-specific recommendations\n\n## Pilot Results\n\nOne Bihar rice farmer reduced water use by 35% while maintaining yield.',
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000',
  'Water Management',
  ARRAY['Irrigation', 'Water Savings', 'Jal Saathi'],
  '7 min read',
  'published',
  NOW() - INTERVAL '5 days'
);

COMMENT ON TABLE educational_videos IS 'Educational video content for farmers';
COMMENT ON TABLE farmer_stories IS 'Success stories from farmers using the platform';
COMMENT ON TABLE community_gallery IS 'User-generated farm photos and updates';
COMMENT ON TABLE blogs IS 'Blog posts and articles for SEO and education';
