/**
 * Weather Intelligence Service
 * Advanced agricultural weather analysis and recommendations
 * 
 * Features:
 * - 16-day crop advisory
 * - Hourly spray window finder
 * - Disease risk prediction
 * - Smart irrigation scheduling
 * - Heat/frost alerts
 * - Harvest planning
 */

import { weatherService, type ForecastDay, type CurrentWeather } from '../weatherService';

// ============================================================================
// TYPES
// ============================================================================

export interface SprayWindow {
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // hours
  conditions: {
    windSpeed: number;
    humidity: number;
    temperature: number;
    precipitation: number;
  };
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  recommendation: string;
}

export interface DiseaseRisk {
  disease: string;
  crop: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  probability: number; // 0-100
  peakDays: string[]; // dates when risk is highest
  symptoms: string[];
  preventiveMeasures: string[];
  chemicalControl: string[];
  organicControl: string[];
}

export interface IrrigationSchedule {
  nextIrrigationDate: string;
  skipReason?: string;
  amount: 'light' | 'moderate' | 'heavy';
  timing: string; // e.g., "5-7 AM"
  method: string; // drip, sprinkler, flood
  daysUntilNext: number;
  soilMoistureEstimate: 'dry' | 'moderate' | 'wet';
  evapotranspirationRate: number; // mm/day
  recommendations: string[];
}

export interface CropAdvisory {
  date: string;
  day: string;
  weather: {
    tempMax: number;
    tempMin: number;
    rainfall: number;
    humidity: number;
    windSpeed: number;
  };
  activities: {
    recommended: string[];
    avoid: string[];
    critical: string[];
  };
  alerts: string[];
  sowingWindow?: boolean;
  harvestWindow?: boolean;
}

export interface HeatStressAlert {
  date: string;
  severity: 'moderate' | 'high' | 'extreme';
  maxTemp: number;
  duration: number; // consecutive days
  cropImpact: string[];
  actions: string[];
}

export interface FrostAlert {
  date: string;
  minTemp: number;
  probability: number;
  affectedCrops: string[];
  protectionMeasures: string[];
}

// ============================================================================
// WEATHER INTELLIGENCE SERVICE
// ============================================================================

export class WeatherIntelligenceService {
  
  /**
   * Get hourly spray windows for next 4 days
   * Uses hourly forecast to find optimal spraying times
   */
  async getSprayWindows(lat: number, lon: number): Promise<SprayWindow[]> {
    // Note: This requires hourly forecast API
    // For now, we'll use daily forecast and estimate windows
    const weatherData = await weatherService.getWeatherByCoords(lat, lon);
    const windows: SprayWindow[] = [];

    // Analyze next 4 days
    const next4Days = weatherData.forecast.slice(0, 4);

    next4Days.forEach((day) => {
      // Morning window (6-10 AM)
      const morningWindow = this.evaluateSprayWindow(day, '06:00', '10:00');
      if (morningWindow.quality !== 'poor') {
        windows.push(morningWindow);
      }

      // Evening window (4-7 PM)
      const eveningWindow = this.evaluateSprayWindow(day, '16:00', '19:00');
      if (eveningWindow.quality !== 'poor') {
        windows.push(eveningWindow);
      }
    });

    return windows.sort((a, b) => {
      const qualityScore = { excellent: 4, good: 3, fair: 2, poor: 1 };
      return qualityScore[b.quality] - qualityScore[a.quality];
    });
  }

