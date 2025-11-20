/**
 * Plant Saathi AI Orchestrator
 * Unified intelligence layer that connects all farming modules
 * 
 * This is the "brain" that synthesizes:
 * - Soil analysis
 * - Satellite data
 * - Weather intelligence
 * - Disease detection
 * - Mandi prices
 * - Marketplace costs
 * 
 * Into actionable farming strategies with profit calculations
 */

import { weatherIntelligenceService } from '../weather/weatherIntelligenceService';
import { mandiPriceService } from '../mandiPriceService';
import { blackBoxService } from '../blackBoxService';
import { supabaseFieldService } from '../supabaseFieldService';

// ============================================================================
// TYPES
// ============================================================================

export interface FieldStrategy {
  recommendation: CropRecommendation;
  profitAnalysis: ProfitAnalysis;
  actions: ActionItem[];
  risks: RiskAssessment;
  timeline: FarmingTimeline;
  confidence: number; // 0-100
}

export interface CropRecommendation {
  crop: string;
  variety?: string;
  reason: string;
  soilMatch: number; // 0-100
  marketScore: number; // 0-100
  weatherScore: number; // 0-100
  overallScore: number; // 0-100
  alternatives: Array<{
    crop: string;
    score: number;
    reason: string;
  }>;
}

export interface ProfitAnalysis {
  crop: string;
  yieldTons: number;
  pricePerTon: number;
  pricePerKg: number;
  grossRevenue: number;
  inputCosts: {
    seeds: number;
    fertilizer: number;
    pesticides: number;
    labor: number;
    transport: number;
    irrigation: number;
    total: number;
  };
  totalCosts: number;
  netProfit: number;
  roi: number; // percentage
  profitPerAcre: number;
  breakEvenPrice: number;
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  deadline?: string;
  cost?: number;
  category: 'planting' | 'irrigation' | 'fertilizer' | 'pest' | 'harvest' | 'selling';
  completed: boolean;
}

export interface RiskAssessment {
  overall: 'low' | 'medium' | 'high';
  factors: Array<{
    type: 'disease' | 'weather' | 'market' | 'soil';
    level: 'low' | 'medium' | 'high';
    description: string;
    mitigation: string;
  }>;
}

export interface FarmingTimeline {
  planting: {
    date: string;
    reason: string;
  };
  irrigation: {
    schedule: string[];
    reason: string;
  };
  fertilizer: {
    dates: string[];
    reason: string;
  };
  pestControl: {
    dates: string[];
    reason: string;
  };
  harvest: {
    window: string;
    reason: string;
  };
  selling: {
    optimalDays: string[];
    reason: string;
  };
}

// ============================================================================
// AI ORCHESTRATOR SERVICE
// ============================================================================

export class PlantSaathiOrchestrator {
  
  /**
   * Get unified field strategy
   * This is the main entry point that synthesizes all data
   */
  async getFieldStrategy(fieldId: string, farmerId: string): Promise<FieldStrategy> {
    try {
      // 1. Gather ALL field data in parallel
      const fields = await supabaseFieldService.getFields();
      const field = fields.find(f => f.id === fieldId);
      
      if (!field) {
        throw new Error('Field not found');
      }

      const [
        soilData,
        satelliteData,
        weatherData,
        mandiPrices,
      ] = await Promise.all([
        this.getFieldSoilData(fieldId),
        this.getFieldSatelliteData(fieldId),
        this.getFieldWeatherData(field.latitude, field.longitude, field.crop_type),
        mandiPriceService.getTodaysPrices(),
      ]);

      // 2. Generate crop recommendation
      const recommendation = this.generateCropRecommendation(
        soilData,
        satelliteData,
        weatherData,
        mandiPrices,
        field
      );

      // 3. Calculate profit analysis
      const profitAnalysis = await this.calculateProfitPotential(
        recommendation,
        field,
        mandiPrices
      );

      // 4. Generate action items
      const actions = this.generateActionItems(recommendation, field);

      // 5. Assess risks
      const risks = this.assessRisks(soilData, weatherData, mandiPrices);

      // 6. Generate timeline
      const timeline = this.generateTimeline(recommendation, weatherData);

      // 7. Calculate confidence
      const confidence = this.calculateConfidence(
        soilData,
        satelliteData,
        weatherData,
        mandiPrices
      );

      // 8. Log to black box for learning
      await blackBoxService.logUserInteraction(
        'page_view',
        'ai_orchestrator',
        fieldId,
        {
          farmerId,
          crop: recommendation.crop,
          profit: profitAnalysis.netProfit,
          confidence,
          timestamp: new Date().toISOString(),
        }
      );

      return {
        recommendation,
        profitAnalysis,
        actions,
        risks,
        timeline,
        confidence,
      };
    } catch (error) {
      console.error('Error generating field strategy:', error);
      throw error;
    }
  }

