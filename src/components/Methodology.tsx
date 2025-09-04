import { Card, CardContent } from "@/components/ui/card";
import { FileText, Zap, MessageSquare, Target } from "lucide-react";

const Methodology = () => {

  const steps = [
    {
      icon: FileText,
      title: "Brief",
      description: "Entendemos tu necesidad",
      details: "Sesión de descubrimiento para comprender objetivos, audiencia y requerimientos específicos."
    },
    {
      icon: Zap,
      title: "Sprint",
      description: "Avances semanales",
      details: "Desarrollo ágil con entregas constantes para que veas el progreso en tiempo real."
    },
    {
      icon: MessageSquare,
      title: "Feedback",
      description: "Ajustes en base a tu visión",
      details: "Revisiones colaborativas para asegurar que el resultado coincida con tus expectativas."
    },
    {
      icon: Target,
      title: "Resultados",
      description: "Métricas claras para tomar decisiones",
      details: "Reportes de rendimiento y KPIs que te permiten medir el impacto real del proyecto."
    }
  ];



  return (
    <section id="metodologia" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="text-gradient-orange">Metodología</span>
          </h2>
          <p className="text-xl md:text-2xl font-semibold text-foreground max-w-3xl mx-auto leading-relaxed">
            "Sabemos que tu tiempo vale oro. Por eso trabajamos 
            <span className="text-secondary"> simple y ágil.</span>"
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              {/* Connection line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-12 h-1 bg-gradient-to-r from-primary to-secondary transform translate-x-6 z-0 shadow-lg"></div>
              )}
              
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover-scale hover-lift bg-background relative z-10">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 p-4 rounded-xl bg-primary/10 w-fit">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  
                  <div className="text-sm font-semibold text-primary mb-2">
                    Paso {index + 1}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  
                  <p className="text-sm font-medium text-secondary mb-3">
                    {step.description}
                  </p>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.details}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>




      </div>
    </section>
  );
};

export default Methodology;