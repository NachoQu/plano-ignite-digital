import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import type { BlogPost, BlogTopic, PlanoService } from '@/types/blog';

export const TOPIC_CONFIG: Record<BlogTopic, { labelEs: string; labelEn: string; icon: string; color: string }> = {
  ai: { labelEs: 'Inteligencia Artificial', labelEn: 'Artificial Intelligence', icon: 'Brain', color: 'text-primary' },
  nocode: { labelEs: 'No-Code', labelEn: 'No-Code', icon: 'Blocks', color: 'text-secondary' },
  lovable: { labelEs: 'Lovable', labelEn: 'Lovable', icon: 'Heart', color: 'text-primary' },
  webdev: { labelEs: 'Desarrollo Web', labelEn: 'Web Development', icon: 'Globe', color: 'text-secondary' },
  technology: { labelEs: 'Tecnología', labelEn: 'Technology', icon: 'Cpu', color: 'text-primary' },
};

export const SERVICE_MAP: Record<PlanoService, { labelEs: string; labelEn: string }> = {
  branding: { labelEs: 'Identidad de marca', labelEn: 'Brand Identity' },
  web: { labelEs: 'Desarrollo web', labelEn: 'Web Development' },
  tools: { labelEs: 'Herramientas internas', labelEn: 'Internal Tools' },
  mvp: { labelEs: 'MVPs para Startups', labelEn: 'MVPs for Startups' },
  edtech: { labelEs: 'EdTech', labelEn: 'EdTech' },
  social: { labelEs: 'Contenido para redes', labelEn: 'Social Media Content' },
};

export function localized(post: BlogPost, field: string, lang: string): string {
  const key = `${field}_${lang}` as keyof BlogPost;
  return (post[key] as string) || (post[`${field}_es` as keyof BlogPost] as string) || '';
}

export function formatBlogDate(dateStr: string, lang: string): string {
  const date = new Date(dateStr);
  const locale = lang === 'en' ? enUS : es;
  return format(date, "d 'de' MMMM, yyyy", { locale });
}

export function getTopicLabel(topic: BlogTopic, lang: string): string {
  const config = TOPIC_CONFIG[topic];
  return lang === 'en' ? config.labelEn : config.labelEs;
}

export function getServiceLabel(service: PlanoService, lang: string): string {
  const map = SERVICE_MAP[service];
  return lang === 'en' ? map.labelEn : map.labelEs;
}

export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/542323550605?text=${encodeURIComponent(message)}`;
}
