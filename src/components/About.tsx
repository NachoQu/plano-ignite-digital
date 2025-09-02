import { Card, CardContent } from "@/components/ui/card";
import { Palette, Globe, Settings } from "lucide-react";

const About = () => {
  const pillars = [
    {
      icon: Palette,
      title: "Branding",
      description: "Marcas que comunican valor y generan confianza desde el primer contacto."
    },
    {
      icon: Globe,
      title: "Desarrollo Web",
      description: "Sitios web modernos, rápidos y optimizados para convertir visitas en clientes."
    },
    {
      icon: Settings,
      title: "Herramientas Internas",
      description: "Sistemas que ordenan tu operación y simplifican la gestión diaria."
    }
  ];

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Sobre <span className="text-gradient-purple">Plano</span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              "Nacimos para que PYMEs y Startups puedan competir como las grandes, con tecnología accesible, 
              rápida y efectiva. Nuestro foco está en tres pilares: branding, desarrollo web y herramientas internas. 
              Cada proyecto se mide por la claridad, el impacto y los resultados que logramos juntos."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar, index) => (
              <Card 
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover-scale bg-background text-center"
              >
                <CardContent className="p-8">
                  <div className="mx-auto mb-6 p-4 rounded-xl bg-primary/10 w-fit">
                    <pillar.icon className="h-10 w-10 text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4">{pillar.title}</h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mission statement */}
          <div className="mt-16 text-center bg-background rounded-2xl p-8 shadow-lg">
            <div className="flex items-center justify-center mb-4">
              <div className="w-2 h-2 bg-primary rounded-full mx-1"></div>
              <div className="w-2 h-2 bg-secondary rounded-full mx-1"></div>
              <div className="w-2 h-2 bg-primary rounded-full mx-1"></div>
            </div>
            <p className="text-lg font-semibold text-foreground">
              Tecnología <span className="text-primary">accesible</span>, 
              desarrollo <span className="text-secondary">rápido</span> y 
              resultados <span className="text-primary">medibles</span>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;