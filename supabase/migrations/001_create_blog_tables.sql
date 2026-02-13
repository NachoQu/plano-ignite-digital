-- Blog Posts table
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title_es TEXT NOT NULL,
  title_en TEXT NOT NULL,
  summary_es TEXT NOT NULL,
  summary_en TEXT NOT NULL,
  content_es TEXT NOT NULL,
  content_en TEXT NOT NULL,
  excerpt_es TEXT NOT NULL,
  excerpt_en TEXT NOT NULL,
  image_url TEXT NOT NULL,
  image_alt_es TEXT NOT NULL,
  image_alt_en TEXT NOT NULL,
  source_url TEXT NOT NULL,
  source_name TEXT NOT NULL,
  topic TEXT NOT NULL CHECK (topic IN ('ai', 'nocode', 'lovable', 'webdev', 'technology')),
  related_service TEXT CHECK (related_service IN ('branding', 'web', 'tools', 'mvp', 'edtech', 'social')),
  cta_message_es TEXT NOT NULL,
  cta_message_en TEXT NOT NULL,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_published BOOLEAN DEFAULT true,
  reading_time_minutes INTEGER DEFAULT 3
);

-- Indexes for common queries
CREATE INDEX idx_blog_posts_published ON blog_posts (is_published, published_at DESC);
CREATE INDEX idx_blog_posts_topic ON blog_posts (topic) WHERE is_published = true;
CREATE INDEX idx_blog_posts_slug ON blog_posts (slug);

-- Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published posts"
  ON blog_posts FOR SELECT
  USING (is_published = true);

-- Storage bucket for blog images (run via Supabase dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true);
