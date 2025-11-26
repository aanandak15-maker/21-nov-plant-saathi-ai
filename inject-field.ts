
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oislgcwardyvphznqoku.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pc2xnY3dhcmR5dnBoem5xb2t1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMDQ1NTgsImV4cCI6MjA3NzU4MDU1OH0.hJCvKI8Qs4tAkWBa4xKakmQs90xrhdRDQ6MkStiAzKA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function injectField() {
    // 1. Sign in
    const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
        email: 'justfun2842@gmail.com',
        password: '123456789'
    });

    if (authError || !user) {
        console.error('Auth failed:', authError);
        return;
    }

    console.log('Signed in as:', user.id);

    // 2. Create Field
    const field = {
        user_id: user.id,
        name: 'Test Field (Injected)',
        crop_type: 'Rice',
        area: 1.5,
        coordinates: [
            [77.1025, 28.7041],
            [77.1035, 28.7041],
            [77.1035, 28.7051],
            [77.1025, 28.7051],
            [77.1025, 28.7041]
        ], // Simple square near Delhi
        status: 'active'
    };

    const { data, error } = await supabase
        .from('fields')
        .insert([field])
        .select()
        .single();

    if (error) {
        console.error('Insert failed:', error);
    } else {
        console.log('Field injected successfully:', data);
    }
}

injectField();
