/**
 * Field Memory Service
 * 
 * Stores and retrieves field-specific AI context for intelligent recommendations
 * Tracks field "personality", successful patterns, and historical performance
 */

import { supabase } from './supabase';

export interface CropRotation {
  sequence: string[];
  successRate: number;
  yieldImprovement: number;
  soilHealth: 'improving' | 'maintaining' | 'depleting';
  pestRisk: 'low' | 'medium' | 'high';
  waterEfficiency: number;
}

export interface FieldPersonality {
  soilType: string;
  microclimate: 'hot_dry' | 'cool_wet' | 'temperate' | 'unknown';
  yieldPotential: number;
  riskProfile: string[];
  preferredCrops: string[];
}

export interface ReactivationDefaults {
  suggestedCrop: string;
  alternativeCrops: string[];
  irrigationMethod: string;
  variety?: string;
  sowingWindow: { start: string; end: string };
  expectedYield?: number;
  riskFactors: string[];
  rotationBenefit?: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface FieldMemory {
  fieldId: string;
  personality: FieldPersonality;
  cropHistory: Array<{
    cropType: string;
    sowingDate: string;
    harvestDate?: string;
    yield?: number;
    success: boolean;
  }>;
  successfulRotations: CropRotation[];
  seasonalPerformance: Record<string, number>;
  lastUpdated: string;
}

class FieldMemoryService {
  // Common crop rotation patterns in India
  private readonly ROTATION_PATTERNS: Record<string, string[]> = {
    'Rice': ['Wheat', 'Pulses', 'Vegetables', 'Maize'],
    'Wheat': ['Rice', 'Cotton', 'Sugarcane', 'Pulses'],
    'Cotton': ['Wheat', 'Soybean', 'Pulses'],
    'Sugarcane': ['Wheat', 'Pulses', 'Vegetables'],
    'Maize': ['Wheat', 'Pulses', 'Vegetables'],
    'Soybean': ['Wheat', 'Cotton', 'Maize'],
    'Pulses': ['Rice', 'Wheat', 'Cotton', 'Maize'],
    'Vegetables': ['Rice', 'Wheat', 'Pulses']
  };

  // Seasonal crop recommendations (Kharif/Rabi/Zaid)
  private readonly SEASONAL_CROPS = {
    kharif: ['Rice', 'Cotton', 'Soybean', 'Maize', 'Pulses'],
    rabi: ['Wheat', 'Pulses', 'Vegetables'],
    zaid: ['Vegetables', 'Maize', 'Pulses']
  };

  /**
   * Get smart reactivation defaults for a field
   */
  async getReactivationDefaults(fieldId: string): Promise<ReactivationDefaults> {
    try {
      const field = await this.getFieldWithHistory(fieldId);
      if (!field) {
        return this.getGenericDefaults();
      }

      const lastCrop = field.last_crop_type || field.crop_type;
      const cropHistory = await this.getCropHistory(fieldId);
      const currentSeason = this.getCurrentSeason();

      // Predict next crop based on rotation patterns
      const suggestedCrop = this.predictNextCrop(lastCrop, cropHistory, currentSeason);
      const alternativeCrops = this.getAlternativeCrops(lastCrop, currentSeason);

      // Calculate rotation benefit
      const rotationBenefit = this.calculateRotationBenefit(lastCrop, suggestedCrop);

      // Assess risks
      const riskFactors = await this.assessRisks(fieldId, suggestedCrop, cropHistory);

      // Get irrigation method from history
      const irrigationMethod = field.irrigation_method || 'drip';

      // Calculate sowing window
      const sowingWindow = this.calculateSowingWindow(suggestedCrop, currentSeason);

      // Predict yield based on historical data
      const expectedYield = this.predictYield(fieldId, suggestedCrop, cropHistory);

      // Determine confidence
      const confidence = this.calculateConfidence(cropHistory, suggestedCrop);

      return {
        suggestedCrop,
        alternativeCrops,
        irrigationMethod,
        sowingWindow,
        expectedYield,
        riskFactors,
        rotationBenefit,
        confidence
      };
    } catch (error) {
      console.error('Error getting reactivation defaults:', error);
      return this.getGenericDefaults();
    }
  }

  /**
   * Get field with complete history
   */
  private async getFieldWithHistory(fieldId: string): Promise<any> {
    const { data } = await supabase
      .from('fields')
      .select('*')
      .eq('id', fieldId)
      .single();

    return data;
  }

