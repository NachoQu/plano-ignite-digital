import { Button } from "@/components/ui/button";
import { MessageCircle, Instagram, Linkedin } from "lucide-react";
import { useTranslation } from "react-i18next";

const FinalCTA = () => {
  const { t } = useTranslation();
  
  const handleWhatsAppClick = () => {
    const message = t('finalCTA.whatsappMessage');
    window.open(`https://wa.me/542323550605?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main CTA */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
              {t('finalCTA.title')}{" "}
              <span className="text-gradient-purple">{t('finalCTA.titleHighlight')}</span> {t('finalCTA.titleEnd')}
            </h2>

            <Button 
              onClick={handleWhatsAppClick}
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-4 text-lg font-semibold rounded-xl hover-scale group"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              {t('finalCTA.cta')}
            </Button>
          </div>

          {/* Contact Info */}
          <div className="border-t border-border pt-12">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
              {/* Social Media */}
              <div className="flex items-center space-x-6">
                <span className="text-muted-foreground font-medium">{t('finalCTA.follow')}</span>
                <div className="flex items-center space-x-4">
                  <a 
                    href="https://instagram.com/plano.web" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Instagram className="h-5 w-5" />
                    <span>@plano.web</span>
                  </a>
                </div>
              </div>

              {/* Contact */}
              <div className="flex items-center space-x-6">
                <span className="text-muted-foreground font-medium">{t('finalCTA.contact')}</span>
                <a 
                  href="https://wa.me/542323550605" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-muted-foreground hover:text-secondary transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>+54 2323 55-0605</span>
                </a>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground">
                {t('finalCTA.copyright')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;