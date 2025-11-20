import { supabase } from '../supabase';
import { blackBoxAnalyticsService } from '../blackBoxAnalyticsService';
import aiRules from './smartAIRules.json';

interface SmartAIProfile {
  userId: string;
  identity: {
    name?: string;
    farmSize?: string;
    location?: {
      village?: string;
      district?: string;
      state?: string;
    };
    primaryCrops?: string[];
    experienceLevel?: 'beginner' | 'intermediate' | 'expert';
  };
  behaviorPatterns: {
    analysisFrequency: 'daily' | 'weekly' | 'occasional';
    cropFocus: string[];
    weatherSensitivity: boolean;
    marketEngagement: number;
    totalInteractions: number;
  };
  missingInfo: {
    [key: string]: boolean;
  };
  proactiveInteraction: {
    nextQuestionTime: string | null;
    currentQuestionTopic: string | null;
    questionCooldown: number;
    questionsAskedThisWeek: number;
  };
  metadata: {
    createdAt: string;
    lastUpdated: string;
    daysActive: number;
    geminiCallsToday: number;
    lastGeminiCallDate: string | null;
  };
}

interface BlackBoxSummary {
  fieldScans: number;
  weatherChecks: number;
  diseaseDetectionUsage: number;
  marketplaceVisits: number;
  cartAdditions: number;
  mandiPriceChecks: number;
  totalActions: number;
}

class SmartAIService {
  private rules = aiRules;
  private profileCache: Map<string, SmartAIProfile> = new Map();

  // ==================== PROFILE MANAGEMENT ====================
  
  async getOrCreateProfile(userId: string): Promise<SmartAIProfile> {
    // Check cache first
    if (this.profileCache.has(userId)) {
      return this.profileCache.get(userId)!;
    }

    // Try to load from Supabase
    const { data, error } = await supabase
      .from('smart_ai_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (data && !error) {
      const profile = this.parseProfile(data);
      this.profileCache.set(userId, profile);
      return profile;
    }

    // Create new profile
    const newProfile = this.createDefaultProfile(userId);
    await this.saveProfile(newProfile);
    return newProfile;
  }

  private createDefaultProfile(userId: string): SmartAIProfile {
    return {
      userId,
      identity: {},
      behaviorPatterns: {
        analysisFrequency: 'occasional',
        cropFocus: [],
        weatherSensitivity: false,
        marketEngagement: 0,
        totalInteractions: 0
      },
      missingInfo: {
        name: true,
        location: true,
        primaryCrops: true,
        farmSize: true,
        experienceLevel: true
      },
      proactiveInteraction: {
        nextQuestionTime: null,
        currentQuestionTopic: null,
        questionCooldown: this.rules.learningBehavior.questionCooldownDays,
        questionsAskedThisWeek: 0
      },
      metadata: {
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        daysActive: 0,
        geminiCallsToday: 0,
        lastGeminiCallDate: null
      }
    };
  }

  async saveProfile(profile: SmartAIProfile): Promise<void> {
    profile.metadata.lastUpdated = new Date().toISOString();
    
    const { error } = await supabase
      .from('smart_ai_profiles')
      .upsert({
        user_id: profile.userId,
        identity: profile.identity,
        behavior_patterns: profile.behaviorPatterns,
        missing_info: profile.missingInfo,
        proactive_interaction: profile.proactiveInteraction,
        metadata: profile.metadata,
        updated_at: new Date().toISOString()
      });

    if (!error) {
      this.profileCache.set(profile.userId, profile);
    }
  }

  // ==================== BLACKBOX ANALYSIS ====================
  
  async analyzeUserBehavior(userId: string): Promise<BlackBoxSummary> {
    const logs = await blackBoxAnalyticsService.getUserLogs(userId, 30); // Last 30 days
    
    const summary: BlackBoxSummary = {
      fieldScans: 0,
      weatherChecks: 0,
      diseaseDetectionUsage: 0,
      marketplaceVisits: 0,
      cartAdditions: 0,
      mandiPriceChecks: 0,
      totalActions: logs.length
    };

    logs.forEach(log => {
      if (log.action.includes('field') || log.action.includes('ndvi')) {
        summary.fieldScans++;
      }
      if (log.action.includes('weather')) {
        summary.weatherChecks++;
      }
      if (log.action.includes('disease')) {
        summary.diseaseDetectionUsage++;
      }
      if (log.action.includes('marketplace')) {
        summary.marketplaceVisits++;
      }
      if (log.action.includes('cart')) {
        summary.cartAdditions++;
      }
      if (log.action.includes('mandi')) {
        summary.mandiPriceChecks++;
      }
    });

    return summary;
  }

  async updateBehaviorPatterns(userId: string): Promise<void> {
    const profile = await this.getOrCreateProfile(userId);
    const blackboxData = await this.analyzeUserBehavior(userId);

    // Update patterns based on behavior
    profile.behaviorPatterns.totalInteractions = blackboxData.totalActions;
    profile.behaviorPatterns.weatherSensitivity = blackboxData.weatherChecks > 10;
    profile.behaviorPatterns.marketEngagement = blackboxData.marketplaceVisits / Math.max(blackboxData.totalActions, 1);

    // Determine analysis frequency
    if (blackboxData.totalActions > 50) {
      profile.behaviorPatterns.analysisFrequency = 'daily';
    } else if (blackboxData.totalActions > 20) {
      profile.behaviorPatterns.analysisFrequency = 'weekly';
    } else {
      profile.behaviorPatterns.analysisFrequency = 'occasional';
    }

    await this.saveProfile(profile);
  }