  /**
   * Evaluate spray window quality
   */
  private evaluateSprayWindow(
    day: ForecastDay,
    startTime: string,
    endTime: string
  ): SprayWindow {
    const conditions = {
      windSpeed: day.wind_speed,
      humidity: day.humidity,
      temperature: (day.temp_max + day.temp_min) / 2,
      precipitation: day.precipitation,
    };

    let quality: 'excellent' | 'good' | 'fair' | 'poor' = 'excellent';
    const issues: string[] = [];

    // Wind check
    if (conditions.windSpeed > 15) {
      quality = 'poor';
      issues.push('Wind too strong (>15 km/h) - spray will drift');
    } else if (conditions.windSpeed > 10) {
      quality = quality === 'excellent' ? 'good' : quality;
      issues.push('Moderate wind - use coarse nozzles');
    }

    // Rain check
    if (conditions.precipitation > 30) {
      quality = 'poor';
      issues.push('Rain likely - spray will wash off');
    } else if (conditions.precipitation > 10) {
      quality = quality === 'excellent' ? 'fair' : quality;
      issues.push('Light rain possible - monitor closely');
    }

    // Humidity check
    if (conditions.humidity < 30) {
      quality = quality === 'excellent' ? 'good' : quality;
      issues.push('Low humidity - spray may evaporate quickly');
    } else if (conditions.humidity > 90) {
      quality = quality === 'excellent' ? 'fair' : quality;
      issues.push('Very high humidity - slow drying');
    }

    // Temperature check
    if (conditions.temperature > 35) {
      quality = quality === 'excellent' ? 'fair' : quality;
      issues.push('High temperature - spray may evaporate');
    }

    const recommendation =
      quality === 'excellent'
        ? `Perfect conditions for spraying! Wind calm, no rain expected.`
        : quality === 'good'
        ? `Good window for spraying. ${issues.join('. ')}.`
        : quality === 'fair'
        ? `Fair conditions. ${issues.join('. ')}. Proceed with caution.`
        : `Not recommended. ${issues.join('. ')}. Wait for better conditions.`;

    const start = new Date(day.date + 'T' + startTime);
    const end = new Date(day.date + 'T' + endTime);
    const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

    return {
      date: day.date,
      startTime,
      endTime,
      duration,
      conditions,
      quality,
      recommendation,
    };
  }

  /**
   * Predict disease risk based on weather patterns
   */
  async predictDiseaseRisk(
    lat: number,
    lon: number,
    cropType: string
  ): Promise<DiseaseRisk[]> {
    const weatherData = await weatherService.getWeatherByCoords(lat, lon);
    const risks: DiseaseRisk[] = [];

    // Analyze weather patterns for disease conditions
    const avgTemp = this.calculateAvgTemp(weatherData.forecast.slice(0, 7));
    const avgHumidity = this.calculateAvgHumidity(weatherData.forecast.slice(0, 7));
    const rainyDays = weatherData.forecast.slice(0, 7).filter(d => d.precipitation > 40).length;

    // Fungal diseases (high humidity + moderate temp)
    if (avgHumidity > 70 && avgTemp >= 20 && avgTemp <= 30) {
      risks.push({
        disease: 'Late Blight',
        crop: cropType,
        riskLevel: avgHumidity > 85 ? 'critical' : 'high',
        probability: Math.min(95, avgHumidity + rainyDays * 5),
        peakDays: this.findHighHumidityDays(weatherData.forecast.slice(0, 7)),
        symptoms: [
          'Water-soaked spots on leaves',
          'White fungal growth on leaf undersides',
          'Brown lesions spreading rapidly',
          'Fruit rot in advanced stages',
        ],
        preventiveMeasures: [
          'Remove infected plant parts immediately',
          'Improve air circulation between plants',
          'Avoid overhead irrigation',
          'Apply mulch to prevent soil splash',
        ],
        chemicalControl: [
          'Mancozeb 75% WP @ 2g/L water',
          'Copper Oxychloride 50% WP @ 3g/L',
          'Metalaxyl + Mancozeb @ 2g/L',
          'Spray every 7-10 days',
        ],
        organicControl: [
          'Neem oil 5ml/L + soap solution',
          'Bordeaux mixture (1%)',
          'Trichoderma spray',
          'Garlic extract spray',
        ],
      });
    }

    // Powdery mildew (moderate humidity + warm)
    if (avgHumidity >= 50 && avgHumidity <= 80 && avgTemp >= 25 && avgTemp <= 35) {
      risks.push({
        disease: 'Powdery Mildew',
        crop: cropType,
        riskLevel: avgTemp > 30 ? 'high' : 'medium',
        probability: Math.min(85, 50 + (avgTemp - 25) * 5),
        peakDays: this.findWarmDays(weatherData.forecast.slice(0, 7)),
        symptoms: [
          'White powdery patches on leaves',
          'Leaves curl and become distorted',
          'Stunted plant growth',
          'Premature leaf drop',
        ],
        preventiveMeasures: [
          'Ensure good air circulation',
          'Avoid excess nitrogen fertilizer',
          'Remove infected leaves',
          'Plant resistant varieties',
        ],
        chemicalControl: [
          'Sulfur 80% WP @ 2g/L',
          'Carbendazim 50% WP @ 1g/L',
          'Propiconazole 25% EC @ 1ml/L',
          'Spray at first sign of disease',
        ],
        organicControl: [
          'Milk spray (1:9 milk:water)',
          'Baking soda solution (5g/L)',
          'Neem oil spray',
          'Potassium bicarbonate',
        ],
      });
    }

    // Bacterial diseases (high humidity + rain)
    if (rainyDays >= 3 && avgHumidity > 80) {
      risks.push({
        disease: 'Bacterial Leaf Spot',
        crop: cropType,
        riskLevel: rainyDays >= 5 ? 'critical' : 'high',
        probability: Math.min(90, 60 + rainyDays * 10),
        peakDays: this.findRainyDays(weatherData.forecast.slice(0, 7)),
        symptoms: [
          'Small water-soaked spots on leaves',
          'Spots turn brown with yellow halo',
          'Leaf yellowing and drop',
          'Fruit spots and cracking',
        ],
        preventiveMeasures: [
          'Use disease-free seeds',
          'Avoid working in wet fields',
          'Remove and destroy infected plants',
          'Rotate crops',
        ],
        chemicalControl: [
          'Streptocycline 500ppm @ 0.5g/L',
          'Copper Hydroxide @ 2g/L',
          'Kasugamycin 3% SL @ 2ml/L',
          'Spray before rain if possible',
        ],
        organicControl: [
          'Copper-based organic fungicides',
          'Pseudomonas fluorescens',
          'Bacillus subtilis spray',
          'Maintain field hygiene',
        ],
      });
    }

    // Pest risks (hot + dry)
    if (avgTemp > 30 && avgHumidity < 50) {
      risks.push({
        disease: 'Aphid & Whitefly Infestation',
        crop: cropType,
        riskLevel: avgTemp > 35 ? 'high' : 'medium',
        probability: Math.min(80, 40 + (avgTemp - 30) * 8),
        peakDays: this.findHotDryDays(weatherData.forecast.slice(0, 7)),
        symptoms: [
          'Curled and yellowing leaves',
          'Sticky honeydew on leaves',
          'Sooty mold growth',
          'Stunted plant growth',
        ],
        preventiveMeasures: [
          'Monitor undersides of leaves daily',
          'Use yellow sticky traps',
          'Encourage natural predators',
          'Avoid water stress',
        ],
        chemicalControl: [
          'Imidacloprid 17.8% SL @ 0.3ml/L',
          'Acetamiprid 20% SP @ 0.2g/L',
          'Thiamethoxam 25% WG @ 0.2g/L',
          'Spray in evening hours',
        ],
        organicControl: [
          'Neem oil 5ml/L',
          'Soap solution spray',
          'Garlic-chili extract',
          'Release ladybugs',
        ],
      });
    }

    return risks.sort((a, b) => b.probability - a.probability);
  }