  /**
   * Get crop history for field
   */
  private async getCropHistory(fieldId: string): Promise<Array<{
    cropType: string;
    sowingDate: string;
    harvestDate?: string;
    success: boolean;
  }>> {
    const { data: events } = await supabase
      .from('field_lifecycle_events')
      .select('*')
      .eq('field_id', fieldId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (!events) return [];

    const history: Array<any> = [];
    let currentCrop: any = null;

    for (const event of events.reverse()) {
      if (event.event_type === 'reactivated' || event.event_type === 'created') {
        currentCrop = {
          cropType: event.metadata?.newCropType || event.metadata?.cropType || 'Unknown',
          sowingDate: event.created_at,
          success: false
        };
      } else if (event.event_type === 'harvest_confirmed' && currentCrop) {
        currentCrop.harvestDate = event.created_at;
        currentCrop.success = true;
        history.push(currentCrop);
        currentCrop = null;
      }
    }

    return history;
  }

  /**
   * Predict next crop based on rotation patterns
   */
  private predictNextCrop(
    lastCrop: string,
    history: Array<any>,
    season: 'kharif' | 'rabi' | 'zaid'
  ): string {
    // Check if there's a successful pattern in history
    if (history.length >= 2) {
      const lastTwo = history.slice(-2);
      if (lastTwo[0].success && lastTwo[1].success) {
        // Repeat successful pattern
        return lastTwo[1].cropType;
      }
    }

    // Use rotation pattern
    const rotationOptions = this.ROTATION_PATTERNS[lastCrop] || [];
    const seasonalCrops = this.SEASONAL_CROPS[season];

    // Find crops that are both in rotation pattern and seasonal
    const goodOptions = rotationOptions.filter(crop => 
      seasonalCrops.includes(crop)
    );

    if (goodOptions.length > 0) {
      return goodOptions[0];
    }

    // Fallback to seasonal crops
    return seasonalCrops[0];
  }

  /**
   * Get alternative crop options
   */
  private getAlternativeCrops(
    lastCrop: string,
    season: 'kharif' | 'rabi' | 'zaid'
  ): string[] {
    const rotationOptions = this.ROTATION_PATTERNS[lastCrop] || [];
    const seasonalCrops = this.SEASONAL_CROPS[season];

    const alternatives = rotationOptions.filter(crop => 
      seasonalCrops.includes(crop)
    ).slice(0, 3);

    // Add more seasonal options if needed
    while (alternatives.length < 3 && seasonalCrops.length > alternatives.length) {
      const crop = seasonalCrops[alternatives.length];
      if (!alternatives.includes(crop)) {
        alternatives.push(crop);
      }
    }

    return alternatives;
  }

  /**
   * Calculate rotation benefit message
   */
  private calculateRotationBenefit(lastCrop: string, nextCrop: string): string {
    const benefits: Record<string, Record<string, string>> = {
      'Rice': {
        'Wheat': 'Excellent rotation! Wheat after rice improves soil structure and reduces pest buildup.',
        'Pulses': 'Great choice! Pulses will fix nitrogen and improve soil health after rice.',
        'Vegetables': 'Good rotation. Vegetables benefit from residual moisture after rice.'
      },
      'Wheat': {
        'Rice': 'Classic rotation! Rice-wheat system is proven and sustainable.',
        'Cotton': 'Good choice. Cotton benefits from residual nutrients after wheat.',
        'Pulses': 'Excellent! Pulses will restore nitrogen after wheat.'
      },
      'Cotton': {
        'Wheat': 'Smart rotation! Wheat helps break cotton pest cycles.',
        'Pulses': 'Great choice! Pulses improve soil after cotton.',
        'Soybean': 'Good rotation. Soybean adds nitrogen after cotton.'
      },
      'Pulses': {
        'Rice': 'Excellent! Rice benefits from nitrogen fixed by pulses.',
        'Wheat': 'Great rotation! Wheat thrives after nitrogen-rich pulses.',
        'Cotton': 'Good choice. Cotton benefits from improved soil after pulses.'
      }
    };

    return benefits[lastCrop]?.[nextCrop] || 
           `${nextCrop} is a suitable crop after ${lastCrop}.`;
  }

  /**
   * Assess risks for suggested crop
   */
  private async assessRisks(
    fieldId: string,
    suggestedCrop: string,
    history: Array<any>
  ): Promise<string[]> {
    const risks: string[] = [];

    // Check if same crop was recently grown (monocropping risk)
    const recentCrops = history.slice(-3).map(h => h.cropType);
    if (recentCrops.filter(c => c === suggestedCrop).length >= 2) {
      risks.push('Monocropping risk: Same crop grown recently');
    }

    // Check for failed attempts
    const failedAttempts = history.filter(h => 
      h.cropType === suggestedCrop && !h.success
    );
    if (failedAttempts.length > 0) {
      risks.push(`Previous ${suggestedCrop} crop had challenges`);
    }

    // Seasonal timing risk
    const season = this.getCurrentSeason();
    const seasonalCrops = this.SEASONAL_CROPS[season];
    if (!seasonalCrops.includes(suggestedCrop)) {
      risks.push('Not optimal season for this crop');
    }

    return risks;
  }

  /**
   * Calculate optimal sowing window
   */
  private calculateSowingWindow(
    crop: string,
    season: 'kharif' | 'rabi' | 'zaid'
  ): { start: string; end: string } {
    const windows: Record<string, Record<string, { start: string; end: string }>> = {
      'kharif': {
        'Rice': { start: '2024-06-15', end: '2024-07-31' },
        'Cotton': { start: '2024-05-15', end: '2024-06-30' },
        'Soybean': { start: '2024-06-15', end: '2024-07-15' },
        'Maize': { start: '2024-06-15', end: '2024-07-31' },
        'Pulses': { start: '2024-06-15', end: '2024-07-31' }
      },
      'rabi': {
        'Wheat': { start: '2024-11-01', end: '2024-12-15' },
        'Pulses': { start: '2024-10-15', end: '2024-11-30' },
        'Vegetables': { start: '2024-10-01', end: '2024-12-31' }
      },
      'zaid': {
        'Vegetables': { start: '2024-03-01', end: '2024-04-30' },
        'Maize': { start: '2024-02-15', end: '2024-03-31' },
        'Pulses': { start: '2024-03-01', end: '2024-04-15' }
      }
    };

    const window = windows[season]?.[crop];
    if (window) {
      // Update year to current year
      const currentYear = new Date().getFullYear();
      return {
        start: window.start.replace('2024', currentYear.toString()),
        end: window.end.replace('2024', currentYear.toString())
      };
    }

    // Default: next 30 days
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 30);

    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    };
  }

