import { useTranslation } from "react-i18next";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { ScrollAnimationWrapper } from "@/components/ScrollAnimationWrapper";
import BlogPostCard from "./BlogPostCard";
import type { BlogPost } from "@/types/blog";

interface BlogRelatedPostsProps {
  currentPost: BlogPost;
}

const BlogRelatedPosts = ({ currentPost }: BlogRelatedPostsProps) => {
  const { t } = useTranslation();
  const { data } = useBlogPosts(currentPost.topic, 1, 4);

  const relatedPosts = data?.posts.filter(p => p.id !== currentPost.id).slice(0, 3) || [];

  if (relatedPosts.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-8 text-foreground">
        {t('blog.relatedPosts')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {relatedPosts.map((post, index) => (
          <ScrollAnimationWrapper key={post.id} animationType="fade-in" delay={index * 100}>
            <BlogPostCard post={post} />
          </ScrollAnimationWrapper>
        ))}
      </div>
    </section>
  );
};

export default BlogRelatedPosts;
