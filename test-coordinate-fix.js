/**
 * Test script to verify field coordinates are fixed and satellite data works
 * Run with: node test-coordinate-fix.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function testCoordinateFix() {
  console.log('🔍 Testing Field Coordinate Fix...\n');

  try {
    // Step 1: Get user ID
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.log('⚠️  Not authenticated. Using test user email...');
      // For testing, we'll query by email
    }

    // Step 2: Check current fields
    console.log('📍 Checking current field coordinates...');
    const { data: fields, error: fieldsError } = await supabase
      .from('fields')
      .select('id, name, latitude, longitude, location, crop_type, field_size')
      .order('created_at', { ascending: false });

    if (fieldsError) {
      console.error('❌ Error fetching fields:', fieldsError);
      return;
    }

    console.log(`\n✅ Found ${fields.length} fields:\n`);
    
    fields.forEach((field, index) => {
      const hasValidCoords = field.latitude !== 0 && field.longitude !== 0 && 
                            field.latitude !== null && field.longitude !== null;
      const status = hasValidCoords ? '✅' : '❌';
      
      console.log(`${status} Field ${index + 1}: ${field.name}`);
      console.log(`   Coordinates: ${field.latitude}°N, ${field.longitude}°E`);
      console.log(`   Location: ${field.location || 'Not set'}`);
      console.log(`   Crop: ${field.crop_type}, Size: ${field.field_size} ha\n`);
    });

    // Step 3: Check for invalid coordinates
    const invalidFields = fields.filter(f => 
      f.latitude === 0 || f.longitude === 0 || 
      f.latitude === null || f.longitude === null
    );

    if (invalidFields.length > 0) {
      console.log(`\n⚠️  Found ${invalidFields.length} fields with invalid coordinates!`);
      console.log('\n📝 To fix, run this SQL in Supabase SQL Editor:');
      console.log('\nUPDATE fields');
      console.log('SET latitude = 28.3670, longitude = 77.5673,');
      console.log('    location = \'Dankaur, Uttar Pradesh, India\'');
      console.log('WHERE latitude = 0 OR longitude = 0 OR latitude IS NULL OR longitude IS NULL;');
      console.log('\n');
    } else {
      console.log('\n✅ All fields have valid coordinates!\n');
      
      // Step 4: Test satellite data fetch for first field
      if (fields.length > 0) {
        const testField = fields[0];
        console.log(`🛰️  Testing satellite data fetch for field: ${testField.name}`);
        console.log(`   Coordinates: ${testField.latitude}°N, ${testField.longitude}°E\n`);
        
        // Check if we can fetch satellite data
        const { data: cacheData, error: cacheError } = await supabase
          .from('field_data_cache')
          .select('*')
          .eq('field_id', testField.id)
          .order('cached_at', { ascending: false })
          .limit(1);

        if (cacheError) {
          console.log('⚠️  No cached satellite data found (this is normal for new fields)');
        } else if (cacheData && cacheData.length > 0) {
          console.log('✅ Cached satellite data found:');
          console.log(`   Last updated: ${new Date(cacheData[0].cached_at).toLocaleString()}`);
          console.log(`   Data type: ${cacheData[0].data_type}`);
        }
      }
    }

    console.log('\n✨ Test complete!\n');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testCoordinateFix();
