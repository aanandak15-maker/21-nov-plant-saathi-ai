# Supabase Content Migration Guide

This guide will help you migrate from localStorage to Supabase for professional content management.

## 📋 Prerequisites

- Supabase account and project set up
- Admin access (plantsaathiai@gmail.com logged in)
- Existing localStorage data (videos, stories, gallery)

## 🚀 Step-by-Step Migration

### Step 1: Run SQL Migration in Supabase

1. Open your Supabase dashboard
2. Go to **SQL Editor**
3. Copy the entire contents of `supabase/migrations/create_content_tables.sql`
4. Paste and run the SQL
5. Verify tables were created:
   - `educational_videos`
   - `farmer_stories`
   - `community_gallery`
   - `blogs`

**What this does:**
- Creates 4 tables with proper schema
- Sets up Row Level Security (RLS) policies
- Creates indexes for performance
- Adds 3 sample blog posts
- Sets up auto-update triggers

### Step 2: Verify Sample Blog Content

After running the SQL migration, check if sample blogs were inserted:

1. Go to Supabase Dashboard → Table Editor
2. Open `blogs` table
3. You should see 3 blog posts:
   - "How AI Disease Detection Achieved >85% Accuracy"
   - "Complete Guide to NDVI Satellite Monitoring"
   - "Smart Irrigation: Save 40% Water"

### Step 3: Migrate LocalStorage Data (If Exists)

If you have existing demo content in localStorage:

1. Open your app in browser (http://localhost:5174)
2. Login as admin (plantsaathiai@gmail.com)
3. Open Browser Console (F12)
4. Run: `migrateToSupabase()`
5. Wait for confirmation message
6. Verify data in Supabase dashboard

**What gets migrated:**
- Educational videos → `educational_videos` table
- Farmer stories → `farmer_stories` table
- Community gallery → `community_gallery` table

### Step 4: Clear LocalStorage (After Verification)

Once you've verified the Supabase data is correct:

1. In browser console, run: `clearLocalStorageContent()`
2. Confirm the action
3. Reload the app - it should now fetch from Supabase

### Step 5: Test the Integration

**Test Blog Page:**
1. Navigate to `/blog`
2. Should see 3 sample blog posts
3. Category filtering should work
4. Click on a post (views increment)

**Test Educational Videos:**
1. Go to Dashboard
2. Scroll to "Learn Something New" section
3. Should see videos from Supabase
4. Click a video (views increment)

## 📊 Database Schema

### `educational_videos`
```sql
id (uuid)
title (text)
title_hi, title_bn (text, nullable)
description (text)
description_hi, description_bn (text, nullable)
youtube_id (text)
thumbnail_url (text, nullable)
duration (text, nullable)
category (text)
views (integer)
status (text: draft|published|archived)
created_at, updated_at (timestamptz)
```

### `farmer_stories`
```sql
id (uuid)
farmer_name (text)
location (text)
achievement (text)
achievement_hi, achievement_bn (text, nullable)
image_url (text, nullable)
yield_increase (decimal)
crop_type (text, nullable)
status (text: draft|published|archived)
created_at, updated_at (timestamptz)
```

### `community_gallery`
```sql
id (uuid)
user_id (uuid, references auth.users)
image_url (text)
caption, caption_hi, caption_bn (text, nullable)
category (text, nullable)
likes (integer)
location (text, nullable)
status (text: pending|published|rejected)
created_at, updated_at (timestamptz)
```

### `blogs`
```sql
id (uuid)
slug (text, unique)
title (text)
excerpt (text)
content (text, markdown)
cover_url (text, nullable)
author_name (text)
category (text)
tags (text[])
read_time (text, nullable)
views (integer)
status (text: draft|published|archived)
published_at (timestamptz, nullable)
created_at, updated_at (timestamptz)
```

## 🔐 Security Policies (RLS)

**Public Users Can:**
- Read published videos, stories, blogs, gallery
- Insert their own gallery posts (requires auth)

**Admin Users Can:**
- Create, read, update, delete ALL content
- Approve/reject gallery posts
- Publish/unpublish content

**Admin Emails:**
- plantsaathiai@gmail.com

## 🎨 Content Management

### Adding New Blog Posts

**Via Supabase Dashboard:**
1. Go to Table Editor → `blogs`
2. Insert new row
3. Required fields:
   - `slug` (unique URL slug)
   - `title`
   - `excerpt`
   - `content` (markdown)
   - `category`
   - `status` = 'published'
   - `published_at` = NOW()

**Recommended Categories:**
- Farming Tech
- Success Stories
- Market Insights
- Water Management
- Crop Planning
- Technology

### Adding Educational Videos

1. Go to Table Editor → `educational_videos`
2. Insert new row
3. Required fields:
   - `title` (+ title_hi, title_bn for translations)
   - `description` (+ description_hi, description_bn)
   - `youtube_id` (YouTube video ID)
   - `category`
   - `status` = 'published'

### Adding Farmer Stories

1. Go to Table Editor → `farmer_stories`
2. Insert new row
3. Required fields:
   - `farmer_name`
   - `location`
   - `achievement` (+ achievement_hi, achievement_bn)
   - `crop_type`
   - `status` = 'published'

## 🐛 Troubleshooting

### Migration fails with "permission denied"

**Solution:** Make sure you're logged in as admin (plantsaathiai@gmail.com)

### Blog page shows "No articles found"

**Solution:**
1. Check Supabase → `blogs` table
2. Ensure `status` = 'published'
3. Ensure `published_at` is set

### Videos not loading

**Solution:**
1. Check Supabase → `educational_videos` table
2. Ensure `status` = 'published'
3. Check browser console for errors
4. Verify Supabase URL and ANON_KEY in `.env`

### RLS policies blocking reads

**Solution:**
1. Check if policies were created in SQL migration
2. Run this query to verify:
```sql
SELECT * FROM pg_policies WHERE tablename IN ('blogs', 'educational_videos', 'farmer_stories', 'community_gallery');
```

## 📝 Next Steps

1. ✅ Run SQL migration
2. ✅ Verify sample content
3. ✅ Migrate localStorage (if needed)
4. ✅ Test blog page
5. ✅ Test videos component
6. 🔜 Add more authentic blog posts
7. 🔜 Upload real educational videos
8. 🔜 Collect real farmer testimonials
9. 🔜 Build admin panel for content management

## 🆘 Need Help?

If you encounter issues:
1. Check browser console for errors
2. Check Supabase logs (Dashboard → Logs)
3. Verify RLS policies are active
4. Ensure admin email is correct in policies

---

**Files Created:**
- `supabase/migrations/create_content_tables.sql` - Database schema
- `src/lib/contentService.ts` - API service layer
- `src/lib/migrateToSupabase.ts` - Migration utility
- Updated `src/pages/BlogPage.tsx` - Real Supabase integration
- Updated `src/components/dashboard/EducationalVideos.tsx` - Real Supabase integration
