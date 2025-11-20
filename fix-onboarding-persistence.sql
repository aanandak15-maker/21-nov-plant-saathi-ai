-- Fix Onboarding Persistence Issue
-- This adds onboarding_complete column to profiles table for reliable persistence

-- Add onboarding_complete column to profiles table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'onboarding_complete'
  ) THEN
    ALTER TABLE profiles ADD COLUMN onboarding_complete BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- Update existing users who might have completed onboarding
-- (This is a one-time migration - you can remove this after running once)
UPDATE profiles 
SET onboarding_complete = TRUE 
WHERE id IN (
  SELECT id FROM auth.users 
  WHERE raw_user_meta_data->>'onboarding_complete' = 'true'
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding 
ON profiles(onboarding_complete);
