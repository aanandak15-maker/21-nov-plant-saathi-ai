import recommendationRules from './recommendationRules.json';
import comprehensiveRulebook, { 
  growthStageRules,
  blackBoxPersonalizationRules, 
  scoringWeights, 
  recommendationStrategies 
} from './comprehensiveRules';
import { diseaseDetectionService } from '../diseaseDetectionService';
import { blackBoxService } from '../blackBoxService';

interface RecommendationContext {
  fields: any[];
  weather: any;
  diseases: any[];
  blackBoxData?: any;
}

interface ProductRecommendation {
  productId: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  reason: string;
  dosage?: string;
  applicationMethod?: string;
  expectedResult?: string;
  savings?: string;
  contains?: string[];
  score: number;
  fieldId?: string;
  fieldName?: string;
  diseaseId?: string;
}

class SmartRecommendationsService {
  private rules = recommendationRules.rules;
  private comprehensiveRules = comprehensiveRulebook;
  private personalizationRules = blackBoxPersonalizationRules;
  private scoringWeights = scoringWeights;
  private strategies = recommendationStrategies;

  /**
   * Generate smart product recommendations based on all available data
   */
  async generateRecommendations(context: RecommendationContext): Promise<ProductRecommendation[]> {
    const recommendations: ProductRecommendation[] = [];

    try {
      // 1. Disease-based recommendations (HIGHEST PRIORITY)
      const diseaseRecs = this.getDiseaseRecommendations(context.diseases, context.fields);
      recommendations.push(...diseaseRecs);

      // 2. Field health recommendations
      const healthRecs = this.getFieldHealthRecommendations(context.fields);
      recommendations.push(...healthRecs);

      // 3. Weather-based recommendations
      const weatherRecs = this.getWeatherRecommendations(context.weather);
      recommendations.push(...weatherRecs);

      // 4. Integrated solutions (solve multiple problems)
      const integratedRecs = this.getIntegratedRecommendations(context);
      recommendations.push(...integratedRecs);

      // 5. Growth stage recommendations
      const stageRecs = this.getGrowthStageRecommendations(context.fields);
      recommendations.push(...stageRecs);

      // 6. Score and sort recommendations
      const scoredRecs = this.scoreRecommendations(recommendations, context);
      const sortedRecs = this.sortByPriorityAndScore(scoredRecs);

      // 7. Deduplicate and limit to top 10
      const uniqueRecs = this.deduplicateRecommendations(sortedRecs);
      
      // 8. Log recommendations for analytics
      this.logRecommendations(uniqueRecs);

      return uniqueRecs.slice(0, 10);
    } catch (error) {
      console.error('Recommendation generation failed:', error);
      return [];
    }
  }

  /**
   * Get disease-based product recommendations (ENHANCED with comprehensive rules)
   */
  private getDiseaseRecommendations(diseases: any[], fields: any[]): ProductRecommendation[] {
    const recs: ProductRecommendation[] = [];

    diseases.forEach(disease => {
      const field = fields.find(f => f.id === disease.fieldId);
      
      // Use comprehensive disease rules
      this.comprehensiveRules.diseaseRules.forEach(rule => {
        const matchesDisease = rule.diseases.some(d => 
          disease.disease?.toLowerCase().includes(d.toLowerCase())
        );
        
        if (matchesDisease && disease.confidence >= rule.confidence) {
          rule.products.forEach(product => {
            recs.push({
              productId: product.id,
              name: product.name,
              category: product.category,
              price: product.price,
              unit: product.unit,
              priority: product.priority as 'urgent' | 'high' | 'medium' | 'low',
              reason: product.reason,
              dosage: product.dosage,
              applicationMethod: product.applicationMethod,
              expectedResult: product.expectedResult,
              score: 100 + (product.effectiveness || 0), // Base score + effectiveness
              fieldId: disease.fieldId,
              fieldName: field?.name || 'Unknown field',
              diseaseId: disease.id
            });
          });
        }
      });

      // Fallback to basic rules if no comprehensive match
      this.rules.disease.forEach(rule => {
        const matchesDisease = rule.condition.disease.some(d => 
          disease.disease?.toLowerCase().includes(d.toLowerCase())
        );
        
        if (matchesDisease && disease.confidence >= rule.condition.confidence) {
          rule.recommendations.forEach(rec => {
            recs.push({
              ...rec,
              priority: rec.priority as 'urgent' | 'high' | 'medium' | 'low',
              score: 100,
              fieldId: disease.fieldId,
              fieldName: field?.name || 'Unknown field',
              diseaseId: disease.id
            });
          });
        }
      });
    });

    return recs;
  }