  /**
   * Predict yield based on historical data
   */
  private predictYield(
    fieldId: string,
    crop: string,
    history: Array<any>
  ): number | undefined {
    const similarCrops = history.filter(h => 
      h.cropType === crop && h.success
    );

    if (similarCrops.length === 0) return undefined;

    // Average of previous yields (if available)
    // For now, return undefined as we don't have yield data yet
    return undefined;
  }

  /**
   * Calculate confidence level
   */
  private calculateConfidence(
    history: Array<any>,
    suggestedCrop: string
  ): 'high' | 'medium' | 'low' {
    if (history.length === 0) return 'low';

    const successfulCrops = history.filter(h => h.success);
    const successRate = successfulCrops.length / history.length;

    const hasSimilarSuccess = successfulCrops.some(h => 
      h.cropType === suggestedCrop
    );

    if (successRate > 0.7 && hasSimilarSuccess) return 'high';
    if (successRate > 0.5) return 'medium';
    return 'low';
  }

  /**
   * Get current season
   */
  private getCurrentSeason(): 'kharif' | 'rabi' | 'zaid' {
    const month = new Date().getMonth() + 1; // 1-12

    if (month >= 6 && month <= 10) return 'kharif'; // June-October
    if (month >= 11 || month <= 2) return 'rabi'; // November-February
    return 'zaid'; // March-May
  }

  /**
   * Get generic defaults when no history available
   */
  private getGenericDefaults(): ReactivationDefaults {
    const season = this.getCurrentSeason();
    const seasonalCrops = this.SEASONAL_CROPS[season];

    return {
      suggestedCrop: seasonalCrops[0],
      alternativeCrops: seasonalCrops.slice(1, 4),
      irrigationMethod: 'drip',
      sowingWindow: this.calculateSowingWindow(seasonalCrops[0], season),
      riskFactors: ['No historical data available for this field'],
      confidence: 'low'
    };
  }

  /**
   * Store field memory after harvest
   */
  async storeFieldMemory(fieldId: string, harvestData: {
    cropType: string;
    yield?: number;
    success: boolean;
    notes?: string;
  }): Promise<void> {
    try {
      // This will be stored in field_lifecycle_events
      // Future enhancement: Create dedicated field_memories table
      console.log('Field memory stored:', fieldId, harvestData);
    } catch (error) {
      console.error('Error storing field memory:', error);
    }
  }

  /**
   * Get quick action recommendations (one-click options)
   */
  async getQuickActions(fieldId: string): Promise<Array<{
    label: string;
    crop: string;
    icon: string;
    benefit: string;
  }>> {
    const defaults = await this.getReactivationDefaults(fieldId);
    const field = await this.getFieldWithHistory(fieldId);
    const lastCrop = field?.last_crop_type || field?.crop_type;

    const actions = [
      {
        label: `Sow ${defaults.suggestedCrop}`,
        crop: defaults.suggestedCrop,
        icon: '🌾',
        benefit: defaults.rotationBenefit || 'Recommended crop'
      }
    ];

    // Add "Same Crop" option if it makes sense
    if (lastCrop && lastCrop !== defaults.suggestedCrop) {
      const season = this.getCurrentSeason();
      const seasonalCrops = this.SEASONAL_CROPS[season];
      
      if (seasonalCrops.includes(lastCrop)) {
        actions.push({
          label: `Sow ${lastCrop} Again`,
          crop: lastCrop,
          icon: '🔄',
          benefit: 'Continue with same crop'
        });
      }
    }

    // Add top alternative
    if (defaults.alternativeCrops.length > 0) {
      actions.push({
        label: `Sow ${defaults.alternativeCrops[0]}`,
        crop: defaults.alternativeCrops[0],
        icon: '🌱',
        benefit: 'Alternative option'
      });
    }

    return actions.slice(0, 3);
  }
}

export const fieldMemoryService = new FieldMemoryService();
