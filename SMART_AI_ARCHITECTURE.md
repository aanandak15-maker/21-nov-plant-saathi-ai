# 🏗️ Smart AI System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     USER INTERACTION                         │
│                  (AI Chat Interface)                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              ENHANCED GEMINI SERVICE                         │
│         (Smart Query Router & Optimizer)                     │
└─────┬───────────┬───────────┬──────────────┬────────────────┘
      │           │           │              │
      ▼           ▼           ▼              ▼
┌──────────┐ ┌─────────┐ ┌────────┐  ┌──────────────┐
│  LOCAL   │ │  CACHE  │ │ QUOTA  │  │   GEMINI     │
│INTELLIGENCE│ │ LAYER  │ │ CHECK  │  │   API        │
│  (FREE)  │ │ (FREE)  │ │        │  │  (PAID)      │
└──────────┘ └─────────┘ └────────┘  └──────────────┘
      │           │           │              │
      └───────────┴───────────┴──────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  SMART AI SERVICE                            │
│         (Profile Management & Learning)                      │
└─────┬───────────┬───────────┬──────────────┬────────────────┘
      │           │           │              │
      ▼           ▼           ▼              ▼
┌──────────┐ ┌─────────┐ ┌────────┐  ┌──────────────┐
│ PROFILE  │ │BLACKBOX │ │QUESTION│  │  PROACTIVE   │
│ BUILDER  │ │ANALYZER │ │GENERATOR│  │RECOMMENDATIONS│
└──────────┘ └─────────┘ └────────┘  └──────────────┘
      │           │           │              │
      └───────────┴───────────┴──────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE DATABASE                         │
│  • smart_ai_profiles  • ai_conversations                    │
│  • ai_learning_events • blackbox_logs                       │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Query Processing Flow

```
User Query
    │
    ▼
┌─────────────────────┐
│ Is it simple?       │ ← Check smartAIRules.json
│ (weather/price)     │
└─────────────────────┘
    │
    ├─ YES → Local Service (FREE) → Response
    │
    └─ NO
        │
        ▼
    ┌─────────────────────┐
    │ Is it cached?       │ ← Check response cache
    └─────────────────────┘
        │
        ├─ YES → Return cache (FREE) → Response
        │
        └─ NO
            │
            ▼
        ┌─────────────────────┐
        │ Check quota         │ ← Check daily limit
        └─────────────────────┘
            │
            ├─ EXCEEDED → Fallback message (FREE)
            │
            └─ OK
                │
                ▼
            ┌─────────────────────┐
            │ Build context       │ ← Load user profile
            └─────────────────────┘
                │
                ▼
            ┌─────────────────────┐
            │ Call Gemini API     │ ← PAID
            └─────────────────────┘
                │
                ▼
            ┌─────────────────────┐
            │ Cache response      │ ← Save for 24h
            │ Update profile      │
            │ Increment counter   │
            └─────────────────────┘
                │
                ▼
            Response
```

### 2. Learning Flow

```
User Actions
    │
    ▼
┌─────────────────────┐
│ BlackBox Logging    │ ← Every interaction logged
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ Weekly Analysis     │ ← Batch processing
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ Pattern Detection   │ ← Identify behaviors
│ • Field scans: 15   │
│ • Weather checks: 8 │
│ • Disease use: 0    │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ Gap Identification  │ ← What's missing?
│ • No crops set      │
│ • Never used disease│
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ Question Scheduling │ ← Smart timing
│ Next: 3 days        │
│ Topic: crops        │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ User Responds       │ ← Answer captured
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ Profile Updated     │ ← Better context
└─────────────────────┘
    │
    ▼
Better Recommendations
```

## Component Architecture

### Core Services

