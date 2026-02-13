
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title_es TEXT NOT NULL,
  title_en TEXT NOT NULL,
  summary_es TEXT NOT NULL DEFAULT '',
  summary_en TEXT NOT NULL DEFAULT '',
  content_es TEXT NOT NULL DEFAULT '',
  content_en TEXT NOT NULL DEFAULT '',
  excerpt_es TEXT NOT NULL DEFAULT '',
  excerpt_en TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  image_alt_es TEXT NOT NULL DEFAULT '',
  image_alt_en TEXT NOT NULL DEFAULT '',
  source_url TEXT NOT NULL DEFAULT '',
  source_name TEXT NOT NULL DEFAULT '',
  topic TEXT NOT NULL DEFAULT 'technology',
  related_service TEXT,
  cta_message_es TEXT NOT NULL DEFAULT '',
  cta_message_en TEXT NOT NULL DEFAULT '',
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_published BOOLEAN NOT NULL DEFAULT true,
  reading_time_minutes INTEGER NOT NULL DEFAULT 5
);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Public read access for published posts
CREATE POLICY "Anyone can read published blog posts"
  ON public.blog_posts
  FOR SELECT
  USING (is_published = true);
