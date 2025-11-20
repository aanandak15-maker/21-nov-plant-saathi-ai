import ragKnowledgeBase from './ragKnowledgeBase.json';

interface RAGExample {
  id: string;
  question: string;
  question_variants: string[];
  context_required: string[];
  answer_template: string;
  metadata: {
    category: string;
    language: string;
    confidence_threshold: number;
    follow_up_questions: string[];
    data_collection_strategy: Record<string, string>;
  };
}

interface RAGMatch {
  example: RAGExample;
  similarity: number;
  context: Record<string, any>;
}

class RAGService {
  private knowledgeBase = ragKnowledgeBase;

  /**
   * Find best matching example from knowledge base
   */
  findBestMatch(query: string, userContext: any): RAGMatch | null {
    const normalizedQuery = this.normalizeQuery(query);
    let bestMatch: RAGMatch | null = null;
    let highestSimilarity = 0;

    for (const example of this.knowledgeBase.examples) {
      const similarity = this.calculateSimilarity(
        normalizedQuery,
        example.question,
        example.question_variants
      );

      if (similarity > highestSimilarity && similarity > example.metadata.confidence_threshold) {
        highestSimilarity = similarity;
        bestMatch = {
          example,
          similarity,
          context: this.extractContext(example.context_required, userContext)
        };
      }
    }

    return bestMatch;
  }

  /**
   * Generate response from RAG template
   */
  generateResponse(match: RAGMatch): string {
    let response = match.example.answer_template;

    // Replace placeholders with actual values
    Object.keys(match.context).forEach(key => {
      const placeholder = `{${key}}`;
      const value = match.context[key];
      response = response.replace(new RegExp(placeholder, 'g'), value);
    });

    // Add follow-up questions
    const followUps = match.example.metadata.follow_up_questions;
    if (followUps && followUps.length > 0) {
      // Follow-ups are already in the template
    }

    return response;
  }

  /**
   * Get response pattern for category
   */
  getResponsePattern(category: string) {
    return this.knowledgeBase.response_patterns[category as keyof typeof this.knowledgeBase.response_patterns];
  }

  /**
   * Get strategic follow-up questions
   */
  getFollowUpQuestions(strategy: string): string[] {
    return this.knowledgeBase.follow_up_strategies[strategy as keyof typeof this.knowledgeBase.follow_up_strategies] || [];
  }

  /**
   * Calculate similarity between query and example
   */
  private calculateSimilarity(query: string, example: string, variants: string[]): number {
    const allExamples = [example, ...variants];
    let maxSimilarity = 0;

    for (const ex of allExamples) {
      const similarity = this.stringSimilarity(query, this.normalizeQuery(ex));
      maxSimilarity = Math.max(maxSimilarity, similarity);
    }

    return maxSimilarity;
  }

  /**
   * Simple string similarity (Jaccard similarity)
   */
  private stringSimilarity(str1: string, str2: string): number {
    const words1 = new Set(str1.split(' '));
    const words2 = new Set(str2.split(' '));

    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);

    return intersection.size / union.size;
  }

  /**
   * Normalize query for matching
   */
  private normalizeQuery(query: string): string {
    return query
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .trim();
  }

  /**
   * Extract required context from user data
   */
  private extractContext(required: string[], userContext: any): Record<string, any> {
    const context: Record<string, any> = {};

    required.forEach(key => {
      if (userContext[key] !== undefined) {
        context[key] = userContext[key];
      }
    });

    return context;
  }

  /**
   * Enhance system prompt with RAG examples
   */
  enhanceSystemPrompt(basePrompt: string, category?: string): string {
    let enhanced = basePrompt;

    if (category) {
      const pattern = this.getResponsePattern(category);
      if (pattern) {
        enhanced += `\n\n## RESPONSE FORMAT FOR ${category.toUpperCase()}:
Format: ${pattern.format}
Emojis to use: ${pattern.emojis.join(' ')}
Tone: ${pattern.tone}
Max length: ${pattern.max_length} words

IMPORTANT: Follow this format strictly for ${category} questions.`;
      }
    }

    // Add example responses
    enhanced += `\n\n## EXAMPLE RESPONSES:

**Disease Detection Example:**
🦠 **Early Blight detect hui hai** (confidence: 88%)

**Turant karein:**
- Infected leaves hata ke jala dein
- Mancozeb 75% WP spray karein (2g/liter)
- 7 din baad dobara spray

**Recovery time:** 10-14 din

📸 **Ek aur photo bhej sakte ho?**

**Irrigation Example:**
🌧️ **Nahi! Kal-parson baarish aayegi**

**Weather forecast:**
- Kal: 18mm rain
- Parson: 22mm rain

❌ Aaj irrigation skip karo
💰 **₹1200 bachega**

📍 **Aapke gaon mein recent mein barish hui thi?**

ALWAYS end with 1-2 strategic follow-up questions to learn more about the farmer.`;

    return enhanced;
  }

  /**
   * Check if query matches RAG knowledge base
   */
  hasRAGMatch(query: string, userContext: any): boolean {
    const match = this.findBestMatch(query, userContext);
    return match !== null && match.similarity > 0.6;
  }

  /**
   * Get category from query
   */
  detectCategory(query: string): string | null {
    const keywords = {
      disease_detection: ['disease', 'bimari', 'spot', 'dhaba', 'yellow', 'pila', 'brown', 'pest', 'keeda'],
      soil_health: ['ndvi', 'soil', 'mitti', 'slow', 'growth', 'badh', 'fasal'],
      irrigation: ['pani', 'water', 'irrigation', 'sinchai', 'daalun'],
      fertilizer: ['khad', 'fertilizer', 'urea', 'dap', 'nitrogen'],
      marketplace: ['buy', 'kharidna', 'chahiye', 'product', 'spray'],
      mandi_price: ['rate', 'price', 'bhav', 'mandi', 'bechna', 'sell'],
      crop_rotation: ['rotation', 'baad', 'after', 'next', 'kya bona'],
      pest_management: ['keeda', 'pest', 'insect', 'aphid', 'caterpillar']
    };

    const normalizedQuery = this.normalizeQuery(query);

    for (const [category, words] of Object.entries(keywords)) {
      if (words.some(word => normalizedQuery.includes(word))) {
        return category;
      }
    }

    return null;
  }
}

export const ragService = new RAGService();
export type { RAGExample, RAGMatch };
