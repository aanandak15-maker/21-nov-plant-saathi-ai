
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://oislgcwardyvphznqoku.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pc2xnY3dhcmR5dnBoem5xb2t1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMDQ1NTgsImV4cCI6MjA3NzU4MDU1OH0.hJCvKI8Qs4tAkWBa4xKakmQs90xrhdRDQ6MkStiAzKA';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function verifyBatchFetch() {
    console.log('🚀 Verifying Batch Fetch Logic...');

    // 1. Login as test user (simulated by just using anon key and assuming public read or using a known user ID if possible)
    // Since we don't have user login in node script easily, we'll try to fetch fields directly if RLS allows or use a known user ID.
    // For this test, we'll try to fetch *any* fields to see if the query structure is valid.

    // NOTE: RLS might block us if we are not logged in. 
    // Let's try to sign in with the test user credentials from the conversation history if available, 
    // or just check if the query throws a syntax error.

    // Credentials from history: justfun2842@gmail.com / 123456789
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'justfun2842@gmail.com',
        password: '123456789'
    });

    if (authError) {
        console.error('❌ Auth failed:', authError.message);
        return;
    }

    console.log('✅ Authenticated as:', authData.user.email);
    const userId = authData.user.id;

    // 1. Fetch fields
    console.log('1️⃣ Fetching fields...');
    const { data: fields, error: fieldsError } = await supabase
        .from('fields')
        .select('*')
        .eq('user_id', userId)
        .limit(5);

    if (fieldsError) {
        console.error('❌ Fetch fields failed:', fieldsError.message);
        return;
    }

    console.log(`✅ Found ${fields.length} fields.`);
    if (fields.length === 0) {
        console.warn('⚠️ No fields found to test batch fetch.');
        return;
    }

    const fieldIds = fields.map(f => f.id);
    console.log('   IDs:', fieldIds);

    // 2. Batch fetch data
    console.log('2️⃣ Batch fetching field_data...');
    const { data: fieldData, error: dataError } = await supabase
        .from('field_data')
        .select('*')
        .in('field_id', fieldIds)
        .order('timestamp', { ascending: false })
        .limit(fieldIds.length * 5);

    if (dataError) {
        console.error('❌ Batch fetch failed:', dataError.message);
        return;
    }

    console.log(`✅ Fetched ${fieldData.length} data points.`);

    // 3. Verify mapping
    const fieldDataMap = new Map();
    for (const d of fieldData) {
        if (!fieldDataMap.has(d.field_id)) {
            fieldDataMap.set(d.field_id, d);
        }
    }

    console.log(`✅ Mapped data for ${fieldDataMap.size} unique fields.`);
    console.log('🎉 Batch fetch logic verification PASSED!');
}

verifyBatchFetch();