  /**
   * Generate smart irrigation schedule
   */
  async getIrrigationSchedule(
    lat: number,
    lon: number,
    cropType: string,
    lastIrrigationDate?: string
  ): Promise<IrrigationSchedule> {
    const weatherData = await weatherService.getWeatherByCoords(lat, lon);
    const next7Days = weatherData.forecast.slice(0, 7);

    // Calculate evapotranspiration (simplified)
    const avgTemp = this.calculateAvgTemp(next7Days);
    const avgHumidity = this.calculateAvgHumidity(next7Days);
    const et0 = this.calculateET0(avgTemp, avgHumidity, weatherData.current.wind_speed);

    // Check for upcoming rain
    const upcomingRain = next7Days.find(d => d.precipitation > 40);
    
    if (upcomingRain) {
      const daysUntilRain = next7Days.indexOf(upcomingRain);
      return {
        nextIrrigationDate: upcomingRain.date,
        skipReason: `Rain expected on ${upcomingRain.day} (${upcomingRain.precipitation}% chance). Skip irrigation.`,
        amount: 'light',
        timing: 'Skip - rain expected',
        method: 'Natural rainfall',
        daysUntilNext: daysUntilRain,
        soilMoistureEstimate: 'moderate',
        evapotranspirationRate: et0,
        recommendations: [
          `Rain forecast: ${upcomingRain.precipitation}% on ${upcomingRain.day}`,
          'Save water and money - let nature irrigate',
          'Check soil moisture after rain',
          'Resume irrigation if rain is insufficient (<10mm)',
        ],
      };
    }

    // Determine irrigation timing based on temperature
    const timing = avgTemp > 32 ? '5-7 AM or 6-8 PM' : '6-9 AM';
    
    // Determine amount based on ET and crop stage
    let amount: 'light' | 'moderate' | 'heavy' = 'moderate';
    if (et0 > 7) amount = 'heavy';
    else if (et0 < 4) amount = 'light';

    // Determine method
    const method = avgTemp > 35 ? 'Drip (recommended)' : 'Drip or Sprinkler';

    // Calculate days until next irrigation
    const daysUntilNext = Math.ceil(5 / et0); // Simplified

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextDate = tomorrow.toISOString().split('T')[0];

    return {
      nextIrrigationDate: nextDate,
      amount,
      timing,
      method,
      daysUntilNext: Math.min(daysUntilNext, 3),
      soilMoistureEstimate: 'moderate',
      evapotranspirationRate: et0,
      recommendations: [
        `Apply ${amount} irrigation (${this.getIrrigationAmount(amount, cropType)})`,
        `Best time: ${timing} when evaporation is low`,
        `Use ${method} for water efficiency`,
        `Next irrigation in ${Math.min(daysUntilNext, 3)} days`,
        et0 > 6 ? 'High water loss - increase frequency' : 'Normal water loss',
        'Check soil moisture before irrigating',
      ],
    };
  }

