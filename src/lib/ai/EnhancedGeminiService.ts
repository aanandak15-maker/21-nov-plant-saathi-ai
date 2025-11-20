import { smartAIService } from './SmartAIService';
import { supabase } from '../supabase';

interface CachedResponse {
  query: string;
  response: string;
  timestamp: number;
  userId: string;
}

class EnhancedGeminiService {
  private apiKey: string | null = null;
  private readonly GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';
  private responseCache: Map<string, CachedResponse> = new Map();
  private readonly CACHE_TTL_HOURS = 24;

  initialize(apiKey: string) {
    this.apiKey = apiKey;
  }

  isInitialized(): boolean {
    return this.apiKey !== null;
  }

  // ==================== SMART QUERY ROUTING ====================
  
  async chat(userId: string, message: string, context?: any): Promise<string> {
    // Step 1: Check if we should use local intelligence
    if (smartAIService.shouldUseLocalIntelligence(message)) {
      return this.handleLocalIntelligence(message, context);
    }

    // Step 2: Check cache
    const cachedResponse = this.getCachedResponse(userId, message);
    if (cachedResponse) {
      console.log('✅ Using cached response (cost saved)');
      return cachedResponse;
    }

    // Step 3: Check Gemini quota
    const canUseGemini = await smartAIService.canUseGemini(userId);
    if (!canUseGemini) {
      return this.handleQuotaExceeded(userId);
    }

    // Step 4: Build enhanced context
    const enhancedContext = await smartAIService.buildEnhancedContext(userId, message);

    // Step 5: Call Gemini with full context
    const response = await this.callGemini(message, enhancedContext, context);

    // Step 6: Track usage
    await smartAIService.incrementGeminiCall(userId);

    // Step 7: Cache response
    this.cacheResponse(userId, message, response);

    // Step 8: Save to conversation history
    await this.saveConversation(userId, message, response);

    return response;
  }

  // ==================== LOCAL INTELLIGENCE ====================
  
  private handleLocalIntelligence(query: string, context?: any): string {
    const lowerQuery = query.toLowerCase();

    // Weather queries
    if (lowerQuery.includes('weather') || lowerQuery.includes('मौसम') || lowerQuery.includes('बारिश')) {
      return 'I can help you check the weather. Please visit the Jal Saathi (Weather) section for detailed forecasts, rainfall predictions, and irrigation recommendations.';
    }

    // Mandi price queries
    if (lowerQuery.includes('price') || lowerQuery.includes('mandi') || lowerQuery.includes('भाव')) {
      return 'For current market prices, please check the Mandi Prices section. You can see live prices, historical trends, and price predictions for your crops.';
    }

    // Field queries
    if (lowerQuery.includes('field') || lowerQuery.includes('खेत') || lowerQuery.includes('ndvi')) {
      return 'To monitor your field health, visit the Soil Saathi section. You can view NDVI, soil moisture, vegetation indices, and get detailed field analysis.';
    }

    // Disease queries
    if (lowerQuery.includes('disease') || lowerQuery.includes('pest') || lowerQuery.includes('बीमारी')) {
      return 'For disease detection, please use the Disease Detection feature. You can upload photos of affected plants and get instant diagnosis with treatment recommendations.';
    }

    return 'I can help you with farming advice. Could you please be more specific about what you need?';
  }

  // ==================== GEMINI INTEGRATION ====================
  