  /**
   * Get field health-based recommendations (ENHANCED)
   */
  private getFieldHealthRecommendations(fields: any[]): ProductRecommendation[] {
    const recs: ProductRecommendation[] = [];

    fields.forEach(field => {
      // Skip fields with no health data
      if (field.healthScore == null || field.healthScore === 0) {
        return;
      }

      // Use comprehensive field health rules
      this.comprehensiveRules.fieldHealthRules.forEach(rule => {
        const matchesHealth = this.matchesCondition(field.healthScore, rule.condition.healthScore);
        const matchesNDVI = !rule.condition.ndvi || this.matchesCondition(field.ndvi, rule.condition.ndvi);

        if (matchesHealth && matchesNDVI) {
          rule.products.forEach(product => {
            recs.push({
              productId: product.id,
              name: product.name,
              category: product.category,
              price: product.price,
              unit: product.unit,
              priority: product.priority as 'urgent' | 'high' | 'medium' | 'low',
              reason: product.reason,
              dosage: product.dosage,
              applicationMethod: (product as any).applicationMethod,
              expectedResult: (product as any).expectedResult,
              savings: (product as any).savings,
              contains: (product as any).contains,
              score: 90 - field.healthScore + (product.effectiveness || 0),
              fieldId: field.id,
              fieldName: field.name
            });
          });
        }
      });

      // Soil moisture recommendations (comprehensive)
      if (field.moisture != null && field.moisture > 0) {
        this.comprehensiveRules.soilMoistureRules.forEach(rule => {
          if (this.matchesCondition(field.moisture, rule.condition.moisture)) {
            rule.products.forEach(product => {
              recs.push({
                productId: product.id,
                name: product.name,
                category: product.category,
                price: product.price,
                unit: product.unit,
                priority: product.priority as 'urgent' | 'high' | 'medium' | 'low',
                reason: product.reason,
                dosage: product.dosage,
                savings: product.savings,
                score: 85 + (product.effectiveness || 0),
                fieldId: field.id,
                fieldName: field.name
              });
            });
          }
        });
      }

      // Fallback to basic rules
      this.rules.fieldHealth.forEach(rule => {
        const matchesHealth = this.matchesCondition(field.healthScore, rule.condition.healthScore);
        const matchesNDVI = !rule.condition.ndvi || this.matchesCondition(field.ndvi, rule.condition.ndvi);

        if (matchesHealth && matchesNDVI) {
          rule.recommendations.forEach(rec => {
            recs.push({
              ...rec,
              priority: rec.priority as 'urgent' | 'high' | 'medium' | 'low',
              score: 90 - field.healthScore,
              fieldId: field.id,
              fieldName: field.name
            });
          });
        }
      });
    });

    return recs;
  }

  /**
   * Get weather-based recommendations (ENHANCED)
   */
  private getWeatherRecommendations(weather: any): ProductRecommendation[] {
    const recs: ProductRecommendation[] = [];

    if (!weather?.current) return recs;

    // Use comprehensive weather rules
    const weatherRules = (this.comprehensiveRules as any).weatherRules || [];
    weatherRules.forEach((rule: any) => {
      let matches = true;

      // Check humidity
      if (rule.condition.humidity) {
        matches = matches && this.matchesCondition(weather.current.humidity, rule.condition.humidity);
      }

      // Check temperature
      if (rule.condition.temperature) {
        matches = matches && this.matchesCondition(weather.current.temp, rule.condition.temperature);
      }

      // Check rainfall
      if (rule.condition.rainfall && weather.daily?.[0]) {
        const rainChance = weather.daily[0].pop * 100;
        matches = matches && rainChance > 70;
      }

      // Check wind speed
      if (rule.condition.windSpeed && weather.current.wind_speed) {
        matches = matches && this.matchesCondition(weather.current.wind_speed, rule.condition.windSpeed);
      }

      if (matches) {
        rule.products.forEach(product => {
          recs.push({
            productId: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            unit: product.unit,
            priority: product.priority as 'urgent' | 'high' | 'medium' | 'low',
            reason: product.reason,
            dosage: product.dosage,
            score: 70 + (product.effectiveness || 0)
          });
        });
      }
    });

    // Fallback to basic rules
    this.rules.weather.forEach(rule => {
      let matches = true;

      if (rule.condition.humidity) {
        matches = matches && this.matchesCondition(weather.current.humidity, rule.condition.humidity);
      }

      if (rule.condition.temperature) {
        matches = matches && this.matchesCondition(weather.current.temp, rule.condition.temperature);
      }

      if (rule.condition.rainfall && weather.daily?.[0]) {
        const rainChance = weather.daily[0].pop * 100;
        matches = matches && rainChance > 70;
      }

      if (matches) {
        rule.recommendations.forEach(rec => {
          recs.push({
            ...rec,
            priority: rec.priority as 'urgent' | 'high' | 'medium' | 'low',
            score: 70
          });
        });
      }
    });

    return recs;
  }