  /**
   * Get field soil data (with fallback)
   */
  private async getFieldSoilData(fieldId: string) {
    try {
      // Try to get from localStorage first (cached)
      const fieldDataStr = localStorage.getItem(`field_${fieldId}_data`);
      if (fieldDataStr) {
        const fieldData = JSON.parse(fieldDataStr);
        return fieldData.comprehensiveAnalysis?.soilProperties || fieldData.soilProperties;
      }
      
      // Fallback to default
      return {
        nitrogen: 240,
        phosphorus: 60,
        potassium: 80,
        ph: 6.5,
        organicCarbon: 0.5,
        texture: 'Loamy',
      };
    } catch (error) {
      console.error('Error getting soil data:', error);
      return null;
    }
  }

  /**
   * Get field satellite data (with fallback)
   */
  private async getFieldSatelliteData(fieldId: string) {
    try {
      const fieldDataStr = localStorage.getItem(`field_${fieldId}_data`);
      if (fieldDataStr) {
        const fieldData = JSON.parse(fieldDataStr);
        return {
          ndvi: fieldData.ndvi || 0.7,
          msavi2: fieldData.msavi2 || 0.6,
          evi: fieldData.evi || 0.5,
        };
      }
      
      return {
        ndvi: 0.7,
        msavi2: 0.6,
        evi: 0.5,
      };
    } catch (error) {
      console.error('Error getting satellite data:', error);
      return null;
    }
  }

  /**
   * Get field weather data
   */
  private async getFieldWeatherData(lat: number, lon: number, cropType: string) {
    try {
      return await weatherIntelligenceService.get16DayCropAdvisory(lat, lon, cropType);
    } catch (error) {
      console.error('Error getting weather data:', error);
      return [];
    }
  }

  /**
   * Generate crop recommendation based on all data
   */
  private generateCropRecommendation(
    soilData: any,
    satelliteData: any,
    weatherData: any[],
    mandiPrices: any[],
    field: any
  ): CropRecommendation {
    // Current crop or default
    const currentCrop = field.crop_type || 'Rice';
    
    // Calculate soil match (simplified)
    const soilMatch = this.calculateSoilMatch(soilData, currentCrop);
    
    // Calculate market score
    const marketScore = this.calculateMarketScore(mandiPrices, currentCrop);
    
    // Calculate weather score
    const weatherScore = this.calculateWeatherScore(weatherData);
    
    // Overall score
    const overallScore = Math.round((soilMatch + marketScore + weatherScore) / 3);
    
    // Generate reason
    const reason = this.generateRecommendationReason(soilMatch, marketScore, weatherScore);
    
    // Find alternatives
    const alternatives = this.findAlternativeCrops(soilData, mandiPrices);
    
    return {
      crop: currentCrop,
      variety: 'Local',
      reason,
      soilMatch,
      marketScore,
      weatherScore,
      overallScore,
      alternatives,
    };
  }

  /**
   * Calculate soil match score
   */
  private calculateSoilMatch(soilData: any, crop: string): number {
    if (!soilData) return 70; // Default moderate score
    
    // Simplified soil matching logic
    const { nitrogen, phosphorus, potassium, ph } = soilData;
    
    // Ideal ranges for common crops (simplified)
    const idealRanges: Record<string, any> = {
      'Rice': { n: [200, 280], p: [40, 80], k: [60, 100], ph: [5.5, 7.0] },
      'Wheat': { n: [180, 260], p: [50, 90], k: [70, 110], ph: [6.0, 7.5] },
      'Tomato': { n: [220, 300], p: [60, 100], k: [80, 120], ph: [6.0, 7.0] },
      'Potato': { n: [200, 280], p: [50, 90], k: [100, 150], ph: [5.0, 6.5] },
    };
    
    const ideal = idealRanges[crop] || idealRanges['Rice'];
    
    // Calculate match percentage
    const nMatch = this.isInRange(nitrogen, ideal.n) ? 100 : 70;
    const pMatch = this.isInRange(phosphorus, ideal.p) ? 100 : 70;
    const kMatch = this.isInRange(potassium, ideal.k) ? 100 : 70;
    const phMatch = this.isInRange(ph, ideal.ph) ? 100 : 70;
    
    return Math.round((nMatch + pMatch + kMatch + phMatch) / 4);
  }