  private async callGemini(message: string, userContext: string, additionalContext?: any): Promise<string> {
    if (!this.isInitialized()) {
      throw new Error('Gemini AI not initialized. Please add your API key in settings.');
    }

    const systemPrompt = `You are an expert agricultural advisor for Indian farmers. You provide practical, actionable advice in simple language.

${userContext}

Guidelines:
- Give specific, actionable advice
- Use simple language (avoid technical jargon)
- Consider local Indian farming practices
- Be encouraging and supportive
- If you don't know something, admit it
- Keep responses concise (2-3 paragraphs max)
- Use farmer-friendly language

${additionalContext ? `Additional Context: ${JSON.stringify(additionalContext)}` : ''}`;

    const fullPrompt = `${systemPrompt}\n\nUser Question: ${message}`;

    try {
      const response = await fetch(`${this.GEMINI_API_URL}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: fullPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Gemini API error:', errorData);
        
        if (response.status === 400 && errorData.error?.message?.includes('API key')) {
          throw new Error('Invalid API key. Please check your Gemini API key in settings.');
        }
        
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response from Gemini AI');
      }

      const text = data.candidates[0].content.parts[0].text;
      return text;
    } catch (error: any) {
      console.error('Gemini API error:', error);
      
      if (error.message?.includes('API key')) {
        throw new Error('Invalid API key. Please check your Gemini API key in settings.');
      }
      
      throw new Error('Failed to get response from AI. Please try again.');
    }
  }

  // ==================== CACHING ====================
  
  private getCachedResponse(userId: string, query: string): string | null {
    const cacheKey = this.generateCacheKey(userId, query);
    const cached = this.responseCache.get(cacheKey);

    if (!cached) {
      return null;
    }

    // Check if cache is still valid
    const ageHours = (Date.now() - cached.timestamp) / (1000 * 60 * 60);
    if (ageHours > this.CACHE_TTL_HOURS) {
      this.responseCache.delete(cacheKey);
      return null;
    }

    return cached.response;
  }

  private cacheResponse(userId: string, query: string, response: string): void {
    const cacheKey = this.generateCacheKey(userId, query);
    this.responseCache.set(cacheKey, {
      query,
      response,
      timestamp: Date.now(),
      userId
    });
  }

  private generateCacheKey(userId: string, query: string): string {
    // Normalize query for better cache hits
    const normalized = query.toLowerCase().trim().replace(/\s+/g, ' ');
    return `${userId}:${normalized}`;
  }

  // ==================== CONVERSATION HISTORY ====================
  
  private async saveConversation(userId: string, message: string, response: string): Promise<void> {
    try {
      await supabase.from('ai_conversations').insert({
        user_id: userId,
        message,
        response,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to save conversation:', error);
    }
  }

  async getConversationHistory(userId: string, limit: number = 10): Promise<any[]> {
    const { data, error } = await supabase
      .from('ai_conversations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Failed to load conversation history:', error);
      return [];
    }

    return data || [];
  }

  // ==================== QUOTA HANDLING ====================
  
  private handleQuotaExceeded(userId: string): string {
    return `I've reached my daily limit for detailed AI responses. However, I can still help you with:

• Weather forecasts (Jal Saathi)
• Market prices (Mandi Prices)
• Field monitoring (Soil Saathi)
• Disease detection
• Marketplace recommendations

These features work without AI limits. Your quota will reset tomorrow!`;
  }

  // ==================== PROACTIVE FEATURES ====================
  
  async checkForProactiveQuestion(userId: string): Promise<string | null> {
    return await smartAIService.getNextIntelligentQuestion(userId);
  }

  async getProactiveRecommendations(userId: string, fieldData?: any, weather?: any, mandiPrices?: any): Promise<string[]> {
    return await smartAIService.getProactiveRecommendations(userId, fieldData, weather, mandiPrices);
  }

  // ==================== ANALYTICS ====================
  
  async getUsageStats(userId: string): Promise<any> {
    const profile = await smartAIService.getOrCreateProfile(userId);
    
    return {
      geminiCallsToday: profile.metadata.geminiCallsToday,
      maxCallsPerDay: smartAIService.getRules().costOptimization.maxGeminiCallsPerDay,
      remainingCalls: Math.max(0, smartAIService.getRules().costOptimization.maxGeminiCallsPerDay - profile.metadata.geminiCallsToday),
      cacheHitRate: this.calculateCacheHitRate(),
      totalInteractions: profile.behaviorPatterns.totalInteractions
    };
  }

  private calculateCacheHitRate(): number {
    // Simplified calculation
    return this.responseCache.size > 0 ? 0.3 : 0; // 30% cache hit rate estimate
  }

  // ==================== ADMIN CONTROLS ====================
  
  clearCache(): void {
    this.responseCache.clear();
  }

  async updateCostSettings(maxCallsPerDay: number, cacheTTL: number): Promise<void> {
    await smartAIService.updateRule('costOptimization.maxGeminiCallsPerDay', maxCallsPerDay);
    // Cache TTL would need to be updated in the class property
  }
}

export const enhancedGeminiService = new EnhancedGeminiService();
