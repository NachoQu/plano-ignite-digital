import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, Globe, Settings, Rocket, GraduationCap, Share2, ArrowRight } from "lucide-react";
import { ScrollAnimationWrapper } from "@/components/ScrollAnimationWrapper";
import { useTranslation } from "react-i18next";

const Services = () => {
  const { t } = useTranslation();

  const services = [
    {
      icon: Palette,
      title: t('services.items.branding.title'),
      description: t('services.items.branding.description'),
      cta: t('services.items.branding.cta'),
      color: "text-primary",
      whatsappMsg: "Hola! Me interesa el servicio de branding e identidad visual para mi empresa",
    },
    {
      icon: Globe,
      title: t('services.items.web.title'),
      description: t('services.items.web.description'),
      cta: t('services.items.web.cta'),
      color: "text-secondary",
      whatsappMsg: "Hola! Quiero hacer una página web para mi empresa",
    },
    {
      icon: Settings,
      title: t('services.items.tools.title'),
      description: t('services.items.tools.description'),
      cta: t('services.items.tools.cta'),
      color: "text-primary",
      whatsappMsg: "Hola! Necesito una app web o herramienta interna para mi empresa",
    },
    {
      icon: Rocket,
      title: t('services.items.mvp.title'),
      description: t('services.items.mvp.description'),
      cta: t('services.items.mvp.cta'),
      color: "text-secondary",
      whatsappMsg: "Hola! Quiero desarrollar un MVP para mi startup",
    },
    {
      icon: GraduationCap,
      title: t('services.items.edtech.title'),
      description: t('services.items.edtech.description'),
      cta: t('services.items.edtech.cta'),
      color: "text-primary",
      whatsappMsg: "Hola! Me interesa la solución EdTech para mi institución educativa",
    },
    {
      icon: Share2,
      title: t('services.items.social.title'),
      description: t('services.items.social.description'),
      cta: t('services.items.social.cta'),
      color: "text-secondary",
      whatsappMsg: "Hola! Necesito diseño de contenido para redes sociales",
    },
  ];

  return (
    <section id="servicios" className="py-20 bg-muted/50">
      <div className="container mx-auto px-6">
        <ScrollAnimationWrapper animationType="fade-in">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              {t('services.title')}{" "}
              <span className="text-gradient-purple">{t('services.titleHighlight')}</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('services.subtitle')}
            </p>
          </div>
        </ScrollAnimationWrapper>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ScrollAnimationWrapper
              key={index}
              animationType="fade-in"
              delay={index * 100}
            >
              <Card className="border-0 shadow-lg bg-background card-hover h-full flex flex-col">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 rounded-xl bg-muted/50 w-fit">
                    <service.icon className={`h-8 w-8 ${service.color}`} />
                  </div>
                  <CardTitle className="text-xl font-bold leading-tight">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 items-center">
                  <p className="text-muted-foreground text-center leading-relaxed flex-1">
                    {service.description}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-4 text-primary hover:text-primary hover:bg-primary/10 font-semibold group"
                    onClick={() =>
                      window.open(
                        `https://wa.me/542323550605?text=${encodeURIComponent(service.whatsappMsg)}`,
                        "_blank"
                      )
                    }
                  >
                    {service.cta}
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </ScrollAnimationWrapper>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
