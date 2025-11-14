import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { useInView } from "react-intersection-observer";
import { useTranslation } from "react-i18next";

const Hero = () => {
  const { t } = useTranslation();
  const { ref: statsRef, inView: statsInView } = useInView({ threshold: 0.3, triggerOnce: true });
  
  const projectsCount = useCountUp({ end: 10, isVisible: statsInView });
  const satisfactionCount = useCountUp({ end: 100, isVisible: statsInView });
  const hoursCount = useCountUp({ end: 300, isVisible: statsInView });

  const handleWhatsAppClick = () => {
    const message = t('hero.whatsappMessage');
    window.open(`https://wa.me/542323550605?text=${encodeURIComponent(message)}`, "_blank");
  };

  return <section id="inicio" className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden pt-16 pb-8 md:pb-0">
      {/* Background elements */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-10 w-24 h-24 bg-secondary/10 rounded-full blur-xl"></div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Main heading */}
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-up">
          <span className="text-gradient-purple">{t('hero.title.part1')}</span>, branding y{" "}
          <span className="text-gradient-orange">{t('hero.title.part2')}</span>{" "}
          {t('hero.title.part3')}
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed animate-fade-up" style={{
        animationDelay: "0.2s"
      }}>
          {t('hero.subtitle')}
        </p>

        {/* CTA Button */}
        <div className="animate-fade-up" style={{
        animationDelay: "0.4s"
      }}>
          <Button onClick={handleWhatsAppClick} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-xl hover-scale group">
            {t('hero.cta')}
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Stats or trust indicators */}
        <div ref={statsRef} className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in" style={{
        animationDelay: "0.6s"
      }}>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-primary transition-all duration-500">+{projectsCount}</div>
            <div className="text-sm md:text-base text-muted-foreground mt-2">{t('hero.stats.projects')}</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-secondary transition-all duration-500">{satisfactionCount}%</div>
            <div className="text-sm md:text-base text-muted-foreground mt-2">{t('hero.stats.satisfaction')}</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-primary transition-all duration-500">+{hoursCount}</div>
            <div className="text-sm md:text-base text-muted-foreground mt-2">{t('hero.stats.hours')}</div>
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;