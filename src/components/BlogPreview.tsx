import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ScrollAnimationWrapper } from "@/components/ScrollAnimationWrapper";
import BlogPostCard from "@/components/blog/BlogPostCard";
import BlogPostSkeleton from "@/components/blog/BlogPostSkeleton";
import { useLatestBlogPosts } from "@/hooks/useBlogPosts";

const BlogPreview = () => {
  const { t } = useTranslation();
  const { data: posts, isLoading } = useLatestBlogPosts(3);

  if (!isLoading && (!posts || posts.length === 0)) return null;

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-6">
        <ScrollAnimationWrapper animationType="fade-in">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              {t('blog.preview.title')}{' '}
              <span className="text-gradient-purple">{t('blog.preview.titleHighlight')}</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('blog.preview.subtitle')}
            </p>
          </div>
        </ScrollAnimationWrapper>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <BlogPostSkeleton key={i} />
              ))
            : posts?.map((post, index) => (
                <ScrollAnimationWrapper key={post.id} animationType="fade-in" delay={index * 100}>
                  <BlogPostCard post={post} />
                </ScrollAnimationWrapper>
              ))
          }
        </div>

        <div className="text-center mt-12">
          <Link to="/blog">
            <Button variant="outline" size="lg">
              {t('blog.preview.viewAll')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
