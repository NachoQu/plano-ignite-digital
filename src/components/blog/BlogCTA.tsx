import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import type { BlogPost } from "@/types/blog";
import { localized, getWhatsAppUrl, getServiceLabel } from "@/lib/blog-utils";

interface BlogCTAProps {
  post: BlogPost;
}

const BlogCTA = ({ post }: BlogCTAProps) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'es';

  const ctaMessage = localized(post, 'cta_message', lang);
  const title = localized(post, 'title', lang);
  const whatsappText = t('blog.cta.whatsappMessage', { topic: title });

  const handleWhatsApp = () => {
    window.open(getWhatsAppUrl(whatsappText), "_blank");
  };

  return (
    <div className="my-12 rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20 border border-primary/20 p-8 md:p-10">
      <h3 className="text-2xl font-bold mb-4 text-foreground">
        {t('blog.cta.title')}
      </h3>

      <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
        {ctaMessage}
      </p>

      <Button
        onClick={handleWhatsApp}
        size="lg"
        className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
      >
        <MessageCircle className="mr-2 h-5 w-5" />
        {t('blog.cta.button')}
      </Button>

      {post.related_service && (
        <p className="mt-4 text-sm text-muted-foreground">
          {lang === 'es' ? 'Servicio relacionado' : 'Related service'}:{' '}
          <a
            href="/#servicios"
            className="text-primary hover:underline"
          >
            {getServiceLabel(post.related_service, lang)}
          </a>
        </p>
      )}
    </div>
  );
};

export default BlogCTA;
