-- ============================================
-- Cart Persistence Fix - Supabase Schema
-- ============================================
-- This creates a user_carts table to persist shopping carts
-- across sessions and devices for logged-in users

-- Create user_carts table
CREATE TABLE IF NOT EXISTS user_carts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cart_data JSONB NOT NULL DEFAULT '{"items": [], "total": 0, "itemCount": 0}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_carts_user_id ON user_carts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_carts_updated_at ON user_carts(updated_at);

-- Enable Row Level Security
ALTER TABLE user_carts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see their own cart
CREATE POLICY "Users can view own cart"
  ON user_carts
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own cart
CREATE POLICY "Users can insert own cart"
  ON user_carts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own cart
CREATE POLICY "Users can update own cart"
  ON user_carts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own cart
CREATE POLICY "Users can delete own cart"
  ON user_carts
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_carts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function
DROP TRIGGER IF EXISTS update_user_carts_updated_at_trigger ON user_carts;
CREATE TRIGGER update_user_carts_updated_at_trigger
  BEFORE UPDATE ON user_carts
  FOR EACH ROW
  EXECUTE FUNCTION update_user_carts_updated_at();

-- Grant permissions
GRANT ALL ON user_carts TO authenticated;
GRANT ALL ON user_carts TO service_role;

-- ============================================
-- Verification Queries
-- ============================================

-- Check if table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'user_carts'
);

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'user_carts';

-- Sample query to test (replace with actual user_id)
-- SELECT * FROM user_carts WHERE user_id = 'your-user-id';

COMMENT ON TABLE user_carts IS 'Stores user shopping carts for persistence across sessions';
COMMENT ON COLUMN user_carts.cart_data IS 'JSONB containing cart items, total, and itemCount';
