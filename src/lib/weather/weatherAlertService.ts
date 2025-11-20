/**
 * Weather Alert Service
 * Smart notification system for critical weather events
 * 
 * Features:
 * - Rain alerts (with lead time)
 * - Heat stress warnings
 * - Frost alerts
 * - Spray window notifications
 * - Disease risk alerts
 * - Irrigation reminders
 * 
 * Alert Rules:
 * - Only notify on meaningful changes
 * - Avoid alert spam
 * - Prioritize critical alerts
 * - Include actionable advice
 */

import { weatherIntelligenceService } from './weatherIntelligenceService';
import { weatherCacheService } from './weatherCacheService';
import type { ForecastDay } from '../weatherService';

export interface WeatherAlert {
  id: string;
  type: 'rain' | 'heat' | 'frost' | 'spray' | 'disease' | 'irrigation' | 'wind' | 'humidity';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  actions: string[];
  validUntil: string;
  createdAt: number;
  fieldId?: string;
  coordinates?: { lat: number; lon: number };
}

interface AlertThresholds {
  rain: {
    minProbability: number;
    minAmount: number;
    leadTimeHours: number;
  };
  heat: {
    minTemp: number;
    consecutiveDays: number;
  };
  frost: {
    maxTemp: number;
    leadTimeHours: number;
  };
  wind: {
    maxSpeed: number;
  };
  humidity: {
    minForDisease: number;
    maxForSpray: number;
  };
}

export class WeatherAlertService {
  private sentAlerts: Map<string, number> = new Map(); // alertId -> timestamp
  private readonly ALERT_COOLDOWN = 6 * 60 * 60 * 1000; // 6 hours

  private readonly thresholds: AlertThresholds = {
    rain: {
      minProbability: 40,
      minAmount: 5,
      leadTimeHours: 48,
    },
    heat: {
      minTemp: 35,
      consecutiveDays: 2,
    },
    frost: {
      maxTemp: 4,
      leadTimeHours: 48,
    },
    wind: {
      maxSpeed: 15,
    },
    humidity: {
      minForDisease: 80,
      maxForSpray: 90,
    },
  };

