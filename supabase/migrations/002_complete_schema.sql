-- ================================================
-- Video Generator - Complete Database Schema
-- ================================================
-- This migration creates all tables required for the video generator application
-- Run this after 001_initial_schema.sql
--
-- Tables created:
-- 1. generated_videos - Stores metadata about generated videos
-- 2. conversations - Chat conversation sessions
-- 3. messages - Individual messages within conversations
-- 4. video_costs - Cost tracking for video generation
-- 5. styles - User-defined styles and preferences
--
-- Author: Video Generator AI
-- Date: 2025-11-01
-- ================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- Table: generated_videos
-- Purpose: Store metadata and URLs for generated videos
-- ================================================
CREATE TABLE IF NOT EXISTS public.generated_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id TEXT UNIQUE NOT NULL,

  -- URLs
  fal_url TEXT NOT NULL,
  supabase_url TEXT,

  -- Generation parameters
  prompt TEXT NOT NULL,
  duration INTEGER NOT NULL DEFAULT 5,
  resolution TEXT NOT NULL DEFAULT '720p',
  aspect_ratio TEXT NOT NULL DEFAULT '16:9',
  model_used TEXT NOT NULL,
  seed INTEGER,

  -- Organization
  generation_session UUID,
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',

  -- User preferences
  is_favorite BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for generated_videos
CREATE INDEX IF NOT EXISTS idx_generated_videos_video_id ON public.generated_videos(video_id);
CREATE INDEX IF NOT EXISTS idx_generated_videos_generation_session ON public.generated_videos(generation_session);
CREATE INDEX IF NOT EXISTS idx_generated_videos_created_at ON public.generated_videos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generated_videos_is_favorite ON public.generated_videos(is_favorite) WHERE is_favorite = true;
CREATE INDEX IF NOT EXISTS idx_generated_videos_model_used ON public.generated_videos(model_used);
CREATE INDEX IF NOT EXISTS idx_generated_videos_tags ON public.generated_videos USING GIN(tags);

-- RLS Policies for generated_videos
ALTER TABLE public.generated_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to generated_videos"
  ON public.generated_videos
  FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to insert videos"
  ON public.generated_videos
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update their videos"
  ON public.generated_videos
  FOR UPDATE
  USING (true);

-- Grant permissions
GRANT SELECT ON public.generated_videos TO anon, authenticated;
GRANT INSERT, UPDATE ON public.generated_videos TO authenticated;

-- ================================================
-- Table: conversations
-- Purpose: Store chat conversation sessions
-- ================================================
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id TEXT UNIQUE NOT NULL,

  -- Conversation metadata
  title TEXT,
  metadata JSONB DEFAULT '{}',

  -- User preferences
  is_favorite BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for conversations
CREATE INDEX IF NOT EXISTS idx_conversations_conversation_id ON public.conversations(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON public.conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_is_favorite ON public.conversations(is_favorite) WHERE is_favorite = true;

-- RLS Policies for conversations
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to conversations"
  ON public.conversations
  FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to create conversations"
  ON public.conversations
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update conversations"
  ON public.conversations
  FOR UPDATE
  USING (true);

-- Grant permissions
GRANT SELECT ON public.conversations TO anon, authenticated;
GRANT INSERT, UPDATE ON public.conversations TO authenticated;

-- ================================================
-- Table: messages
-- Purpose: Store individual messages within conversations
-- ================================================
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id TEXT UNIQUE NOT NULL,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,

  -- Message content
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'tool')),
  content TEXT NOT NULL,

  -- Tool calling
  tool_called TEXT,
  tool_result JSONB,

  -- Additional metadata
  metadata JSONB DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for messages
