import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogPostContent from "@/components/blog/BlogPostContent";
import BlogCTA from "@/components/blog/BlogCTA";
import BlogRelatedPosts from "@/components/blog/BlogRelatedPosts";
import BlogSEO from "@/components/blog/BlogSEO";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Clock, ExternalLink, Calendar } from "lucide-react";
import { useBlogPost } from "@/hooks/useBlogPosts";
import { localized, formatBlogDate, getTopicLabel, TOPIC_CONFIG } from "@/lib/blog-utils";

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'es';

  const { data: post, isLoading, isError } = useBlogPost(slug || '');

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="pt-28 pb-16 bg-background">
          <div className="container mx-auto px-6 max-w-4xl">
            <Skeleton className="h-8 w-32 mb-8" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-12 w-3/4 mb-8" />
            <Skeleton className="w-full h-[400px] rounded-2xl mb-8" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (isError || !post) {
    return (
      <>
        <Navbar />
        <div className="pt-28 pb-16 bg-background min-h-screen">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-2xl font-bold mb-4">{t('blog.error')}</h1>
            <Link to="/blog" className="text-primary hover:underline">
              {t('blog.backToBlog')}
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const topicConfig = TOPIC_CONFIG[post.topic];

  return (
    <>
      <BlogSEO
        title={localized(post, 'title', lang)}
        description={localized(post, 'excerpt', lang)}
        image={post.image_url}
        type="article"
      />
      <Navbar />

      <article className="pt-28 pb-16 bg-background">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link
              to="/blog"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('blog.backToBlog')}
            </Link>
          </nav>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
            {localized(post, 'title', lang)}
          </h1>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <Badge variant="secondary" className={topicConfig.color}>
              {getTopicLabel(post.topic, lang)}
            </Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              {formatBlogDate(post.published_at, lang)}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              {t('blog.readingTime', { minutes: post.reading_time_minutes })}
            </div>
            <a
              href={post.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              {t('blog.source')}: {post.source_name}
            </a>
          </div>

          {/* Hero image */}
          <div className="relative rounded-2xl overflow-hidden mb-10">
            <img
              src={post.image_url}
              alt={localized(post, 'image_alt', lang)}
              className="w-full h-[300px] md:h-[450px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          </div>

          {/* Summary */}
          <p className="text-xl text-muted-foreground leading-relaxed mb-10 border-l-4 border-primary pl-6">
            {localized(post, 'summary', lang)}
          </p>

          {/* Article content */}
          <BlogPostContent content={localized(post, 'content', lang)} />

          {/* CTA */}
          <BlogCTA post={post} />

          {/* Related posts */}
          <BlogRelatedPosts currentPost={post} />
        </div>
      </article>

      <Footer />
    </>
  );
};

export default BlogPostPage;