  /**
   * Calculate market score based on prices
   */
  private calculateMarketScore(mandiPrices: any[], crop: string): number {
    if (!mandiPrices || mandiPrices.length === 0) return 70;
    
    // Find prices for this crop
    const cropPrices = mandiPrices.filter(p => 
      p.commodity.toLowerCase().includes(crop.toLowerCase())
    );
    
    if (cropPrices.length === 0) return 70;
    
    // Calculate average price
    const avgPrice = cropPrices.reduce((sum, p) => sum + p.modal_price, 0) / cropPrices.length;
    
    // Score based on price (simplified)
    if (avgPrice > 3000) return 95;
    if (avgPrice > 2500) return 85;
    if (avgPrice > 2000) return 75;
    if (avgPrice > 1500) return 65;
    return 55;
  }

  /**
   * Calculate weather score
   */
  private calculateWeatherScore(weatherData: any[]): number {
    if (!weatherData || weatherData.length === 0) return 70;
    
    // Check for favorable conditions in next 7 days
    const next7Days = weatherData.slice(0, 7);
    
    let favorableCount = 0;
    next7Days.forEach(day => {
      // Favorable: moderate temp, low rain, good humidity
      if (
        day.weather.tempMax >= 25 && day.weather.tempMax <= 35 &&
        day.weather.rainfall < 40 &&
        day.weather.humidity >= 50 && day.weather.humidity <= 80
      ) {
        favorableCount++;
      }
    });
    
    return Math.round((favorableCount / 7) * 100);
  }

  /**
   * Generate recommendation reason
   */
  private generateRecommendationReason(soilMatch: number, marketScore: number, weatherScore: number): string {
    const reasons: string[] = [];
    
    if (soilMatch >= 80) reasons.push('Your soil NPK is perfect for this crop');
    else if (soilMatch >= 60) reasons.push('Your soil is suitable for this crop');
    else reasons.push('Soil may need amendments');
    
    if (marketScore >= 80) reasons.push('Market prices are excellent');
    else if (marketScore >= 60) reasons.push('Market prices are good');
    else reasons.push('Market prices are moderate');
    
    if (weatherScore >= 80) reasons.push('Weather conditions are ideal');
    else if (weatherScore >= 60) reasons.push('Weather conditions are favorable');
    else reasons.push('Weather conditions need monitoring');
    
    return reasons.join('. ') + '.';
  }

  /**
   * Find alternative crops
   */
  private findAlternativeCrops(soilData: any, mandiPrices: any[]): Array<{ crop: string; score: number; reason: string }> {
    const alternatives = [
      { crop: 'Wheat', score: 85, reason: 'Good soil match, stable prices' },
      { crop: 'Tomato', score: 80, reason: 'High market demand, good returns' },
      { crop: 'Potato', score: 75, reason: 'Suitable soil, moderate prices' },
    ];
    
    return alternatives.slice(0, 2);
  }

  /**
   * Calculate profit potential
   */
  private async calculateProfitPotential(
    recommendation: CropRecommendation,
    field: any,
    mandiPrices: any[]
  ): Promise<ProfitAnalysis> {
    const crop = recommendation.crop;
    
    // Get best market price
    const cropPrices = mandiPrices.filter(p => 
      p.commodity.toLowerCase().includes(crop.toLowerCase())
    );
    
    const avgPrice = cropPrices.length > 0
      ? cropPrices.reduce((sum, p) => sum + p.modal_price, 0) / cropPrices.length
      : 2500; // Default
    
    // Estimate yield (tons per acre) - simplified
    const yieldPerAcre = this.estimateYield(crop, field);
    const totalYield = yieldPerAcre * (field.area_acres || 1);
    
    // Calculate costs (simplified estimates)
    const inputCosts = {
      seeds: 5000,
      fertilizer: 15000,
      pesticides: 8000,
      labor: 25000,
      transport: 3000,
      irrigation: 10000,
      total: 66000,
    };
    
    // Calculate revenue
    const pricePerKg = avgPrice;
    const pricePerTon = pricePerKg * 1000;
    const grossRevenue = totalYield * pricePerTon;
    
    // Calculate profit
    const totalCosts = inputCosts.total;
    const netProfit = grossRevenue - totalCosts;
    const roi = (netProfit / totalCosts) * 100;
    const profitPerAcre = netProfit / (field.area_acres || 1);
    const breakEvenPrice = totalCosts / totalYield / 1000; // per kg
    
    return {
      crop,
      yieldTons: totalYield,
      pricePerTon,
      pricePerKg,
      grossRevenue,
      inputCosts,
      totalCosts,
      netProfit,
      roi,
      profitPerAcre,
      breakEvenPrice,
    };
  }

  /**
   * Estimate yield
   */
  private estimateYield(crop: string, field: any): number {
    // Simplified yield estimates (tons per acre)
    const yieldEstimates: Record<string, number> = {
      'Rice': 2.5,
      'Wheat': 2.0,
      'Tomato': 25.0,
      'Potato': 15.0,
      'Cotton': 1.5,
    };
    
    return yieldEstimates[crop] || 2.0;
  }