  /**
   * Get integrated solutions (ENHANCED - solve multiple problems together)
   */
  private getIntegratedRecommendations(context: RecommendationContext): ProductRecommendation[] {
    const recs: ProductRecommendation[] = [];

    const hasDisease = context.diseases.length > 0;
    const hasPest = context.diseases.some(d => d.disease?.toLowerCase().includes('borer') || d.disease?.toLowerCase().includes('hopper'));
    const hasLowHealth = context.fields.some(f => f.healthScore != null && f.healthScore < 40);
    const hasCriticalHealth = context.fields.some(f => f.healthScore != null && f.healthScore < 30);
    const hasLowMoisture = context.fields.some(f => f.moisture != null && f.moisture < 30);
    const hasCriticalMoisture = context.fields.some(f => f.moisture != null && f.moisture < 15);
    const hasHighTemp = context.weather?.current?.temp > 35;
    const hasExtremeTemp = context.weather?.current?.temp > 38;

    // Use comprehensive integrated solutions
    const integratedSolutions = (this.comprehensiveRules as any).integratedSolutions || [];
    integratedSolutions.forEach((solution: any) => {
      let matches = false;

      // Check various combo conditions
      if (solution.id === 'disease_plus_low_health_combo') {
        matches = hasDisease && hasLowHealth;
      } else if (solution.id === 'drought_plus_heat_stress_combo') {
        matches = (hasLowMoisture || hasCriticalMoisture) && (hasHighTemp || hasExtremeTemp);
      } else if (solution.id === 'pest_plus_disease_combo') {
        matches = hasPest && hasDisease;
      } else if (solution.id === 'complete_field_revival_kit') {
        matches = hasCriticalHealth && hasCriticalMoisture && hasDisease;
      } else if (solution.id === 'preventive_care_package') {
        const hasGoodHealth = context.fields.some(f => f.healthScore != null && f.healthScore >= 60 && f.healthScore <= 80);
        matches = hasGoodHealth && !hasDisease;
      }

      if (matches) {
        solution.products.forEach(product => {
          recs.push({
            productId: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            unit: product.unit,
            priority: product.priority as 'urgent' | 'high' | 'medium' | 'low',
            reason: product.reason,
            savings: product.savings,
            contains: product.contains,
            expectedResult: product.expectedResult,
            score: 95 + (product.effectiveness || 0) + this.scoringWeights.comboPackBonus
          });
        });
      }
    });

    // Fallback to basic integrated rules
    this.rules.integrated.forEach(rule => {
      let matches = false;

      if (rule.id === 'disease_plus_low_health') {
        matches = hasDisease && hasLowHealth;
      }

      if (rule.id === 'low_moisture_heat_stress') {
        matches = hasLowMoisture && hasHighTemp;
      }

      if (matches) {
        rule.recommendations.forEach(rec => {
          recs.push({
            ...rec,
            priority: rec.priority as 'urgent' | 'high' | 'medium' | 'low',
            score: 95
          });
        });
      }
    });

    return recs;
  }

  /**
   * Get growth stage recommendations (ENHANCED)
   */
  private getGrowthStageRecommendations(fields: any[]): ProductRecommendation[] {
    const recs: ProductRecommendation[] = [];

    fields.forEach(field => {
      if (!field.sowingDate) return;

      const daysAfterSowing = Math.floor(
        (Date.now() - new Date(field.sowingDate).getTime()) / (1000 * 60 * 60 * 24)
      );

      // Use comprehensive growth stage rules
      growthStageRules.forEach((rule: any) => {
        const matchesDays = this.matchesCondition(daysAfterSowing, rule.condition.daysAfterSowing);

        if (matchesDays) {
          rule.products.forEach(product => {
            recs.push({
              productId: product.id,
              name: product.name,
              category: product.category,
              price: product.price,
              unit: product.unit,
              priority: product.priority as 'urgent' | 'high' | 'medium' | 'low',
              reason: product.reason,
              dosage: product.dosage,
              score: 60 + (product.effectiveness || 0),
              fieldId: field.id,
              fieldName: field.name
            });
          });
        }
      });

      // Fallback to basic rules
      this.rules.growthStage.forEach(rule => {
        const matchesDays = this.matchesCondition(daysAfterSowing, rule.condition.daysAfterSowing);

        if (matchesDays) {
          rule.recommendations.forEach(rec => {
            recs.push({
              ...rec,
              priority: rec.priority as 'urgent' | 'high' | 'medium' | 'low',
              score: 60,
              fieldId: field.id,
              fieldName: field.name
            });
          });
        }
      });
    });

    return recs;
  }

