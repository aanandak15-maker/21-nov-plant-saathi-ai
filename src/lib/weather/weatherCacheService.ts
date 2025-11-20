/**
 * Weather Cache Service
 * Efficient caching strategy to minimize API calls while keeping data fresh
 * 
 * Cache Strategy:
 * - Current weather: 10-30 minutes
 * - Hourly forecast: 3 hours
 * - Daily forecast: 24 hours
 * - Air quality: 12 hours
 */

import { weatherService, type WeatherData } from '../weatherService';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface WeatherCacheKey {
  type: 'current' | 'hourly' | 'daily' | 'air_quality';
  lat: number;
  lon: number;
}

export class WeatherCacheService {
  private cache: Map<string, CacheEntry<any>> = new Map();
  
  // Cache durations in milliseconds
  private readonly CACHE_DURATIONS = {
    current: 10 * 60 * 1000,      // 10 minutes
    hourly: 3 * 60 * 60 * 1000,   // 3 hours
    daily: 24 * 60 * 60 * 1000,   // 24 hours
    air_quality: 12 * 60 * 60 * 1000, // 12 hours
  };

  /**
   * Get cached weather data or fetch fresh data
   */
  async getWeatherData(
    lat: number,
    lon: number,
    forceRefresh: boolean = false
  ): Promise<WeatherData> {
    const cacheKey = this.generateCacheKey({ type: 'daily', lat, lon });
    
    if (!forceRefresh) {
      const cached = this.getFromCache<WeatherData>(cacheKey);
      if (cached) {
        console.log('📦 Using cached weather data');
        return cached;
      }
    }

    console.log('🌐 Fetching fresh weather data from API');
    const data = await weatherService.getWeatherByCoords(lat, lon);
    this.setCache(cacheKey, data, this.CACHE_DURATIONS.daily);
    
    return data;
  }

  /**
   * Get from cache if not expired
   */
  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now > entry.expiresAt) {
      console.log('⏰ Cache expired, removing entry');
      this.cache.delete(key);
      return null;
    }

    const age = Math.round((now - entry.timestamp) / 1000 / 60);
    console.log(`✅ Cache hit (age: ${age} minutes)`);
    return entry.data;
  }

  /**
   * Set cache entry
   */
  private setCache<T>(key: string, data: T, duration: number): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + duration,
    });
    console.log(`💾 Cached data (expires in ${duration / 1000 / 60} minutes)`);
  }

  /**
   * Generate cache key
   */
  private generateCacheKey(key: WeatherCacheKey): string {
    // Round coordinates to 2 decimal places to group nearby locations
    const lat = Math.round(key.lat * 100) / 100;
    const lon = Math.round(key.lon * 100) / 100;
    return `${key.type}_${lat}_${lon}`;
  }

  /**
   * Clear all cache
   */
  clearCache(): void {
    this.cache.clear();
    console.log('🗑️ Cache cleared');
  }

  /**
   * Clear expired entries
   */
  clearExpired(): void {
    const now = Date.now();
    let cleared = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        cleared++;
      }
    }
    
    if (cleared > 0) {
      console.log(`🗑️ Cleared ${cleared} expired cache entries`);
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    totalEntries: number;
    validEntries: number;
    expiredEntries: number;
    oldestEntry: number | null;
    newestEntry: number | null;
  } {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;
    let oldestTimestamp: number | null = null;
    let newestTimestamp: number | null = null;

    for (const entry of this.cache.values()) {
      if (now > entry.expiresAt) {
        expiredEntries++;
      } else {
        validEntries++;
      }

      if (oldestTimestamp === null || entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
      }
      if (newestTimestamp === null || entry.timestamp > newestTimestamp) {
        newestTimestamp = entry.timestamp;
      }
    }

    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries,
      oldestEntry: oldestTimestamp,
      newestEntry: newestTimestamp,
    };
  }

  /**
   * Preload weather data for multiple fields
   * Useful for batch operations
   */
  async preloadFieldsWeather(fields: Array<{ lat: number; lon: number }>): Promise<void> {
    console.log(`🔄 Preloading weather for ${fields.length} fields...`);
    
    // Group nearby fields to reduce API calls
    const grouped = this.groupNearbyLocations(fields);
    console.log(`📍 Grouped into ${grouped.length} unique locations`);

    // Fetch in parallel with rate limiting
    const batchSize = 5;
    for (let i = 0; i < grouped.length; i += batchSize) {
      const batch = grouped.slice(i, i + batchSize);
      await Promise.all(
        batch.map(({ lat, lon }) => this.getWeatherData(lat, lon))
      );
      
      // Small delay between batches to avoid rate limiting
      if (i + batchSize < grouped.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log('✅ Preload complete');
  }

  /**
   * Group nearby locations (within ~1km)
   */
  private groupNearbyLocations(
    locations: Array<{ lat: number; lon: number }>
  ): Array<{ lat: number; lon: number }> {
    const grouped: Array<{ lat: number; lon: number }> = [];
    const threshold = 0.01; // ~1km

    for (const loc of locations) {
      const existing = grouped.find(
        g => Math.abs(g.lat - loc.lat) < threshold && Math.abs(g.lon - loc.lon) < threshold
      );

      if (!existing) {
        grouped.push(loc);
      }
    }

    return grouped;
  }

  /**
   * Get cache size in bytes (approximate)
   */
  getCacheSize(): number {
    let size = 0;
    for (const entry of this.cache.values()) {
      size += JSON.stringify(entry).length;
    }
    return size;
  }

  /**
   * Check if cache needs cleanup
   */
  needsCleanup(): boolean {
    const stats = this.getCacheStats();
    return stats.expiredEntries > 10 || this.getCacheSize() > 5 * 1024 * 1024; // 5MB
  }
}

// Singleton instance
export const weatherCacheService = new WeatherCacheService();

// Auto-cleanup expired entries every hour
if (typeof window !== 'undefined') {
  setInterval(() => {
    if (weatherCacheService.needsCleanup()) {
      weatherCacheService.clearExpired();
    }
  }, 60 * 60 * 1000); // 1 hour
}