  /**
   * Check for all weather alerts for a field
   */
  async checkFieldAlerts(
    fieldId: string,
    lat: number,
    lon: number,
    cropType: string
  ): Promise<WeatherAlert[]> {
    const alerts: WeatherAlert[] = [];

    try {
      // Get weather data (cached)
      const weatherData = await weatherCacheService.getWeatherData(lat, lon);

      // Check various alert conditions
      alerts.push(...this.checkRainAlerts(weatherData.forecast, fieldId, { lat, lon }));
      alerts.push(...this.checkHeatAlerts(weatherData.forecast, fieldId, { lat, lon }));
      alerts.push(...this.checkFrostAlerts(weatherData.forecast, fieldId, { lat, lon }));
      alerts.push(...this.checkWindAlerts(weatherData.forecast, fieldId, { lat, lon }));
      alerts.push(...this.checkHumidityAlerts(weatherData.forecast, fieldId, { lat, lon }));

      // Check spray windows
      const sprayAlert = await this.checkSprayWindowAlert(lat, lon, fieldId);
      if (sprayAlert) alerts.push(sprayAlert);

      // Check disease risks
      const diseaseAlerts = await this.checkDiseaseAlerts(lat, lon, cropType, fieldId);
      alerts.push(...diseaseAlerts);

      // Check irrigation needs
      const irrigationAlert = await this.checkIrrigationAlert(lat, lon, cropType, fieldId);
      if (irrigationAlert) alerts.push(irrigationAlert);

      // Filter out alerts that were recently sent
      const filteredAlerts = alerts.filter(alert => !this.wasRecentlySent(alert.id));

      // Mark alerts as sent
      filteredAlerts.forEach(alert => this.markAsSent(alert.id));

      return filteredAlerts.sort((a, b) => {
        const severityOrder = { critical: 3, warning: 2, info: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      });
    } catch (error) {
      console.error('Error checking weather alerts:', error);
      return [];
    }
  }

  /**
   * Check for rain alerts
   */
  private checkRainAlerts(
    forecast: ForecastDay[],
    fieldId: string,
    coords: { lat: number; lon: number }
  ): WeatherAlert[] {
    const alerts: WeatherAlert[] = [];
    const next48Hours = forecast.slice(0, 2);

    for (const day of next48Hours) {
      if (day.precipitation >= this.thresholds.rain.minProbability) {
        const severity: 'info' | 'warning' | 'critical' =
          day.precipitation > 70 ? 'critical' : day.precipitation > 50 ? 'warning' : 'info';

        const actions =
          day.precipitation > 70
            ? [
                'Clear drainage channels immediately',
                'Harvest ripe vegetables today',
                'Skip irrigation for next 3 days',
                'Apply fungicide after rain stops',
                'Check for waterlogging',
              ]
            : day.precipitation > 50
            ? [
                'Postpone pesticide/fertilizer application',
                'Harvest ready crops if possible',
                'Skip irrigation',
                'Prepare drainage',
              ]
            : [
                'Hold fertilizer application',
                'Spray early morning if needed',
                'Monitor weather updates',
              ];

        alerts.push({
          id: `rain_${fieldId}_${day.date}`,
          type: 'rain',
          severity,
          title: `${day.precipitation}% Rain Chance - ${day.day}`,
          message: `Rain expected on ${day.day}. ${
            day.precipitation > 70
              ? 'Heavy rainfall likely - take immediate action!'
              : day.precipitation > 50
              ? 'Moderate rain expected - prepare your field.'
              : 'Light rain possible - plan accordingly.'
          }`,
          actions,
          validUntil: day.date,
          createdAt: Date.now(),
          fieldId,
          coordinates: coords,
        });
      }
    }

    return alerts;
  }

  /**
   * Check for heat stress alerts
   */
  private checkHeatAlerts(
    forecast: ForecastDay[],
    fieldId: string,
    coords: { lat: number; lon: number }
  ): WeatherAlert[] {
    const alerts: WeatherAlert[] = [];
    let consecutiveHotDays = 0;

    for (const day of forecast.slice(0, 7)) {
      if (day.temp_max >= this.thresholds.heat.minTemp) {
        consecutiveHotDays++;
      } else {
        consecutiveHotDays = 0;
      }

      if (consecutiveHotDays >= this.thresholds.heat.consecutiveDays) {
        const severity: 'warning' | 'critical' = day.temp_max > 40 ? 'critical' : 'warning';

        alerts.push({
          id: `heat_${fieldId}_${day.date}`,
          type: 'heat',
          severity,
          title: `Heat Alert: ${day.temp_max}°C on ${day.day}`,
          message: `${consecutiveHotDays} consecutive hot days (>${this.thresholds.heat.minTemp}°C). Crops under heat stress!`,
          actions: [
            'Irrigate early morning (5-6 AM)',
            'Apply light evening irrigation',
            'Mulch to reduce soil temperature',
            'Spray anti-transpirants if available',
            'Provide shade for young plants',
          ],
          validUntil: day.date,
          createdAt: Date.now(),
          fieldId,
          coordinates: coords,
        });
        break; // Only one heat alert per check
      }
    }

    return alerts;
  }

  /**
   * Check for frost alerts
   */
  private checkFrostAlerts(
    forecast: ForecastDay[],
    fieldId: string,
    coords: { lat: number; lon: number }
  ): WeatherAlert[] {
    const alerts: WeatherAlert[] = [];
    const next48Hours = forecast.slice(0, 2);

    for (const day of next48Hours) {
      if (day.temp_min <= this.thresholds.frost.maxTemp) {
        alerts.push({
          id: `frost_${fieldId}_${day.date}`,
          type: 'frost',
          severity: 'critical',
          title: `Frost Risk: ${day.temp_min}°C on ${day.day}`,
          message: `Temperature dropping to ${day.temp_min}°C. Frost damage possible!`,
          actions: [
            'Cover crops with plastic sheets before sunset',
            'Light fires or use smoke generators at 4-5 AM',
            'Spray water on plants before sunrise',
            'Use straw mulch for ground protection',
            'Delay irrigation until temperature rises',
          ],
          validUntil: day.date,
          createdAt: Date.now(),
          fieldId,
          coordinates: coords,
        });
      }
    }

    return alerts;
  }

  /**
   * Check for wind alerts
   */
  private checkWindAlerts(
    forecast: ForecastDay[],
    fieldId: string,
    coords: { lat: number; lon: number }
  ): WeatherAlert[] {
    const alerts: WeatherAlert[] = [];
    const next2Days = forecast.slice(0, 2);

    for (const day of next2Days) {
      if (day.wind_speed > this.thresholds.wind.maxSpeed) {
        alerts.push({
          id: `wind_${fieldId}_${day.date}`,
          type: 'wind',
          severity: day.wind_speed > 25 ? 'warning' : 'info',
          title: `Windy Conditions: ${day.wind_speed} km/h`,
          message: `Strong winds expected on ${day.day}. Avoid spraying operations.`,
          actions: [
            'Postpone pesticide spraying',
            'Stake tall plants (tomato, brinjal)',
            'Cover nursery beds',
            'Check for lodging in cereals',
            'Delay drone operations',
          ],
          validUntil: day.date,
          createdAt: Date.now(),
          fieldId,
          coordinates: coords,
        });
      }
    }

    return alerts;
  }

  /**
   * Check for humidity-related alerts
   */
  private checkHumidityAlerts(
    forecast: ForecastDay[],
    fieldId: string,
    coords: { lat: number; lon: number }
  ): WeatherAlert[] {
    const alerts: WeatherAlert[] = [];
    const next3Days = forecast.slice(0, 3);

    const highHumidityDays = next3Days.filter(
      d => d.humidity > this.thresholds.humidity.minForDisease
    );

    if (highHumidityDays.length >= 2) {
      alerts.push({
        id: `humidity_${fieldId}_${highHumidityDays[0].date}`,
        type: 'humidity',
        severity: 'warning',
        title: 'High Humidity Alert',
        message: `Humidity >80% for ${highHumidityDays.length} days. Fungal disease risk!`,
        actions: [
          'Spray Mancozeb (2g/L) preventively',
          'Remove infected leaves immediately',
          'Ensure good air circulation',
          'Avoid overhead irrigation',
          'Monitor crops daily for disease',
        ],
        validUntil: highHumidityDays[highHumidityDays.length - 1].date,
        createdAt: Date.now(),
        fieldId,
        coordinates: coords,
      });
    }

    return alerts;
  }

  /**
   * Check for optimal spray windows
   */
  private async checkSprayWindowAlert(
    lat: number,
    lon: number,
    fieldId: string
  ): Promise<WeatherAlert | null> {
    try {
      const windows = await weatherIntelligenceService.getSprayWindows(lat, lon);
      const excellentWindows = windows.filter(w => w.quality === 'excellent');

      if (excellentWindows.length > 0) {
        const best = excellentWindows[0];
        return {
          id: `spray_${fieldId}_${best.date}`,
          type: 'spray',
          severity: 'info',
          title: 'Perfect Spray Window Available',
          message: `Excellent conditions for spraying on ${best.date} between ${best.startTime}-${best.endTime}`,
          actions: [
            'Prepare spray equipment',
            'Check chemical inventory',
            'Mix spray solution fresh',
            'Add surfactant for better coverage',
            'Spray during recommended window',
          ],
          validUntil: best.date,
          createdAt: Date.now(),
          fieldId,
          coordinates: { lat, lon },
        };
      }
    } catch (error) {
      console.error('Error checking spray windows:', error);
    }

    return null;
  }

  /**
   * Check for disease risk alerts
   */
  private async checkDiseaseAlerts(
    lat: number,
    lon: number,
    cropType: string,
    fieldId: string
  ): Promise<WeatherAlert[]> {
    const alerts: WeatherAlert[] = [];

    try {
      const risks = await weatherIntelligenceService.predictDiseaseRisk(lat, lon, cropType);
      const highRisks = risks.filter(r => r.riskLevel === 'high' || r.riskLevel === 'critical');

      for (const risk of highRisks.slice(0, 2)) {
        // Max 2 disease alerts
        alerts.push({
          id: `disease_${fieldId}_${risk.disease}`,
          type: 'disease',
          severity: risk.riskLevel === 'critical' ? 'critical' : 'warning',
          title: `${risk.disease} Risk: ${risk.probability}%`,
          message: `High risk of ${risk.disease} in your ${cropType} field. Weather conditions favorable for disease.`,
          actions: risk.preventiveMeasures.slice(0, 5),
          validUntil: risk.peakDays[risk.peakDays.length - 1] || '',
          createdAt: Date.now(),
          fieldId,
          coordinates: { lat, lon },
        });
      }
    } catch (error) {
      console.error('Error checking disease risks:', error);
    }

    return alerts;
  }

  /**
   * Check for irrigation alerts
   */
  private async checkIrrigationAlert(
    lat: number,
    lon: number,
    cropType: string,
    fieldId: string
  ): Promise<WeatherAlert | null> {
    try {
      const schedule = await weatherIntelligenceService.getIrrigationSchedule(
        lat,
        lon,
        cropType
      );

      // Only alert if irrigation is needed soon
      if (schedule.daysUntilNext <= 1 && !schedule.skipReason) {
        return {
          id: `irrigation_${fieldId}_${schedule.nextIrrigationDate}`,
          type: 'irrigation',
          severity: 'info',
          title: 'Irrigation Reminder',
          message: `Time to irrigate your ${cropType} field. ${schedule.amount} irrigation recommended.`,
          actions: schedule.recommendations.slice(0, 5),
          validUntil: schedule.nextIrrigationDate,
          createdAt: Date.now(),
          fieldId,
          coordinates: { lat, lon },
        };
      }

      // Alert if rain is coming (skip irrigation)
      if (schedule.skipReason) {
        return {
          id: `irrigation_skip_${fieldId}_${schedule.nextIrrigationDate}`,
          type: 'irrigation',
          severity: 'info',
          title: 'Skip Irrigation - Rain Expected',
          message: schedule.skipReason,
          actions: schedule.recommendations.slice(0, 5),
          validUntil: schedule.nextIrrigationDate,
          createdAt: Date.now(),
          fieldId,
          coordinates: { lat, lon },
        });
      }
    } catch (error) {
      console.error('Error checking irrigation schedule:', error);
    }

    return null;
  }

