# 🧠 RAG System - Complete Guide

## What is RAG?

**RAG (Retrieval-Augmented Generation)** = Smart AI that learns from examples

Instead of just answering questions, your AI now:
1. **Retrieves** similar examples from knowledge base
2. **Augments** response with proven patterns
3. **Generates** contextual answers with strategic follow-ups

## Files Created

1. **`src/lib/ai/ragKnowledgeBase.json`** - Knowledge base with 50+ examples
2. **`src/lib/ai/RAGService.ts`** - RAG matching and retrieval engine
3. **Updated `src/lib/geminiAIService.ts`** - Now uses RAG enhancement

## How It Works

### Flow:
```
User asks: "gehu ke patte pe brown spot hai"
    ↓
RAG Service finds similar example
    ↓
Extracts response pattern
    ↓
Gemini generates answer following pattern
    ↓
Adds strategic follow-up questions
    ↓
Collects farmer response for learning
```

## Knowledge Base Structure

Each example has:

```json
{
  "question": "farmer query",
  "question_variants": ["alternative phrasings"],
  "context_required": ["field_data", "weather"],
  "answer_template": "response format with {placeholders}",
  "metadata": {
    "category": "disease/soil/weather",
    "language": "hi/en/bn",
    "confidence_threshold": 0.85,
    "follow_up_questions": ["strategic questions"],
    "data_collection_strategy": {
      "what_to_learn": "how_to_use_it"
    }
  }
}
```

## Response Patterns

### Disease Detection
```
🦠 **{disease_name} detect hui hai** (confidence: {confidence}%)

**Turant karein:**
- {action_1}
- {action_2}

**Recovery time:** {days} din

📸 **Close-up photo bhej sakte ho?**
```

### Soil Health
```
⚠️ **NDVI bahut kam hai** - {current} (hona chahiye {expected}+)

**Main problem:** {problem}

**Turant solution:**
- {solution_1}
- {solution_2}

💬 **Patte ka color kaisa hai?**
```

### Irrigation
```
🌧️ **{recommendation}**

**Weather forecast:**
- Kal: {rain}mm rain

❌/✅ {action}
💰 **₹{savings} bachega**

📍 **Recent mein barish hui thi?**
```

## How to Add New Examples

### Step 1: Add to Knowledge Base

Edit `src/lib/ai/ragKnowledgeBase.json`:

```json
{
  "id": "new_example_001",
  "question": "main farmer question",
  "question_variants": [
    "alternative way to ask",
    "हिंदी में",
    "another variant"
  ],
  "context_required": ["crop", "location"],
  "answer_template": "Your response with {placeholders}",
  "metadata": {
    "category": "your_category",
    "language": "hi",
    "confidence_threshold": 0.85,
    "follow_up_questions": [
      "Strategic question 1?",
      "Strategic question 2?"
    ],
    "data_collection_strategy": {
      "what_you_want_to_learn": "how_to_use_it"
    }
  }
}
```

### Step 2: Test It

Ask the AI a similar question and see if it matches!

## Strategic Follow-Up Questions

### Why They Matter

Each response ends with 1-2 questions that:
1. **Collect missing data** (crop type, timing, location)
2. **Validate AI accuracy** (ground truth)
3. **Learn farmer behavior** (preferences, constraints)
4. **Improve future responses** (training data)

### Types of Follow-Ups

**Visual Confirmation:**
- "Ek aur photo bhej sakte ho?"
- "Close-up image mil sakti hai?"

**Temporal Context:**
- "Ye problem kitne din se hai?"
- "Pichli baar kab dekha tha?"

**Spatial Pattern:**
- "Poore field mein hai ya kuch areas mein?"
- "Kis taraf zyada hai?"

**Historical Practice:**
- "Pehle kya use karte the?"
- "Last time kab daala tha?"

**Economic Constraint:**
- "Budget kitna hai?"
- "Cash ki urgent need hai?"

## Data Collection Strategy

Every interaction collects data:

```json
"data_collection_strategy": {
  "visual_training": "disease_progression_images",
  "temporal_pattern": "onset_to_detection_lag",
  "spatial_pattern": "field_uniformity_issues",
  "brand_loyalty": "regional_trust_patterns",
  "economic_behavior": "farm_size_budget_correlation"
}
```

