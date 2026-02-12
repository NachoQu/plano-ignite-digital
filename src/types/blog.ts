export type BlogTopic = 'ai' | 'nocode' | 'lovable' | 'webdev' | 'technology';

export type PlanoService = 'branding' | 'web' | 'tools' | 'mvp' | 'edtech' | 'social';

export interface BlogPost {
  id: string;
  slug: string;
  title_es: string;
  title_en: string;
  summary_es: string;
  summary_en: string;
  content_es: string;
  content_en: string;
  excerpt_es: string;
  excerpt_en: string;
  image_url: string;
  image_alt_es: string;
  image_alt_en: string;
  source_url: string;
  source_name: string;
  topic: BlogTopic;
  related_service: PlanoService | null;
  cta_message_es: string;
  cta_message_en: string;
  published_at: string;
  created_at: string;
  is_published: boolean;
  reading_time_minutes: number;
}