  /**
   * Check if alert was recently sent (avoid spam)
   */
  private wasRecentlySent(alertId: string): boolean {
    const lastSent = this.sentAlerts.get(alertId);
    if (!lastSent) return false;

    const timeSince = Date.now() - lastSent;
    return timeSince < this.ALERT_COOLDOWN;
  }

  /**
   * Mark alert as sent
   */
  private markAsSent(alertId: string): void {
    this.sentAlerts.set(alertId, Date.now());
  }

  /**
   * Clear old sent alerts (cleanup)
   */
  clearOldAlerts(): void {
    const now = Date.now();
    for (const [id, timestamp] of this.sentAlerts.entries()) {
      if (now - timestamp > this.ALERT_COOLDOWN * 2) {
        this.sentAlerts.delete(id);
      }
    }
  }

  /**
   * Get alert statistics
   */
  getAlertStats(): {
    totalSent: number;
    recentAlerts: number;
    oldestAlert: number | null;
  } {
    const now = Date.now();
    let recentAlerts = 0;
    let oldestTimestamp: number | null = null;

    for (const timestamp of this.sentAlerts.values()) {
      if (now - timestamp < this.ALERT_COOLDOWN) {
        recentAlerts++;
      }
      if (oldestTimestamp === null || timestamp < oldestTimestamp) {
        oldestTimestamp = timestamp;
      }
    }

    return {
      totalSent: this.sentAlerts.size,
      recentAlerts,
      oldestAlert: oldestTimestamp,
    };
  }
}

// Singleton instance
export const weatherAlertService = new WeatherAlertService();

// Auto-cleanup old alerts every hour
if (typeof window !== 'undefined') {
  setInterval(() => {
    weatherAlertService.clearOldAlerts();
  }, 60 * 60 * 1000); // 1 hour
}