This data improves:
- Disease detection accuracy
- Weather prediction validation
- Product recommendations
- Price predictions
- Yield forecasting

## Categories Covered

1. **disease_detection** - Crop diseases and pests
2. **soil_health** - NDVI, nutrients, growth issues
3. **irrigation** - Water management, timing
4. **fertilizer** - NPK recommendations
5. **marketplace** - Product recommendations
6. **mandi_price** - Market prices, selling advice
7. **crop_rotation** - What to plant next
8. **pest_management** - Pest control
9. **general_advisory** - Overall farm health

## Response Format Rules

Each category has specific format:

```json
"disease_detection": {
  "format": "emoji + diagnosis + confidence + actions + timeline + follow_ups",
  "emojis": ["🦠", "🐛", "⚠️", "📸"],
  "tone": "urgent_but_reassuring",
  "max_length": 150
}
```

## How to Customize

### Change Response Format

Edit `response_patterns` in `ragKnowledgeBase.json`:

```json
"disease_detection": {
  "format": "your custom format",
  "emojis": ["your", "emojis"],
  "tone": "your_tone",
  "max_length": 100
}
```

### Add New Category

1. Add to `categories` array
2. Add examples with that category
3. Add response pattern
4. Add keyword detection in `RAGService.ts`

### Change Follow-Up Strategy

Edit `follow_up_strategies`:

```json
"your_strategy": [
  "Question 1?",
  "Question 2?",
  "Question 3?"
]
```

## Testing

### Test RAG Matching

```typescript
import { ragService } from '@/lib/ai/RAGService';

const match = ragService.findBestMatch(
  "gehu ke patte pe brown spot hai",
  { crop: "wheat", location: "Punjab" }
);

console.log(match?.similarity); // 0.92
console.log(match?.example.metadata.category); // "disease_detection"
```

### Test Category Detection

```typescript
const category = ragService.detectCategory("khad chahiye nitrogen ki");
console.log(category); // "fertilizer"
```

## Benefits

### For Farmers:
- ✅ Consistent, high-quality responses
- ✅ Actionable advice with clear steps
- ✅ Cost savings highlighted
- ✅ Follow-up questions show AI cares

### For You:
- ✅ Collects training data automatically
- ✅ Improves AI accuracy over time
- ✅ Learns farmer preferences
- ✅ Validates predictions with ground truth

### For Business:
- ✅ Better user engagement
- ✅ More data = better models
- ✅ Personalized recommendations
- ✅ Higher conversion rates

## Expansion Strategy

### Phase 1 (Current):
- 50+ examples across 9 categories
- Basic pattern matching
- Strategic follow-ups

### Phase 2 (Next):
- 500+ examples
- Semantic search (embeddings)
- Multi-turn conversations
- Context memory

### Phase 3 (Future):
- 5000+ examples
- Vector database (Pinecone/Weaviate)
- Real-time learning
- Personalized per farmer

## Integration with Smart AI

RAG works with Smart AI system:

```
User Query
    ↓
Smart AI checks quota
    ↓
RAG finds best example
    ↓
Gemini generates response
    ↓
Smart AI adds follow-ups
    ↓
Stores interaction
    ↓
Updates knowledge base
```

## Monitoring

Track RAG effectiveness:

```typescript
// In your analytics
{
  "rag_match_rate": 0.75,  // 75% queries matched
  "avg_similarity": 0.88,   // High confidence
  "follow_up_response_rate": 0.62,  // 62% answer follow-ups
  "data_collected": 1247    // Training examples
}
```

## Best Practices

1. **Add Real Examples**: Use actual farmer questions
2. **Test Variants**: Add multiple ways to ask same thing
3. **Strategic Follow-Ups**: Always ask questions that collect data
4. **Update Regularly**: Add new examples weekly
5. **Monitor Performance**: Track which examples work best

## Quick Reference

**Add Example**: Edit `ragKnowledgeBase.json`
**Change Format**: Edit `response_patterns`
**Add Follow-Ups**: Edit `follow_up_strategies`
**Test Matching**: Use `ragService.findBestMatch()`
**Detect Category**: Use `ragService.detectCategory()`

---

**Your AI is now learning from every interaction!** 🚀
