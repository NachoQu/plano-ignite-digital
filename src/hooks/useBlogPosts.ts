import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { BlogPost, BlogTopic } from '@/types/blog';

export function useBlogPosts(topic?: BlogTopic, page: number = 1, pageSize: number = 9) {
  return useQuery({
    queryKey: ['blog-posts', topic, page],
    queryFn: async () => {
      let query = (supabase as any)
        .from('blog_posts')
        .select('*', { count: 'exact' })
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (topic) {
        query = query.eq('topic', topic);
      }

      const { data, error, count } = await query;
      if (error) throw error;
      return { posts: (data || []) as BlogPost[], totalCount: count ?? 0 };
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

      if (error) throw error;
      return data as BlogPost;
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!slug,
  });
}

export function useLatestBlogPosts(limit: number = 3) {
  return useQuery({
    queryKey: ['blog-posts-latest', limit],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []) as BlogPost[];
    },
    staleTime: 5 * 60 * 1000,
  });
}