  /**
   * Score recommendations based on context and BlackBox data (ENHANCED)
   */
  private scoreRecommendations(
    recommendations: ProductRecommendation[],
    context: RecommendationContext
  ): ProductRecommendation[] {
    return recommendations.map(rec => {
      let score = rec.score;

      // Boost score based on priority
      score += this.scoringWeights.priorityWeights[rec.priority] || 0;

      // Boost combo packs
      if (rec.category === 'combo' && rec.savings) {
        score += this.scoringWeights.comboPackBonus;
        
        // Additional boost based on savings amount
        const savingsAmount = parseInt(rec.savings.replace(/[^0-9]/g, '')) || 0;
        if (savingsAmount > 1000) score += this.scoringWeights.savingsBonus.above1000;
        else if (savingsAmount > 500) score += this.scoringWeights.savingsBonus.above500;
        else if (savingsAmount > 300) score += this.scoringWeights.savingsBonus.above300;
      }

      // BlackBox personalization boosts
      try {
        // Boost if product was previously purchased
        // TODO: Get actual BlackBox data from service
        const blackBoxData = context.blackBoxData || {};
        
        if (blackBoxData.previousPurchases?.includes(rec.productId)) {
          score += this.personalizationRules.userBehaviorBoosts.previousPurchase.boost;
        }
        
        if (blackBoxData.previousSearches?.includes(rec.productId)) {
          score += this.personalizationRules.userBehaviorBoosts.previousSearch.boost;
        }
        
        if (blackBoxData.clickedProducts?.includes(rec.productId)) {
          score += this.personalizationRules.userBehaviorBoosts.clickedButNotBought.boost;
        }

        // Regional popularity boost
        if (blackBoxData.popularInRegion?.includes(rec.productId)) {
          score += this.personalizationRules.regionalPreferences.popularInRegion.boost;
        }

        // Crop-specific boost
        const cropType = context.fields[0]?.cropType?.toLowerCase();
        if (cropType && rec.reason?.toLowerCase().includes(cropType)) {
          score += this.personalizationRules.cropSpecificBoosts[cropType]?.boost || 0;
        }
      } catch (error) {
        console.error('BlackBox personalization failed:', error);
      }

      return { ...rec, score };
    });
  }

  /**
   * Sort recommendations by priority and score
   */
  private sortByPriorityAndScore(recommendations: ProductRecommendation[]): ProductRecommendation[] {
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    
    return recommendations.sort((a, b) => {
      // First sort by priority
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then by score
      return b.score - a.score;
    });
  }

  /**
   * Remove duplicate recommendations
   */
  private deduplicateRecommendations(recommendations: ProductRecommendation[]): ProductRecommendation[] {
    const seen = new Set<string>();
    return recommendations.filter(rec => {
      if (seen.has(rec.productId)) return false;
      seen.add(rec.productId);
      return true;
    });
  }

  /**
   * Helper: Check if value matches condition
   */
  private matchesCondition(value: number, condition: any): boolean {
    if (condition.min !== undefined && value < condition.min) return false;
    if (condition.max !== undefined && value > condition.max) return false;
    return true;
  }

  /**
   * Log recommendations for analytics
   */
  private logRecommendations(recommendations: ProductRecommendation[]): void {
    try {
      blackBoxService.logUserInteraction(
        'button_click' as any,
        'smart_recommendations',
        undefined,
        {
          event: 'recommendations_generated',
          count: recommendations.length,
          urgent: recommendations.filter(r => r.priority === 'urgent').length,
          high: recommendations.filter(r => r.priority === 'high').length,
          categories: [...new Set(recommendations.map(r => r.category))],
          timestamp: new Date().toISOString()
        }
      );
    } catch (error) {
      console.error('Failed to log recommendations:', error);
    }
  }

  /**
   * Track recommendation interaction
   */
  trackRecommendationView(productId: string, reason: string): void {
    blackBoxService.logUserInteraction(
      'page_view' as any,
      'product_card',
      productId,
      { event: 'recommendation_viewed', reason, timestamp: new Date().toISOString() }
    );
  }

  /**
   * Track recommendation click
   */
  trackRecommendationClick(productId: string, action: 'buy' | 'learn_more'): void {
    blackBoxService.logUserInteraction(
      'button_click' as any,
      'product_card',
      productId,
      { event: 'recommendation_clicked', action, timestamp: new Date().toISOString() }
    );
  }
}

export const smartRecommendationsService = new SmartRecommendationsService();
