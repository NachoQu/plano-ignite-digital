import { CheckCircle, Zap, Users, BarChart3 } from "lucide-react";

const ValueProposition = () => {
  const benefits = [
    {
      icon: CheckCircle,
      title: "Resultados medibles desde el inicio",
      description: "KPIs claros y métricas que importan para tu negocio"
    },
    {
      icon: Zap,
      title: "Escalamos contigo, sin fricción técnica",
      description: "Tecnología que crece con tu empresa, sin complicaciones"
    },
    {
      icon: Users,
      title: "Acompañamiento cercano y simple",
      description: "Comunicación directa y comprensible en cada paso"
    },
    {
      icon: BarChart3,
      title: "KPIs claros y seguimiento constante",
      description: "Reportes transparentes para tomar mejores decisiones"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Propuesta de <span className="text-gradient-orange">valor</span>
          </h2>
          <p className="text-xl md:text-2xl font-semibold text-foreground max-w-4xl mx-auto leading-relaxed">
            "Tu PyME o Startup necesita una marca sólida, una web profesional y herramientas internas claras: 
            <span className="text-primary"> eso hacemos en Plano.</span>"
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="flex items-start space-x-4 p-6 rounded-xl hover:bg-muted/50 transition-all duration-300"
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