CREATE INDEX IF NOT EXISTS idx_messages_message_id ON public.messages(message_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_role ON public.messages(role);

-- RLS Policies for messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to messages"
  ON public.messages
  FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to create messages"
  ON public.messages
  FOR INSERT
  WITH CHECK (true);

-- Grant permissions
GRANT SELECT ON public.messages TO anon, authenticated;
GRANT INSERT ON public.messages TO authenticated;

-- ================================================
-- Table: video_costs
-- Purpose: Track costs associated with video generation
-- ================================================
CREATE TABLE IF NOT EXISTS public.video_costs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id TEXT NOT NULL,

  -- Cost details
  model TEXT NOT NULL,
  duration INTEGER NOT NULL,
  cost_per_second DECIMAL(10, 4) NOT NULL,
  total_cost DECIMAL(10, 4) NOT NULL,

  -- Generation parameters
  include_audio BOOLEAN DEFAULT false,
  resolution TEXT,
  aspect_ratio TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for video_costs
CREATE INDEX IF NOT EXISTS idx_video_costs_video_id ON public.video_costs(video_id);
CREATE INDEX IF NOT EXISTS idx_video_costs_created_at ON public.video_costs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_video_costs_model ON public.video_costs(model);
CREATE INDEX IF NOT EXISTS idx_video_costs_total_cost ON public.video_costs(total_cost);

-- RLS Policies for video_costs
ALTER TABLE public.video_costs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to video_costs"
  ON public.video_costs
  FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to insert costs"
  ON public.video_costs
  FOR INSERT
  WITH CHECK (true);

-- Grant permissions
GRANT SELECT ON public.video_costs TO anon, authenticated;
GRANT INSERT ON public.video_costs TO authenticated;

-- ================================================
-- Table: styles
-- Purpose: Store user-defined styles and generation preferences
-- ================================================
CREATE TABLE IF NOT EXISTS public.styles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  style_id TEXT UNIQUE NOT NULL,

  -- Style details
  name TEXT NOT NULL,
  description TEXT,
  prompt TEXT NOT NULL,

  -- Visual reference
  image_url TEXT,
  thumbnail_url TEXT,

  -- Style preferences
  preferred_model TEXT,
  preferred_duration INTEGER DEFAULT 5,
  preferred_resolution TEXT DEFAULT '720p',
  preferred_aspect_ratio TEXT DEFAULT '16:9',

  -- Metadata
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',

  -- User preferences
  is_favorite BOOLEAN DEFAULT false,
  use_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for styles
CREATE INDEX IF NOT EXISTS idx_styles_style_id ON public.styles(style_id);
CREATE INDEX IF NOT EXISTS idx_styles_name ON public.styles(name);
CREATE INDEX IF NOT EXISTS idx_styles_created_at ON public.styles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_styles_is_favorite ON public.styles(is_favorite) WHERE is_favorite = true;
CREATE INDEX IF NOT EXISTS idx_styles_use_count ON public.styles(use_count DESC);
CREATE INDEX IF NOT EXISTS idx_styles_tags ON public.styles USING GIN(tags);

-- RLS Policies for styles
ALTER TABLE public.styles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to styles"
  ON public.styles
  FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to manage styles"
  ON public.styles
  FOR ALL
  USING (true);

-- Grant permissions
GRANT SELECT ON public.styles TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.styles TO authenticated;

-- ================================================
-- Triggers: Auto-update updated_at timestamps
-- ================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables with updated_at
CREATE TRIGGER update_generated_videos_updated_at
  BEFORE UPDATE ON public.generated_videos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_styles_updated_at
  BEFORE UPDATE ON public.styles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- Foreign Key Constraints
-- ================================================
-- Add foreign key from generated_videos to conversations (optional relationship)
ALTER TABLE public.generated_videos
  ADD CONSTRAINT fk_generated_videos_conversation
  FOREIGN KEY (generation_session)
  REFERENCES public.conversations(id)
  ON DELETE SET NULL;

-- ================================================
-- Comments for documentation
-- ================================================
COMMENT ON TABLE public.generated_videos IS 'Stores metadata and URLs for AI-generated videos';
COMMENT ON TABLE public.conversations IS 'Chat conversation sessions for video generation';
COMMENT ON TABLE public.messages IS 'Individual messages within chat conversations';
COMMENT ON TABLE public.video_costs IS 'Cost tracking for video generation operations';
COMMENT ON TABLE public.styles IS 'User-defined styles and generation preferences';

-- ================================================
-- Migration Complete
-- ================================================
-- All tables, indexes, RLS policies, and triggers have been created
-- You can verify with: SELECT tablename FROM pg_tables WHERE schemaname = 'public';
