// View Events Service
// Handles tracking content views without locking rows

import { supabase } from './supabase';

interface ViewEventData {
    contentType: 'video' | 'blog' | 'story' | 'gallery';
    contentId: string;
    sessionId?: string;
}

class ViewEventsService {
    private sessionId: string;

    constructor() {
        this.sessionId = this.generateSessionId();
    }

    private generateSessionId(): string {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Track a content view (non-blocking, fire-and-forget)
     */
    async trackView(data: ViewEventData): Promise<void> {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            // Insert view event (non-blocking)
            await supabase.from('view_events').insert({
                content_type: data.contentType,
                content_id: data.contentId,
                user_id: user?.id || null,
                session_id: data.sessionId || this.sessionId,
                ip_address: null, // Could add if needed
                user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : null
            });

            // Don't wait for response, fire and forget
        } catch (error) {
            // Silently fail - view tracking shouldn't break the app
            console.debug('Failed to track view:', error);
        }
    }

    /**
     * Get view count for content (from materialized view)
     */
    async getViewCount(contentType: string, contentId: string): Promise<number> {
        try {
            const { data, error } = await supabase
                .from('content_view_counts')
                .select('view_count')
                .eq('content_type', contentType)
                .eq('content_id', contentId)
                .single();

            if (error) {
                console.debug('View count not available:', error);
                return 0;
            }

            return data?.view_count || 0;
        } catch (error) {
            console.debug('Failed to get view count:', error);
            return 0;
        }
    }

    /**
     * Get view statistics for content
     */
    async getViewStats(contentType: string, contentId: string) {
        try {
            const { data, error } = await supabase
                .from('content_view_counts')
                .select('*')
                .eq('content_type', contentType)
                .eq('content_id', contentId)
                .single();

            if (error) {
                return {
                    view_count: 0,
                    unique_viewers: 0,
                    last_viewed_at: null
                };
            }

            return data;
        } catch (error) {
            return {
                view_count: 0,
                unique_viewers: 0,
                last_viewed_at: null
            };
        }
    }
}

export const viewEventsService = new ViewEventsService();
