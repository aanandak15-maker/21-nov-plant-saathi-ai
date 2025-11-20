# 🎯 Coordinate Fix - CORRECTED VERSION

## Issue Found

The SQL error revealed that your `fields` table uses:
- `coordinates` (JSONB array of [lat, lng] pairs) - NOT separate latitude/longitude columns
- `location` (TEXT string for location name)

## Step-by-Step Fix

### Step 1: Diagnose Current State

Run this in Supabase SQL Editor to see what you have:

```sql
-- Check your current fields
SELECT id, name, coordinates, location, crop_type, area, status
FROM fields
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'justfun2842@gmail.com')
ORDER BY created_at DESC;
```

Look for:
- ❌ `coordinates` that are `null`, `[]`, or contain `0.0000`
- ❌ `location` that says "0.0000°N, 0.0000°E"

### Step 2: Apply the Fix

Copy and run this SQL:

```sql
-- Fix fields with invalid coordinates
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
```

**What this does:**
- Sets coordinates to a small square field in Dankaur (about 100m x 100m)
- Updates location string to "Dankaur, Uttar Pradesh, India"
- Only affects fields with invalid/missing coordinates

### Step 3: Clear Cached Data

```sql
-- Force satellite data refresh
DELETE FROM field_data_cache
WHERE field_id IN (
  SELECT id FROM fields 
  WHERE user_id = (SELECT id FROM auth.users WHERE email = 'justfun2842@gmail.com')
);
```

### Step 4: Verify the Fix

```sql
-- Check that coordinates are now valid
SELECT 
  id, 
  name, 
  coordinates,
  location,
  crop_type,
  area
FROM fields
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'justfun2842@gmail.com')
ORDER BY created_at DESC;
```

You should see:
```
coordinates: [[28.367, 77.5673], [28.368, 77.5673], [28.368, 77.5683], [28.367, 77.5683]]
location: Dankaur, Uttar Pradesh, India
```

## Alternative: Update Specific Fields

If you want to update only specific fields (like "hgc" and "anand"):

```sql
UPDATE fields 
SET 
  coordinates = '[[28.3670, 77.5673], [28.3680, 77.5673], [28.3680, 77.5683], [28.3670, 77.5683]]'::jsonb,
  location = 'Dankaur, Uttar Pradesh, India'
WHERE 
  name IN ('hgc', 'anand')
  AND user_id = (SELECT id FROM auth.users WHERE email = 'justfun2842@gmail.com');
```

## Test in Your App

After running the SQL:

1. Open https://plant-saathi-ai.vercel.app/
2. Go to **Soil Saathi**
3. Click on **"hgc"** field
4. Click **"Fetch Real Satellite Data Now"**
5. Wait 10 seconds

Expected result:
- ✅ Map centers on Dankaur, Uttar Pradesh
- ✅ Field boundary appears on map
- ✅ NDVI and other indices load with real values
- ✅ No more "Analyzing Data" status

## Understanding the Coordinates Format

Your app stores coordinates as a JSONB array of [latitude, longitude] pairs:

```json
[
  [28.3670, 77.5673],  // Point 1 (bottom-left)
  [28.3680, 77.5673],  // Point 2 (bottom-right)
  [28.3680, 77.5683],  // Point 3 (top-right)
  [28.3670, 77.5683]   // Point 4 (top-left)
]
```

This creates a rectangular field boundary that:
- Is located in Dankaur, Uttar Pradesh
- Is approximately 100m x 100m (0.01 hectares)
- Has valid coordinates for satellite data

## Troubleshooting

### If you get "permission denied" error:

Make sure you're logged into Supabase with the correct account.

### If UPDATE returns "0 rows":

Your fields might already have valid coordinates! Run the diagnostic query from Step 1 to check.

### If satellite data still doesn't load:

1. Check browser console for errors
2. Verify NASA API key in your `.env` file
3. Wait 24 hours for fresh satellite data to be available
4. Try creating a new field with "Add New Field" button

## Success Indicators

✅ SQL UPDATE returns "UPDATE 2" (or number of fields fixed)
✅ Coordinates show valid lat/lng values (not 0.0000)
✅ Location shows "Dankaur, Uttar Pradesh, India"
✅ Satellite data loads in the app
✅ NDVI shows values between -1 and 1

---

**Time to fix:** 2 minutes
**Difficulty:** Easy (just copy & paste SQL)
**Impact:** Makes satellite data work! 🎯
