
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    'https://oislgcwardyvphznqoku.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pc2xnY3dhcmR5dnBoem5xb2t1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMDQ1NTgsImV4cCI6MjA3NzU4MDU1OH0.hJCvKI8Qs4tAkWBa4xKakmQs90xrhdRDQ6MkStiAzKA'
);

async function createField() {
    console.log('Authenticating...');

    // Try to sign in
    let { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
        email: 'testuser@example.com',
        password: 'password123'
    });

    if (authError) {
        console.log('Sign in failed, trying to sign up...', authError.message);
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: 'testuser@example.com',
            password: 'password123'
        });

        if (signUpError) {
            console.error('Sign up failed:', signUpError.message);
            return;
        }
        user = signUpData.user;
    }

    if (!user) {
        console.error('No user found');
        return;
    }

    console.log('User authenticated:', user.id);

    // Create Field
    // 1 acre = 0.404686 hectares
    // Coordinates around 28.345010, 77.564721
    const coordinates = [
        [77.5644, 28.3453], // lng, lat
        [77.5650, 28.3453],
        [77.5650, 28.3447],
        [77.5644, 28.3447],
        [77.5644, 28.3453] // Close loop
    ];

    const field = {
        user_id: user.id,
        name: 'Test Wheat Field',
        crop_type: 'Wheat',
        area: 0.404686,
        coordinates: coordinates,
        status: 'active',
        lifecycle_metadata: { sowing_date: '2025-11-10' }
    };

    console.log('Inserting field...', field);

    const { data, error } = await supabase
        .from('fields')
        .insert([field])
        .select();

    if (error) {
        console.error('Error inserting field:', error.message);
    } else {
        console.log('Field inserted successfully:', data);
    }
}

createField();
