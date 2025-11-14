import { CheckCircle, Zap, Users, BarChart3 } from "lucide-react";
import { useTranslation } from "react-i18next";

const ValueProposition = () => {
  const { t } = useTranslation();

  const benefits = [
    {
      icon: CheckCircle,
      title: t('valueProposition.benefits.results.title'),
      description: t('valueProposition.benefits.results.description')
    },
    {
      icon: Zap,
      title: t('valueProposition.benefits.scale.title'),
      description: t('valueProposition.benefits.scale.description')
    },
    {
      icon: Users,
      title: t('valueProposition.benefits.support.title'),
      description: t('valueProposition.benefits.support.description')
    },
    {
      icon: BarChart3,
      title: t('valueProposition.benefits.tracking.title'),
      description: t('valueProposition.benefits.tracking.description')
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {t('valueProposition.title')} <span className="text-gradient-orange">{t('valueProposition.titleHighlight')}</span>
          </h2>
          <p className="text-xl md:text-2xl font-semibold text-foreground max-w-4xl mx-auto leading-relaxed">
            "{t('valueProposition.quote')}
            <span className="text-primary"> {t('valueProposition.quoteHighlight')}</span>"
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="flex items-start space-x-4 p-6 rounded-xl hover:bg-muted/50 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="flex-shrink-0">
                <div className="p-3 rounded-xl bg-primary/10">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;