/**
 * Migration Utility: LocalStorage → Supabase
 * 
 * This script migrates content from localStorage to Supabase tables.
 * Run this in the browser console ONCE after setting up Supabase tables.
 * 
 * Usage:
 * 1. Make sure you're logged in as admin (plantsaathiai@gmail.com)
 * 2. Open browser console
 * 3. Run: migrateToSupabase()
 */

import { supabase } from './supabase';

interface LocalStorageVideo {
    id: string;
    title: string;
    titleHi?: string;
    titleBn?: string;
    description: string;
    descriptionHi?: string;
    descriptionBn?: string;
    youtubeId: string;
    thumbnail?: string;
    duration?: string;
    category: string;
    views?: number;
    addedAt: string;
}

interface LocalStorageStory {
    id: string;
    farmerName: string;
    location: string;
    achievement: string;
    achievementHi?: string;
    achievementBn?: string;
    imageUrl?: string;
    yieldIncrease?: number;
    cropType?: string;
    addedAt: string;
}

interface LocalStorageGallery {
    id: string;
    imageUrl: string;
    caption?: string;
    captionHi?: string;
    captionBn?: string;
    category?: string;
    likes?: number;
    comments?: number;
    location?: string;
    addedAt: string;
}

export async function migrateToSupabase() {
    console.log('🚀 Starting migration from localStorage to Supabase...\n');

    try {
        // Check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            console.error('❌ You must be logged in to run migration');
            return;
        }

        let totalMigrated = 0;

        // 1. Migrate Videos
        const videosRaw = localStorage.getItem('educational_videos');
        if (videosRaw) {
            const videos: LocalStorageVideo[] = JSON.parse(videosRaw);
            console.log(`📹 Found ${videos.length} videos in localStorage`);

            const videoData = videos.map(v => ({
                title: v.title,
                title_hi: v.titleHi,
                title_bn: v.titleBn,
                description: v.description,
                description_hi: v.descriptionHi,
                description_bn: v.descriptionBn,
                youtube_id: v.youtubeId,
                thumbnail_url: v.thumbnail,
                duration: v.duration,
                category: v.category,
                views: v.views || 0,
                status: 'published' as const,
                created_at: v.addedAt
            }));

            const { data, error } = await supabase
                .from('educational_videos')
                .insert(videoData)
                .select();

            if (error) {
                console.error('❌ Failed to migrate videos:', error.message);
            } else {
                console.log(`✅ Migrated ${data?.length || 0} videos`);
                totalMigrated += data?.length || 0;
            }
        }

        // 2. Migrate Stories
        const storiesRaw = localStorage.getItem('farmer_stories');
        if (storiesRaw) {
            const stories: LocalStorageStory[] = JSON.parse(storiesRaw);
            console.log(`🏆 Found ${stories.length} stories in localStorage`);

            const storyData = stories.map(s => ({
                farmer_name: s.farmerName,
                location: s.location,
                achievement: s.achievement,
                achievement_hi: s.achievementHi,
                achievement_bn: s.achievementBn,
                image_url: s.imageUrl,
                yield_increase: s.yieldIncrease,
                crop_type: s.cropType,
                status: 'published' as const,
                created_at: s.addedAt
            }));

            const { data, error } = await supabase
                .from('farmer_stories')
                .insert(storyData)
                .select();

            if (error) {
                console.error('❌ Failed to migrate stories:', error.message);
            } else {
                console.log(`✅ Migrated ${data?.length || 0} stories`);
                totalMigrated += data?.length || 0;
            }
        }

        // 3. Migrate Gallery
        const galleryRaw = localStorage.getItem('community_gallery');
        if (galleryRaw) {
            const gallery: LocalStorageGallery[] = JSON.parse(galleryRaw);
            console.log(`🖼️ Found ${gallery.length} gallery posts in localStorage`);

            const galleryData = gallery.map(g => ({
                user_id: user.id, // Assign to current user
                image_url: g.imageUrl,
                caption: g.caption,
                caption_hi: g.captionHi,
                caption_bn: g.captionBn,
                category: g.category,
                likes: g.likes || 0,
                location: g.location,
                status: 'published' as const,
                created_at: g.addedAt
            }));

            const { data, error } = await supabase
                .from('community_gallery')
                .insert(galleryData)
                .select();

            if (error) {
                console.error('❌ Failed to migrate gallery:', error.message);
            } else {
                console.log(`✅ Migrated ${data?.length || 0} gallery posts`);
                totalMigrated += data?.length || 0;
            }
        }

        console.log(`\n🎉 Migration complete! Total items migrated: ${totalMigrated}`);
        console.log('\n⚠️ IMPORTANT: You should now:');
        console.log('1. Verify the data in Supabase dashboard');
        console.log('2. Clear localStorage if migration was successful');
        console.log('3. Run: clearLocalStorageContent() to remove old data\n');

        return { success: true, totalMigrated };

    } catch (error) {
        console.error('❌ Migration failed:', error);
        return { success: false, error };
    }
}

export function clearLocalStorageContent() {
    const confirmed = confirm(
        'Are you sure you want to clear localStorage content?\n\n' +
        'Make sure you have verified the Supabase migration first!\n\n' +
        'This will remove:\n' +
        '- educational_videos\n' +
        '- farmer_stories\n' +
        '- community_gallery'
    );

    if (!confirmed) {
        console.log('❌ Cancelled');
        return;
    }

    localStorage.removeItem('educational_videos');
    localStorage.removeItem('farmer_stories');
    localStorage.removeItem('community_gallery');

    console.log('✅ LocalStorage content cleared');
}

// Expose functions globally for console use
if (typeof window !== 'undefined') {
    (window as any).migrateToSupabase = migrateToSupabase;
    (window as any).clearLocalStorageContent = clearLocalStorageContent;
    console.log('💡 Migration tools loaded. Run these commands:');
    console.log('  - migrateToSupabase() : Migrate localStorage → Supabase');
    console.log('  - clearLocalStorageContent() : Clear old localStorage data');
}