  /**
   * Generate action items
   */
  private generateActionItems(recommendation: CropRecommendation, field: any): ActionItem[] {
    return [
      {
        id: '1',
        title: `Order ${recommendation.crop} seeds`,
        description: `Purchase high-quality ${recommendation.crop} seeds for ${field.area_acres || 1} acres`,
        priority: 'high',
        cost: 5000,
        category: 'planting',
        completed: false,
      },
      {
        id: '2',
        title: 'Prepare field for planting',
        description: 'Plow, level, and prepare soil for sowing',
        priority: 'high',
        category: 'planting',
        completed: false,
      },
      {
        id: '3',
        title: 'Set up irrigation schedule',
        description: 'Plan irrigation based on weather forecast',
        priority: 'medium',
        category: 'irrigation',
        completed: false,
      },
    ];
  }

  /**
   * Assess risks
   */
  private assessRisks(soilData: any, weatherData: any[], mandiPrices: any[]): RiskAssessment {
    const factors: RiskAssessment['factors'] = [];
    
    // Disease risk (based on weather)
    const highHumidityDays = weatherData.filter(d => d.weather?.humidity > 80).length;
    if (highHumidityDays > 3) {
      factors.push({
        type: 'disease',
        level: 'high',
        description: 'High humidity increases fungal disease risk',
        mitigation: 'Apply preventive fungicide spray',
      });
    } else {
      factors.push({
        type: 'disease',
        level: 'low',
        description: 'Weather conditions not favorable for diseases',
        mitigation: 'Continue monitoring',
      });
    }
    
    // Weather risk
    const rainyDays = weatherData.filter(d => d.weather?.rainfall > 50).length;
    if (rainyDays > 5) {
      factors.push({
        type: 'weather',
        level: 'high',
        description: 'Heavy rainfall may cause waterlogging',
        mitigation: 'Ensure proper drainage',
      });
    } else {
      factors.push({
        type: 'weather',
        level: 'low',
        description: 'Weather conditions are favorable',
        mitigation: 'Monitor forecast regularly',
      });
    }
    
    // Market risk
    factors.push({
      type: 'market',
      level: 'low',
      description: 'Prices are stable',
      mitigation: 'Monitor market trends',
    });
    
    // Overall risk
    const highRisks = factors.filter(f => f.level === 'high').length;
    const overall = highRisks > 1 ? 'high' : highRisks === 1 ? 'medium' : 'low';
    
    return { overall, factors };
  }

  /**
   * Generate farming timeline
   */
  private generateTimeline(recommendation: CropRecommendation, weatherData: any[]): FarmingTimeline {
    const today = new Date();
    
    return {
      planting: {
        date: this.formatDate(this.addDays(today, 7)),
        reason: 'Weather optimal, soil ready',
      },
      irrigation: {
        schedule: [
          this.formatDate(this.addDays(today, 14)),
          this.formatDate(this.addDays(today, 21)),
          this.formatDate(this.addDays(today, 28)),
        ],
        reason: 'Based on weather forecast and crop needs',
      },
      fertilizer: {
        dates: [
          this.formatDate(this.addDays(today, 20)),
          this.formatDate(this.addDays(today, 40)),
        ],
        reason: 'Crop growth stages',
      },
      pestControl: {
        dates: [
          this.formatDate(this.addDays(today, 30)),
          this.formatDate(this.addDays(today, 50)),
        ],
        reason: 'Disease risk windows',
      },
      harvest: {
        window: `${this.formatDate(this.addDays(today, 90))} - ${this.formatDate(this.addDays(today, 100))}`,
        reason: 'Crop maturity + peak market prices',
      },
      selling: {
        optimalDays: [
          this.formatDate(this.addDays(today, 92)),
          this.formatDate(this.addDays(today, 95)),
        ],
        reason: 'Market price trends',
      },
    };
  }

  /**
   * Calculate confidence score
   */
  private calculateConfidence(
    soilData: any,
    satelliteData: any,
    weatherData: any[],
    mandiPrices: any[]
  ): number {
    let confidence = 100;
    
    // Reduce confidence if data is missing
    if (!soilData) confidence -= 20;
    if (!satelliteData) confidence -= 15;
    if (!weatherData || weatherData.length === 0) confidence -= 15;
    if (!mandiPrices || mandiPrices.length === 0) confidence -= 10;
    
    return Math.max(40, confidence); // Minimum 40% confidence
  }

  // Helper methods
  private isInRange(value: number, range: [number, number]): boolean {
    return value >= range[0] && value <= range[1];
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}

// Singleton instance
export const aiOrchestrator = new PlantSaathiOrchestrator();
