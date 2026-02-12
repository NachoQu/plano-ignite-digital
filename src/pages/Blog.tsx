import { useState } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogPostCard from "@/components/blog/BlogPostCard";
import BlogPostSkeleton from "@/components/blog/BlogPostSkeleton";
import BlogTopicFilter from "@/components/blog/BlogTopicFilter";
import BlogPagination from "@/components/blog/BlogPagination";
import BlogSEO from "@/components/blog/BlogSEO";
import { ScrollAnimationWrapper } from "@/components/ScrollAnimationWrapper";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { Newspaper } from "lucide-react";
import type { BlogTopic } from "@/types/blog";

const PAGE_SIZE = 9;

const Blog = () => {
  const { t } = useTranslation();
  const [activeTopic, setActiveTopic] = useState<BlogTopic | undefined>();
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError } = useBlogPosts(activeTopic, currentPage, PAGE_SIZE);

  const totalPages = data ? Math.ceil(data.totalCount / PAGE_SIZE) : 0;

  const handleFilterChange = (topic: BlogTopic | undefined) => {
    setActiveTopic(topic);
    setCurrentPage(1);
  };

  return (
    <>
      <BlogSEO
        title={`Blog ${t('blog.titleHighlight')}`}
        description={t('blog.subtitle')}
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-background">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper animationType="fade-in">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {t('blog.title')}{' '}
                <span className="text-gradient-purple">{t('blog.titleHighlight')}</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {t('blog.subtitle')}
              </p>
            </div>
          </ScrollAnimationWrapper>

          <BlogTopicFilter
            activeTopic={activeTopic}
            onFilterChange={handleFilterChange}
          />

          {/* Loading */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <BlogPostSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">{t('blog.error')}</p>
            </div>
          )}

          {/* Posts grid */}
          {data && data.posts.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.posts.map((post, index) => (
                  <ScrollAnimationWrapper
                    key={post.id}
                    animationType="scale"
                    delay={index * 100}
                  >
                    <BlogPostCard post={post} />
                  </ScrollAnimationWrapper>
                ))}
              </div>

              <BlogPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}

          {/* Empty state */}
          {data && data.posts.length === 0 && !isLoading && (
            <div className="text-center py-16">
              <Newspaper className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">{t('blog.noPostsYet')}</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Blog;