  /**
   * Generate 16-day crop advisory
   */
  async get16DayCropAdvisory(lat: number, lon: number, cropType: string): Promise<CropAdvisory[]> {
    const weatherData = await weatherService.getWeatherByCoords(lat, lon);
    const advisories: CropAdvisory[] = [];

    weatherData.forecast.forEach((day, index) => {
      const activities = this.generateDailyActivities(day, cropType);
      const alerts = this.generateDailyAlerts(day);
      
      advisories.push({
        date: day.date,
        day: day.day,
        weather: {
          tempMax: day.temp_max,
          tempMin: day.temp_min,
          rainfall: day.precipitation,
          humidity: day.humidity,
          windSpeed: day.wind_speed,
        },
        activities,
        alerts,
        sowingWindow: this.isSowingWindow(day),
        harvestWindow: this.isHarvestWindow(day),
      });
    });

    return advisories;
  }

  /**
   * Detect heat stress periods
   */
  async getHeatStressAlerts(lat: number, lon: number): Promise<HeatStressAlert[]> {
    const weatherData = await weatherService.getWeatherByCoords(lat, lon);
    const alerts: HeatStressAlert[] = [];
    
    let consecutiveHotDays = 0;
    let startDate = '';

    weatherData.forecast.forEach((day) => {
      if (day.temp_max >= 35) {
        if (consecutiveHotDays === 0) startDate = day.date;
        consecutiveHotDays++;
      } else {
        if (consecutiveHotDays >= 2) {
          alerts.push(this.createHeatStressAlert(startDate, consecutiveHotDays, day.temp_max));
        }
        consecutiveHotDays = 0;
      }
    });

    return alerts;
  }

