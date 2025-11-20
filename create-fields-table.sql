-- Create or update fields table with correct schema
-- Run this in Supabase SQL Editor

-- Create fields table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  crop_type TEXT NOT NULL,
  area DECIMAL(10, 2) NOT NULL DEFAULT 0,
  coordinates JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'harvested', 'dormant')),
  harvest_date TIMESTAMPTZ,
  last_crop_type TEXT,
  reactivation_date TIMESTAMPTZ,
  lifecycle_metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns if table already exists
ALTER TABLE public.fields 
ADD COLUMN IF NOT EXISTS location TEXT;

ALTER TABLE public.fields 
ADD COLUMN IF NOT EXISTS coordinates JSONB DEFAULT '[]'::jsonb;

ALTER TABLE public.fields 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

ALTER TABLE public.fields 
ADD COLUMN IF NOT EXISTS harvest_date TIMESTAMPTZ;

ALTER TABLE public.fields 
ADD COLUMN IF NOT EXISTS last_crop_type TEXT;

ALTER TABLE public.fields 
ADD COLUMN IF NOT EXISTS reactivation_date TIMESTAMPTZ;

ALTER TABLE public.fields 
ADD COLUMN IF NOT EXISTS lifecycle_metadata JSONB DEFAULT '{}'::jsonb;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_fields_user_id ON public.fields(user_id);
CREATE INDEX IF NOT EXISTS idx_fields_status ON public.fields(status);
CREATE INDEX IF NOT EXISTS idx_fields_created_at ON public.fields(created_at DESC);

-- Enable RLS
ALTER TABLE public.fields ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own fields" ON public.fields;
DROP POLICY IF EXISTS "Users can insert own fields" ON public.fields;
DROP POLICY IF EXISTS "Users can update own fields" ON public.fields;
DROP POLICY IF EXISTS "Users can delete own fields" ON public.fields;

-- Create RLS policies
CREATE POLICY "Users can view own fields"
ON public.fields
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fields"
ON public.fields
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own fields"
ON public.fields
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own fields"
ON public.fields
FOR DELETE
USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_fields_updated_at ON public.fields;
CREATE TRIGGER update_fields_updated_at
BEFORE UPDATE ON public.fields
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Verify the schema
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'fields' AND table_schema = 'public'
ORDER BY ordinal_position;
