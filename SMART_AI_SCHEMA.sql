-- Smart AI Profiles Table
CREATE TABLE IF NOT EXISTS smart_ai_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Identity Information
  identity JSONB DEFAULT '{}'::jsonb,
  
  -- Behavior Patterns (learned from BlackBox)
  behavior_patterns JSONB DEFAULT '{
    "analysisFrequency": "occasional",
    "cropFocus": [],
    "weatherSensitivity": false,
    "marketEngagement": 0,
    "totalInteractions": 0
  }'::jsonb,
  
  -- Missing Information Tracker
  missing_info JSONB DEFAULT '{
    "name": true,
    "location": true,
    "primaryCrops": true,
    "farmSize": true,
    "experienceLevel": true
  }'::jsonb,
  
  -- Proactive Interaction State
  proactive_interaction JSONB DEFAULT '{
    "nextQuestionTime": null,
    "currentQuestionTopic": null,
    "questionCooldown": 3,
    "questionsAskedThisWeek": 0
  }'::jsonb,
  
  -- Metadata
  metadata JSONB DEFAULT '{
    "createdAt": null,
    "lastUpdated": null,
    "daysActive": 0,
    "geminiCallsToday": 0,
    "lastGeminiCallDate": null
  }'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- AI Conversations Table (for history and learning)
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  context JSONB DEFAULT '{}'::jsonb,
  was_cached BOOLEAN DEFAULT false,
  used_gemini BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Learning Events (track what AI learns about users)
CREATE TABLE IF NOT EXISTS ai_learning_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'question_asked', 'info_learned', 'pattern_detected'
  event_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_smart_ai_profiles_user_id ON smart_ai_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_created_at ON ai_conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_learning_events_user_id ON ai_learning_events(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_learning_events_type ON ai_learning_events(event_type);

-- Row Level Security
ALTER TABLE smart_ai_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_learning_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for smart_ai_profiles
CREATE POLICY "Users can view own AI profile"
  ON smart_ai_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI profile"
  ON smart_ai_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own AI profile"
  ON smart_ai_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for ai_conversations
CREATE POLICY "Users can view own conversations"
  ON ai_conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations"
  ON ai_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for ai_learning_events
CREATE POLICY "Users can view own learning events"
  ON ai_learning_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own learning events"
  ON ai_learning_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Function to reset weekly question counter
CREATE OR REPLACE FUNCTION reset_weekly_questions()
RETURNS void AS $$
BEGIN
  UPDATE smart_ai_profiles
  SET proactive_interaction = jsonb_set(
    proactive_interaction,
    '{questionsAskedThisWeek}',
    '0'
  )
  WHERE (proactive_interaction->>'questionsAskedThisWeek')::int > 0;
END;
$$ LANGUAGE plpgsql;

-- Function to update days active
CREATE OR REPLACE FUNCTION update_days_active()
RETURNS void AS $$
BEGIN
  UPDATE smart_ai_profiles
  SET metadata = jsonb_set(
    metadata,
    '{daysActive}',
    to_jsonb(
      EXTRACT(DAY FROM (NOW() - (metadata->>'createdAt')::timestamp))::int
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE smart_ai_profiles IS 'Stores user profiles for Smart AI personalization';
COMMENT ON TABLE ai_conversations IS 'Stores AI conversation history for learning and context';
COMMENT ON TABLE ai_learning_events IS 'Tracks AI learning events and pattern discoveries';
