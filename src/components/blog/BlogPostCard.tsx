import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Clock, ExternalLink } from "lucide-react";
import type { BlogPost } from "@/types/blog";
import { localized, formatBlogDate, getTopicLabel, TOPIC_CONFIG } from "@/lib/blog-utils";

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard = ({ post }: BlogPostCardProps) => {
  const { i18n, t } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'es';
  const topicConfig = TOPIC_CONFIG[post.topic];

  return (
    <Link to={`/blog/${post.slug}`} className="block h-full">
      <Card className="border-0 shadow-lg bg-card group card-hover h-full overflow-hidden">
        <AspectRatio ratio={16 / 9}>
          <img
            src={post.image_url}
            alt={localized(post, 'image_alt', lang)}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </AspectRatio>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <Badge variant="secondary" className={`text-xs ${topicConfig.color}`}>
              {getTopicLabel(post.topic, lang)}
            </Badge>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              {t('blog.readingTime', { minutes: post.reading_time_minutes })}
            </div>
          </div>

          <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {localized(post, 'title', lang)}
          </h3>

          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
            {localized(post, 'excerpt', lang)}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <span className="text-xs text-muted-foreground">
              {post.source_name}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatBlogDate(post.published_at, lang)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BlogPostCard;
