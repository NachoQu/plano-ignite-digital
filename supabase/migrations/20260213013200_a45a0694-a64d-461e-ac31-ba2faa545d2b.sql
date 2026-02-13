
-- Create blog-images storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true);

-- Public read access for blog images
CREATE POLICY "Public read access for blog images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'blog-images');

-- Service role can upload images (edge function uses service role key)
CREATE POLICY "Service role can upload blog images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'blog-images');