  // ==================== INTELLIGENT QUESTIONS ====================
  
  async getNextIntelligentQuestion(userId: string): Promise<string | null> {
    if (!this.rules.intelligentQuestions.enabled) {
      return null;
    }

    const profile = await this.getOrCreateProfile(userId);
    const blackboxData = await this.analyzeUserBehavior(userId);

    // Check cooldown
    if (profile.proactiveInteraction.nextQuestionTime) {
      const nextTime = new Date(profile.proactiveInteraction.nextQuestionTime);
      if (nextTime > new Date()) {
        return null; // Still in cooldown
      }
    }

    // Check weekly limit
    if (profile.proactiveInteraction.questionsAskedThisWeek >= this.rules.intelligentQuestions.maxQuestionsPerWeek) {
      return null;
    }

    // Find highest priority question that matches conditions
    for (const trigger of this.rules.intelligentQuestions.triggers) {
      if (this.evaluateCondition(trigger.condition, profile, blackboxData)) {
        // Schedule next question
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + profile.proactiveInteraction.questionCooldown);
        
        profile.proactiveInteraction.nextQuestionTime = nextDate.toISOString();
        profile.proactiveInteraction.currentQuestionTopic = trigger.id;
        profile.proactiveInteraction.questionsAskedThisWeek++;
        
        await this.saveProfile(profile);
        return trigger.question;
      }
    }