  /**
   * Detect frost risk
   */
  async getFrostAlerts(lat: number, lon: number): Promise<FrostAlert[]> {
    const weatherData = await weatherService.getWeatherByCoords(lat, lon);
    const alerts: FrostAlert[] = [];

    weatherData.forecast.slice(0, 7).forEach((day) => {
      if (day.temp_min <= 4) {
        alerts.push({
          date: day.date,
          minTemp: day.temp_min,
          probability: day.temp_min <= 2 ? 90 : 60,
          affectedCrops: ['Potato', 'Tomato', 'Wheat', 'Mustard', 'Peas'],
          protectionMeasures: [
            'Cover crops with plastic sheets before sunset',
            'Light fires or use smoke generators at 4-5 AM',
            'Spray water on plants before sunrise',
            'Use straw mulch for ground protection',
            'Delay irrigation until temperature rises',
          ],
        });
      }
    });

    return alerts;
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private calculateAvgTemp(forecast: ForecastDay[]): number {
    const sum = forecast.reduce((acc, day) => acc + (day.temp_max + day.temp_min) / 2, 0);
    return sum / forecast.length;
  }

  private calculateAvgHumidity(forecast: ForecastDay[]): number {
    const sum = forecast.reduce((acc, day) => acc + day.humidity, 0);
    return sum / forecast.length;
  }

  private calculateET0(temp: number, humidity: number, windSpeed: number): number {
    // Simplified Penman-Monteith equation
    // ET0 in mm/day
    const tempFactor = (temp - 20) * 0.2;
    const humidityFactor = (100 - humidity) * 0.05;
    const windFactor = windSpeed * 0.1;
    
    return Math.max(2, Math.min(10, 4 + tempFactor + humidityFactor + windFactor));
  }

  private getIrrigationAmount(amount: string, cropType: string): string {
    const amounts = {
      light: '20-30mm (2-3 hours drip)',
      moderate: '40-50mm (4-5 hours drip)',
      heavy: '60-80mm (6-8 hours drip)',
    };
    return amounts[amount as keyof typeof amounts] || amounts.moderate;
  }

  private findHighHumidityDays(forecast: ForecastDay[]): string[] {
    return forecast.filter(d => d.humidity > 80).map(d => d.date);
  }

  private findWarmDays(forecast: ForecastDay[]): string[] {
    return forecast.filter(d => d.temp_max > 30).map(d => d.date);
  }

  private findRainyDays(forecast: ForecastDay[]): string[] {
    return forecast.filter(d => d.precipitation > 40).map(d => d.date);
  }

  private findHotDryDays(forecast: ForecastDay[]): string[] {
    return forecast.filter(d => d.temp_max > 32 && d.humidity < 50).map(d => d.date);
  }

  private generateDailyActivities(day: ForecastDay, cropType: string): {
    recommended: string[];
    avoid: string[];
    critical: string[];
  } {
    const recommended: string[] = [];
    const avoid: string[] = [];
    const critical: string[] = [];

    // Temperature-based activities
    if (day.temp_max >= 25 && day.temp_max <= 32 && day.precipitation < 20) {
      recommended.push('Fertilizer application');
      recommended.push('Transplanting seedlings');
    }

    if (day.wind_speed < 10 && day.precipitation < 10) {
      recommended.push('Pesticide spraying');
      recommended.push('Fungicide application');
    }

    if (day.humidity < 60 && day.precipitation < 10) {
      recommended.push('Harvesting');
      recommended.push('Grain drying');
    }

    // Avoid activities
    if (day.precipitation > 40) {
      avoid.push('Pesticide/fertilizer application');
      avoid.push('Irrigation');
      critical.push('Clear drainage channels');
    }

    if (day.wind_speed > 15) {
      avoid.push('Spraying operations');
      avoid.push('Drone applications');
    }

    if (day.temp_max > 38) {
      avoid.push('Midday field work');
      critical.push('Emergency irrigation needed');
    }

    return { recommended, avoid, critical };
  }

  private generateDailyAlerts(day: ForecastDay): string[] {
    const alerts: string[] = [];

    if (day.temp_max > 38) alerts.push('🔥 Extreme heat - crop stress risk');
    if (day.temp_min < 10) alerts.push('❄️ Cold weather - frost risk');
    if (day.precipitation > 70) alerts.push('🌧️ Heavy rain - waterlogging risk');
    if (day.humidity > 85) alerts.push('💧 Very high humidity - disease risk');
    if (day.wind_speed > 20) alerts.push('💨 Strong winds - avoid spraying');

    return alerts;
  }

  private isSowingWindow(day: ForecastDay): boolean {
    return (
      day.temp_max >= 20 &&
      day.temp_max <= 35 &&
      day.precipitation < 30 &&
      day.wind_speed < 15
    );
  }

  private isHarvestWindow(day: ForecastDay): boolean {
    return (
      day.humidity < 65 &&
      day.precipitation < 10 &&
      day.wind_speed < 15
    );
  }

  private createHeatStressAlert(
    startDate: string,
    duration: number,
    maxTemp: number
  ): HeatStressAlert {
    const severity: 'moderate' | 'high' | 'extreme' =
      maxTemp > 42 ? 'extreme' : maxTemp > 38 ? 'high' : 'moderate';

    return {
      date: startDate,
      severity,
      maxTemp,
      duration,
      cropImpact: [
        'Reduced photosynthesis',
        'Flower/fruit drop',
        'Leaf scorching',
        'Reduced yield',
      ],
      actions: [
        'Irrigate early morning (5-6 AM)',
        'Apply light irrigation in evening',
        'Mulch to reduce soil temperature',
        'Spray Kaolin clay or anti-transpirants',
        'Provide shade for young plants',
      ],
    };
  }
}

// Singleton instance
export const weatherIntelligenceService = new WeatherIntelligenceService();
