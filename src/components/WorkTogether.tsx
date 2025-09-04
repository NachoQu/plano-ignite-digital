import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Sparkles } from "lucide-react";

const WorkTogether = () => {
  const reasons = [
    "Querés hacer crecer tu negocio con una presencia digital clara y profesional.",
    "Tenés procesos internos manuales y buscás automatizarlos para ganar tiempo.",
    "Sabés que tu marca necesita un salto de calidad en diseño e identidad.",
    "Valorás trabajar con un equipo que habla en simple, sin tecnicismos innecesarios.",
    "Querés resultados medibles y concretos (más leads, menos costos, más eficiencia).",
    "Te motiva la idea de un partner tecnológico cercano, no solo un proveedor.",
    "Estás abierto a innovar con herramientas no-code e inteligencia artificial."
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="h-8 w-8 text-primary mr-3" />
            <h2 className="text-3xl md:text-5xl font-bold">
              Trabajemos juntos si...
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Si te identificás con alguna de estas situaciones, somos el equipo perfecto para tu proyecto
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl bg-background/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover-scale hover-lift">
            <CardContent className="p-8 md:p-12">
              <div className="space-y-6">
                {reasons.map((reason, index) => (
                  <div 
                    key={index}
                    className="flex items-start space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-all duration-300 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-foreground leading-relaxed text-base md:text-lg">
                      {reason}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WorkTogether;