    return null;
  }

  private evaluateCondition(condition: string, profile: SmartAIProfile, blackbox: BlackBoxSummary): boolean {
    try {
      // Simple condition evaluator (can be enhanced)
      if (condition.includes('profile.primaryCrops === null')) {
        return !profile.identity.primaryCrops || profile.identity.primaryCrops.length === 0;
      }
      if (condition.includes('blackbox.fieldScans >')) {
        const threshold = parseInt(condition.match(/\d+/)?.[0] || '0');
        return blackbox.fieldScans > threshold;
      }
      if (condition.includes('blackbox.diseaseDetectionUsage === 0')) {
        return blackbox.diseaseDetectionUsage === 0;
      }
      if (condition.includes('blackbox.weatherChecks >')) {
        const threshold = parseInt(condition.match(/\d+/)?.[0] || '0');
        return blackbox.weatherChecks > threshold;
      }
      if (condition.includes('profile.daysActive <')) {
        const threshold = parseInt(condition.match(/\d+/)?.[0] || '0');
        return profile.metadata.daysActive < threshold;
      }
      return false;
    } catch {
      return false;
    }
  }

  // ==================== COST OPTIMIZATION ====================
  
  async canUseGemini(userId: string): Promise<boolean> {
    if (!this.rules.costOptimization.enabled) {
      return true;
    }

    const profile = await this.getOrCreateProfile(userId);
    const today = new Date().toISOString().split('T')[0];
    const lastCallDate = profile.metadata.lastGeminiCallDate?.split('T')[0];

    // Reset counter if new day
    if (lastCallDate !== today) {
      profile.metadata.geminiCallsToday = 0;
      profile.metadata.lastGeminiCallDate = new Date().toISOString();
    }

    // Check daily limit
    if (profile.metadata.geminiCallsToday >= this.rules.costOptimization.maxGeminiCallsPerDay) {
      return false;
    }

    return true;
  }

  async incrementGeminiCall(userId: string): Promise<void> {
    const profile = await this.getOrCreateProfile(userId);
    profile.metadata.geminiCallsToday++;
    profile.metadata.lastGeminiCallDate = new Date().toISOString();
    await this.saveProfile(profile);
  }

  shouldUseLocalIntelligence(query: string): boolean {
    if (!this.rules.costOptimization.useLocalIntelligenceFirst) {
      return false;
    }

    const lowerQuery = query.toLowerCase();
    
    for (const pattern of this.rules.costSavingStrategies.localPatternMatching.commonQueries) {
      if (pattern.patterns.some(p => lowerQuery.includes(p))) {
        return true;
      }
    }

    return false;
  }

  // ==================== CONTEXT BUILDING ====================
  
  async buildEnhancedContext(userId: string, query: string): Promise<string> {
    const profile = await this.getOrCreateProfile(userId);
    const blackboxData = await this.analyzeUserBehavior(userId);

    let context = '';

    // Add identity context
    if (profile.identity.name) {
      context += `Farmer Name: ${profile.identity.name}\n`;
    }
    if (profile.identity.primaryCrops && profile.identity.primaryCrops.length > 0) {
      context += `Primary Crops: ${profile.identity.primaryCrops.join(', ')}\n`;
    }
    if (profile.identity.location) {
      context += `Location: ${profile.identity.location.district}, ${profile.identity.location.state}\n`;
    }
    if (profile.identity.farmSize) {
      context += `Farm Size: ${profile.identity.farmSize}\n`;
    }

    // Add behavior context
    context += `\nUser Behavior:\n`;
    context += `- Engagement Level: ${blackboxData.totalActions > 20 ? 'High' : 'Moderate'}\n`;
    context += `- Weather Monitoring: ${blackboxData.weatherChecks} checks\n`;
    context += `- Field Monitoring: ${blackboxData.fieldScans} scans\n`;
    context += `- Market Interest: ${blackboxData.marketplaceVisits > 0 ? 'Yes' : 'No'}\n`;

    // Add seasonal context
    const month = new Date().getMonth() + 1;
    const season = this.getCurrentSeason(month);
    if (season) {
      context += `\nCurrent Season: ${season.name}\n`;
      context += `Focus Areas: ${season.focus.join(', ')}\n`;
    }

    return context;
  }

  private getCurrentSeason(month: number): { name: string; focus: string[] } | null {
    if (this.rules.contextualResponses.seasonalAdvice.monsoon.months.includes(month)) {
      return { name: 'Monsoon', focus: this.rules.contextualResponses.seasonalAdvice.monsoon.focus };
    }
    if (this.rules.contextualResponses.seasonalAdvice.winter.months.includes(month)) {
      return { name: 'Winter', focus: this.rules.contextualResponses.seasonalAdvice.winter.focus };
    }
    if (this.rules.contextualResponses.seasonalAdvice.summer.months.includes(month)) {
      return { name: 'Summer', focus: this.rules.contextualResponses.seasonalAdvice.summer.focus };
    }
    return null;
  }

  // ==================== PROACTIVE RECOMMENDATIONS ====================
  
  async getProactiveRecommendations(userId: string, fieldData?: any, weather?: any, mandiPrices?: any): Promise<string[]> {
    if (!this.rules.proactiveRecommendations.enabled) {
      return [];
    }

    const recommendations: string[] = [];
    const profile = await this.getOrCreateProfile(userId);

    for (const trigger of this.rules.proactiveRecommendations.triggers) {
      if (this.evaluateProactiveTrigger(trigger, fieldData, weather, mandiPrices, profile)) {
        recommendations.push(trigger.message);
      }
    }

    return recommendations;
  }

  private evaluateProactiveTrigger(trigger: any, fieldData: any, weather: any, mandiPrices: any, profile: SmartAIProfile): boolean {
    // Simplified trigger evaluation
    if (trigger.id === 'ndvi_drop_detected' && fieldData) {
      return fieldData.ndvi < 0.4 && fieldData.previousNdvi > 0.6;
    }
    if (trigger.id === 'weather_alert' && weather) {
      return weather.rainfall > 50;
    }
    if (trigger.id === 'market_opportunity' && mandiPrices && profile.identity.primaryCrops) {
      return mandiPrices.trend === 'rising' && profile.identity.primaryCrops.includes(mandiPrices.commodity);
    }
    return false;
  }

  // ==================== PROFILE UPDATES ====================
  
  async updateProfileFromResponse(userId: string, question: string, response: string): Promise<void> {
    const profile = await this.getOrCreateProfile(userId);

    // Extract information from response
    const lowerResponse = response.toLowerCase();

    // Update crops
    if (question.includes('crops') || question.includes('फसल')) {
      const crops = this.extractCrops(response);
      if (crops.length > 0) {
        profile.identity.primaryCrops = crops;
        profile.missingInfo.primaryCrops = false;
      }
    }

    // Update farm size
    if (question.includes('farm') || question.includes('खेत')) {
      profile.identity.farmSize = response;
      profile.missingInfo.farmSize = false;
    }

    // Update name
    if (question.includes('name') || question.includes('नाम')) {
      profile.identity.name = response;
      profile.missingInfo.name = false;
    }

    await this.saveProfile(profile);
  }

  private extractCrops(text: string): string[] {
    const crops: string[] = [];
    const cropKeywords = ['rice', 'wheat', 'sugarcane', 'cotton', 'maize', 'धान', 'गेहूं', 'गन्ना'];
    
    cropKeywords.forEach(crop => {
      if (text.toLowerCase().includes(crop)) {
        crops.push(crop);
      }
    });

    return crops;
  }

  private parseProfile(data: any): SmartAIProfile {
    return {
      userId: data.user_id,
      identity: data.identity || {},
      behaviorPatterns: data.behavior_patterns || {},
      missingInfo: data.missing_info || {},
      proactiveInteraction: data.proactive_interaction || {},
      metadata: data.metadata || {}
    };
  }

  // ==================== ADMIN CONTROLS ====================
  
  getRules() {
    return this.rules;
  }

  async updateRule(path: string, value: any): Promise<void> {
    // Allow runtime rule updates
    const keys = path.split('.');
    let obj: any = this.rules;
    
    for (let i = 0; i < keys.length - 1; i++) {
      obj = obj[keys[i]];
    }
    
    obj[keys[keys.length - 1]] = value;
  }
}

export const smartAIService = new SmartAIService();
export type { SmartAIProfile, BlackBoxSummary };
