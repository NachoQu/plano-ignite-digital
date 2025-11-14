import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Globe, Settings, Rocket, GraduationCap, Share2 } from "lucide-react";
import { ScrollAnimationWrapper } from "@/components/ScrollAnimationWrapper";
import { useTranslation } from "react-i18next";

const Services = () => {
  const { t } = useTranslation();
  
  const services = [
    {
      icon: Palette,
      title: t('services.items.branding.title'),
      description: t('services.items.branding.description'),
      color: "text-primary"
    },
    {
      icon: Globe,
      title: t('services.items.web.title'),
      description: t('services.items.web.description'),
      color: "text-secondary"
    },
    {
      icon: Settings,
      title: t('services.items.tools.title'),
      description: t('services.items.tools.description'),
      color: "text-primary"
    },
    {
      icon: Rocket,
      title: t('services.items.mvp.title'),
      description: t('services.items.mvp.description'),
      color: "text-secondary"
    },
    {
      icon: GraduationCap,
      title: t('services.items.edtech.title'),
      description: t('services.items.edtech.description'),
      color: "text-primary"
    },
    {
      icon: Share2,
      title: t('services.items.social.title'),
      description: t('services.items.social.description'),
      color: "text-secondary"
    }
  ];

  return (
    <section id="servicios" className="py-20 bg-muted/50">
      <div className="container mx-auto px-6">
        <ScrollAnimationWrapper animationType="fade-in">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              {t('services.title')} <span className="text-gradient-purple">{t('services.titleHighlight')}</span>
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
              <Card className="border-0 shadow-lg bg-background card-hover h-full">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 rounded-xl bg-muted/50 w-fit">
                  <service.icon className={`h-8 w-8 ${service.color}`} />
                </div>
                <CardTitle className="text-xl font-bold leading-tight">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center leading-relaxed">
                  {service.description}
                </p>
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