import { supabase } from './supabase';

export interface Blog {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    cover_url?: string;
    author_name: string;
    category: string;
    tags?: string[];
    read_time?: string;
    views: number;
    status: 'draft' | 'published' | 'archived';
    published_at?: string;
    created_at: string;
    updated_at: string;
}

export interface EducationalVideo {
    id: string;
    title: string;
    title_hi?: string;
    title_bn?: string;
    description: string;
    description_hi?: string;
    description_bn?: string;
    youtube_id: string;
    thumbnail_url?: string;
    duration?: string;
    category: string;
    views: number;
    status: 'draft' | 'published' | 'archived';
    created_at: string;
    updated_at: string;
}

export interface FarmerStory {
    id: string;
    farmer_name: string;
    location: string;
    achievement: string;
    achievement_hi?: string;
    achievement_bn?: string;
    image_url?: string;
    yield_increase?: number;
    crop_type?: string;
    status: 'draft' | 'published' | 'archived';
    created_at: string;
    updated_at: string;
}

export interface GalleryPost {
    id: string;
    user_id?: string;
    image_url: string;
    caption?: string;
    caption_hi?: string;
    caption_bn?: string;
    category?: string;
    likes: number;
    location?: string;
    status: 'pending' | 'published' | 'rejected';
    created_at: string;
    updated_at: string;
}

// Blog Services
export const blogService = {
    async getAll(limit = 50): Promise<Blog[]> {
        const { data, error } = await supabase
            .from('blogs')
            .select('*')
            .eq('status', 'published')
            .order('published_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data || [];
    },

    async getBySlug(slug: string): Promise<Blog | null> {
        const { data, error } = await supabase
            .from('blogs')
            .select('*')
            .eq('slug', slug)
            .eq('status', 'published')
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // Not found
            throw error;
        }

        // Increment views
        if (data) {
            await supabase
                .from('blogs')
                .update({ views: data.views + 1 })
                .eq('id', data.id);
        }

        return data;
    },

    async getByCategory(category: string, limit = 20): Promise<Blog[]> {
        const { data, error } = await supabase
            .from('blogs')
            .select('*')
            .eq('category', category)
            .eq('status', 'published')
            .order('published_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data || [];
    },

    async getFeatured(): Promise<Blog | null> {
        const { data, error } = await supabase
            .from('blogs')
            .select('*')
            .eq('status', 'published')
            .order('views', { ascending: false })
            .limit(1)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            throw error;
        }
        return data;
    },

    async create(blog: Omit<Blog, 'id' | 'created_at' | 'updated_at' | 'views'>): Promise<Blog> {
        const { data, error } = await supabase
            .from('blogs')
            .insert(blog)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(id: string, updates: Partial<Blog>): Promise<Blog> {
        const { data, error } = await supabase
            .from('blogs')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('blogs')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    async publish(id: string): Promise<Blog> {
        return this.update(id, { status: 'published', published_at: new Date().toISOString() });
    },

    async unpublish(id: string): Promise<Blog> {
        return this.update(id, { status: 'draft' });
    }
};

// Educational Video Services
export const videoService = {
    async getAll(limit = 50): Promise<EducationalVideo[]> {
        const { data, error } = await supabase
            .from('educational_videos')
            .select('*')
            .eq('status', 'published')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data || [];
    },

    async getByCategory(category: string, limit = 20): Promise<EducationalVideo[]> {
        const { data, error } = await supabase
            .from('educational_videos')
            .select('*')
            .eq('category', category)
            .eq('status', 'published')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data || [];
    },

    async incrementViews(id: string): Promise<void> {
        const { error } = await supabase.rpc('increment_video_views', { video_id: id });
        if (error) console.error('Failed to increment views:', error);
    }
};

// Farmer Stories Services
export const storyService = {
    async getAll(limit = 50): Promise<FarmerStory[]> {
        const { data, error } = await supabase
            .from('farmer_stories')
            .select('*')
            .eq('status', 'published')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data || [];
    }
};

// Community Gallery Services
export const galleryService = {
    async getAll(limit = 50): Promise<GalleryPost[]> {
        const { data, error } = await supabase
            .from('community_gallery')
            .select('*')
            .eq('status', 'published')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data || [];
    },

    async getUserPosts(userId: string, limit = 20): Promise<GalleryPost[]> {
        const { data, error } = await supabase
            .from('community_gallery')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data || [];
    },

    async create(post: Omit<GalleryPost, 'id' | 'created_at' | 'updated_at' | 'likes' | 'status'>): Promise<GalleryPost> {
        const { data, error } = await supabase
            .from('community_gallery')
            .insert({
                ...post,
                status: 'pending' // Requires admin approval
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async approve(id: string): Promise<GalleryPost> {
        const { data, error } = await supabase
            .from('community_gallery')
            .update({ status: 'published' })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async reject(id: string): Promise<GalleryPost> {
        const { data, error } = await supabase
            .from('community_gallery')
            .update({ status: 'rejected' })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('community_gallery')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
