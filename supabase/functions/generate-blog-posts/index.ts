import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { fetchBestArticleForTopic } from '../_shared/gnews.ts';
import { summarizeArticle, generateImage } from '../_shared/openai.ts';
import { createAdminClient, uploadImage } from '../_shared/supabase-admin.ts';

const TOPICS = ['ai', 'nocode', 'lovable', 'webdev', 'technology'];

// Fallback images per topic (Unsplash) if DALL-E fails
const FALLBACK_IMAGES: Record<string, string> = {
  ai: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop',
  nocode: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
  lovable: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop',
  webdev: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop',
  technology: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=450&fit=crop',
};

serve(async (req) => {
  try {
    // Verify authorization (optional: add a secret token check)
    const gnewsApiKey = Deno.env.get('GNEWS_API_KEY');
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!gnewsApiKey || !openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'Missing API keys' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createAdminClient();
    const results: { topic: string; slug: string; success: boolean; error?: string }[] = [];

    // Determine which topic to use today
    // Rotate through topics: Mon=0, Wed=1, Fri=2, etc.
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon, ..., 5=Fri
    const topicIndex = dayOfWeek === 1 ? 0 : dayOfWeek === 3 ? 1 : 2; // Mon/Wed/Fri
    const selectedTopic = TOPICS[topicIndex % TOPICS.length];

    // Allow overriding topic via request body
    let topic = selectedTopic;
    try {
      const body = await req.json();
      if (body.topic && TOPICS.includes(body.topic)) {
        topic = body.topic;
      }
    } catch {
      // No body or invalid JSON, use default topic
    }

    console.log(`Generating blog post for topic: ${topic}`);

    // Step 1: Fetch news
    const article = await fetchBestArticleForTopic(gnewsApiKey, topic);
    if (!article) {
      return new Response(
        JSON.stringify({ error: `No articles found for topic: ${topic}` }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found article: "${article.title}" from ${article.source.name}`);

    // Step 2: Summarize with AI
    const blogContent = await summarizeArticle(
      openaiApiKey,
      article.title,
      article.content || article.description,
      article.source.name,
      topic
    );

    console.log(`Generated blog content with slug: ${blogContent.slug}`);

    // Step 3: Check if slug already exists
    const { data: existing } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', blogContent.slug)
      .single();

    if (existing) {
      // Append timestamp to make slug unique
      blogContent.slug = `${blogContent.slug}-${Date.now()}`;
    }

    // Step 4: Generate image
    let imageUrl: string;
    try {
      const imageBase64 = await generateImage(
        openaiApiKey,
        topic,
        blogContent.title_en
      );
      imageUrl = await uploadImage(imageBase64, blogContent.slug);
      console.log(`Generated and uploaded image: ${imageUrl}`);
    } catch (imageError) {
      console.error(`Image generation failed, using fallback: ${imageError}`);
      imageUrl = FALLBACK_IMAGES[topic] || FALLBACK_IMAGES.technology;
    }

    // Step 5: Insert into database
    const { data: newPost, error: insertError } = await supabase
      .from('blog_posts')
      .insert({
        slug: blogContent.slug,
        title_es: blogContent.title_es,
        title_en: blogContent.title_en,
        summary_es: blogContent.summary_es,
        summary_en: blogContent.summary_en,
        content_es: blogContent.content_es,
        content_en: blogContent.content_en,
        excerpt_es: blogContent.excerpt_es,
        excerpt_en: blogContent.excerpt_en,
        image_url: imageUrl,
        image_alt_es: blogContent.image_alt_es,
        image_alt_en: blogContent.image_alt_en,
        source_url: article.url,
        source_name: article.source.name,
        topic,
        related_service: blogContent.related_service,
        cta_message_es: blogContent.cta_message_es,
        cta_message_en: blogContent.cta_message_en,
        published_at: new Date().toISOString(),
        is_published: true,
        reading_time_minutes: blogContent.reading_time_minutes,
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(`Database insert error: ${insertError.message}`);
    }

    results.push({ topic, slug: blogContent.slug, success: true });

    console.log(`Successfully created blog post: ${blogContent.slug}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Blog post created successfully`,
        results,
        post: {
          id: newPost.id,
          slug: newPost.slug,
          title: newPost.title_es,
          topic: newPost.topic,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Edge Function error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