```typescript
// 1. Smart AI Service (Brain)
class SmartAIService {
  - getOrCreateProfile()
  - analyzeUserBehavior()
  - getNextIntelligentQuestion()
  - updateBehaviorPatterns()
  - buildEnhancedContext()
}

// 2. Enhanced Gemini Service (Router)
class EnhancedGeminiService {
  - chat() // Main entry point
  - handleLocalIntelligence()
  - callGemini()
  - getCachedResponse()
  - canUseGemini()
}

// 3. Rules Engine (Configuration)
smartAIRules.json {
  - costOptimization
  - intelligentQuestions
  - behaviorPatterns
  - proactiveRecommendations
}
```

### Database Schema

```sql
-- User Profiles
smart_ai_profiles
├── user_id (FK)
├── identity (JSONB)
├── behavior_patterns (JSONB)
├── missing_info (JSONB)
├── proactive_interaction (JSONB)
└── metadata (JSONB)

-- Conversation History
ai_conversations
├── user_id (FK)
├── message
├── response
├── was_cached
├── used_gemini
└── created_at

-- Learning Events
ai_learning_events
├── user_id (FK)
├── event_type
├── event_data (JSONB)
└── created_at
```

## Cost Optimization Layers

### Layer 1: Local Intelligence (60% savings)
```
Simple queries → Direct to local services
No API calls, instant response
```

### Layer 2: Response Cache (30% savings)
```
Duplicate queries → Served from cache
24-hour TTL, configurable
```

### Layer 3: Quota Management (10% optimization)
```
Daily limits → Prevent overuse
Graceful fallback → User still helped
```

## Security & Privacy

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                           │
├─────────────────────────────────────────────────────────────┤
│ 1. Row Level Security (RLS)                                 │
│    - Users can only access own data                         │
│                                                              │
│ 2. Data Anonymization                                       │
│    - PII removed from analytics                             │
│                                                              │
│ 3. Consent Management                                       │
│    - Opt-in for behavior analysis                           │
│                                                              │
│ 4. Data Retention                                           │
│    - Auto-delete after 365 days                             │
└─────────────────────────────────────────────────────────────┘
```

## Scalability

### Horizontal Scaling
```
1 user → ₹15/month
100 users → ₹1,500/month
1,000 users → ₹15,000/month
10,000 users → ₹150,000/month

Linear growth, not exponential!
```

### Performance Optimization
```
- In-memory caching for hot data
- Batch processing for analytics
- Indexed database queries
- Lazy loading of profiles
```

## Monitoring & Observability

```
┌─────────────────────────────────────────────────────────────┐
│                    METRICS TRACKED                           │
├─────────────────────────────────────────────────────────────┤
│ • Gemini calls per user per day                             │
│ • Cache hit rate                                            │
│ • Local intelligence usage                                  │
│ • Question response rate                                    │
│ • Profile completion rate                                   │
│ • Cost per user                                             │
│ • API latency                                               │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      VERCEL                                  │
│                  (Frontend + API)                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE                                  │
│         (Database + Auth + Storage)                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  GOOGLE GEMINI                               │
│                  (AI Processing)                             │
└─────────────────────────────────────────────────────────────┘
```

## Configuration Management

### Single Source of Truth
```
src/lib/ai/smartAIRules.json
    │
    ├─ Cost settings
    ├─ Question triggers
    ├─ Behavior patterns
    ├─ Proactive rules
    └─ Privacy settings
```

### Runtime Updates
```typescript
// Change any rule without redeployment
await smartAIService.updateRule('costOptimization.maxGeminiCallsPerDay', 100);
```

## Integration Points

```
Smart AI System
    │
    ├─ BlackBox Analytics (behavior data)
    ├─ Jal Saathi (weather service)
    ├─ Soil Saathi (field service)
    ├─ Mandi Prices (market service)
    ├─ Disease Detection (diagnosis service)
    └─ Marketplace (product service)
```

## Future Enhancements

1. **ML-based pattern recognition** (Phase 2)
2. **Multi-language question generation** (Phase 3)
3. **Predictive recommendations** (Phase 4)
4. **A/B testing framework** (Phase 5)

---

**Current Status: Production Ready ✅**
