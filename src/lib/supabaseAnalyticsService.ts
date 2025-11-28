import { supabase } from './supabase';
import { blackBoxService } from './blackBoxService';

/**
 * Supabase Analytics Service
 * Syncs BlackBox analytics data to Supabase for persistence and analysis
 */
export const supabaseAnalyticsService = {
  /**
   * Initialize analytics service
   */
  initialize() {
    if (typeof window !== 'undefined') {
      window.addEventListener('blackbox-flush', (event: any) => {
        this.handleBatchSync(event.detail);
      });
    }
  },

  /**
   * Log analytics event to BlackBox (which will buffer and sync)
   */
  async logEvent(eventType: string, eventData: any) {
    try {
      // Log to BlackBox (real-time)
      blackBoxService.logUserInteraction(
        eventType as any,
        'analytics_event',
        undefined,
        eventData
      );

      // We NO LONGER insert directly to Supabase here to avoid write storms.
      // The BlackBoxService will emit 'blackbox-flush' event periodically.
    } catch (error) {
      console.error('Analytics logging error:', error);
    }
  },

  /**
   * Handle batch sync from BlackBox buffer
   */
  async handleBatchSync(logs: any[]) {
    if (!logs || logs.length === 0) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Transform logs to match analytics_events schema
      const events = logs.map(log => ({
        user_id: user?.id || log.userId || null,
        event_type: log.logType || log.interactionType || 'unknown',
        event_data: log,
        created_at: log.timestamp
      }));

      const { error } = await supabase
        .from('analytics_events')
        .insert(events);

      if (error) {
        console.error('Error syncing batch to Supabase:', error);
      } else {
        console.log(`✅ Synced ${events.length} analytics events to Supabase`);
      }
    } catch (error) {
      console.error('Batch sync error:', error);
    }
  },

  /**
   * Get analytics for current user
   */
  async getUserAnalytics(limit = 100) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('analytics_events')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching analytics:', error);
      return [];
    }

    return data || [];
  },

  /**
   * Get analytics summary
   */
  async getAnalyticsSummary() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Get event counts by type
    const { data, error } = await supabase
      .from('analytics_events')
      .select('event_type')
      .eq('user_id', user.id);

    if (error) return null;

    // Count events by type
    const summary = data.reduce((acc: any, event: any) => {
      acc[event.event_type] = (acc[event.event_type] || 0) + 1;
      return acc;
    }, {});

    return summary;
  },

  /**
   * Sync BlackBox data to Supabase (batch operation)
   */
  async syncBlackBoxData() {
    try {
      // Get BlackBox analytics summary
      const blackBoxData = blackBoxService.getAnalyticsSummary();

      if (!blackBoxData) return;

      // Log summary as a single event
      const { error } = await supabase
        .from('analytics_events')
        .insert([{
          event_type: 'blackbox_sync',
          event_data: blackBoxData
        }]);

      if (error) {
        console.error('Batch sync error:', error);
      }
    } catch (error) {
      console.error('BlackBox sync error:', error);
    }
  }
};
