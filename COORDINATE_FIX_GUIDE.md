# 🎯 Field Coordinate Fix Guide

## Problem Identified

Your existing fields ("hgc" and "anand") have coordinates set to `0.0000°N, 0.0000°E`, which prevents satellite data from loading correctly.

## Solution Steps

### Step 1: Run SQL Fix in Supabase

1. Open your Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to your project
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy and paste the SQL from `fix-field-coordinates.sql`
6. Click **Run** or press `Ctrl/Cmd + Enter`

### Step 2: Verify the Fix

Run the test script to verify coordinates are updated:

```bash
node test-coordinate-fix.js
```

Expected output:
```
✅ Found 2 fields:

✅ Field 1: hgc
   Coordinates: 28.3670°N, 77.5673°E
   Location: Dankaur, Uttar Pradesh, India
   Crop: Soybean, Size: 0.61 ha

✅ Field 2: anand
   Coordinates: 28.3670°N, 77.5673°E
   Location: Dankaur, Uttar Pradesh, India
   Crop: Soybean, Size: 0.61 ha
```

### Step 3: Test Satellite Data in Live App

1. Open your app: https://plant-saathi-ai.vercel.app/
2. Navigate to **Soil Saathi** section
3. Click on the "hgc" field
4. Click **"Fetch Real Satellite Data Now"** button
5. Wait 5-10 seconds for data to load

Expected result:
- ✅ Button changes from "Fetching..." to "Fetch Real Satellite Data Now"
- ✅ Vegetation indices (NDVI, MSAVI2, etc.) show real values
- ✅ Satellite imagery loads on the map
- ✅ No more "Analyzing Data" status

### Step 4: Clear Browser Cache (Optional)

If satellite data still doesn't load:

1. Open browser DevTools (F12)
2. Go to **Application** tab
3. Click **Clear storage**
4. Check all boxes
5. Click **Clear site data**
6. Refresh the page

## Alternative: Create New Fields with Correct Coordinates

If you prefer to start fresh:

1. Navigate to **Soil Saathi**
2. Click **"Add New Field"**
3. The map will automatically detect your location (Dankaur, UP)
4. Draw your field boundary on the map
5. Fill in field details
6. Click **Save**

The new field will have correct coordinates from the start!

## Technical Details

### Why This Happened

The fields were likely created during testing before the location detection was fully implemented. The default coordinates (0, 0) point to the Gulf of Guinea in the Atlantic Ocean, where no agricultural satellite data exists.

### What the Fix Does

1. Updates latitude to `28.3670` (Dankaur, Uttar Pradesh)
2. Updates longitude to `77.5673` (Dankaur, Uttar Pradesh)
3. Sets location string to "Dankaur, Uttar Pradesh, India"
4. Clears cached satellite data to force fresh fetch

### Satellite Data Sources

Your app uses multiple satellite data sources:
- **NASA MODIS**: Primary source for vegetation indices
- **Sentinel Hub**: Backup for high-resolution imagery
- **Google Earth Engine**: Advanced analytics (when available)

All sources require valid coordinates within agricultural regions.

## Troubleshooting

### Issue: SQL query fails with "permission denied"

**Solution**: Make sure you're logged into Supabase with the correct account (justfun2842@gmail.com)

### Issue: Test script shows "Not authenticated"

**Solution**: This is normal. The script will still show field data if RLS policies allow it.

### Issue: Satellite data still shows "Analyzing Data"

**Solution**: 
1. Clear the field_data_cache table in Supabase
2. Wait 24 hours for fresh satellite data to be available
3. Check that your NASA API key is valid in `.env`

### Issue: Map doesn't show satellite imagery

**Solution**:
1. Check browser console for errors
2. Verify Google Maps API key is valid
3. Try switching between Map/Satellite view

## Success Indicators

✅ Fields show coordinates other than 0.0000°N, 0.0000°E
✅ "Fetch Real Satellite Data Now" button works without errors
✅ NDVI and other indices show values between -1 and 1
✅ Satellite imagery appears on the map
✅ No console errors related to coordinates

## Next Steps After Fix

1. **Test all fields**: Verify satellite data loads for both "hgc" and "anand"
2. **Check dashboard**: Critical alerts should update with real data
3. **Test recommendations**: Marketplace should show location-based products
4. **Monitor performance**: Satellite data should refresh daily

## Need Help?

If the fix doesn't work:
1. Check browser console for errors
2. Verify Supabase RLS policies allow field updates
3. Ensure NASA API key is valid and has quota remaining
4. Try creating a new field with the "Add New Field" button

---

**Status**: Ready to apply fix
**Estimated time**: 5 minutes
**Risk level**: Low (only updates coordinates, doesn't delete data)
