import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Globe, Settings, Rocket, GraduationCap } from "lucide-react";
import { ScrollAnimationWrapper } from "@/components/ScrollAnimationWrapper";

const Services = () => {
  const services = [
    {
      icon: Palette,
      title: "Identidad de marca que inspira confianza",
      description: "Logotipos, manuales y piezas gráficas que posicionan a tu empresa como referente.",
      color: "text-primary"
    },
    {
      icon: Globe,
      title: "Webs que convierten visitas en clientes",
      description: "Sitios modernos, rápidos y optimizados para SEO, pensados en ventas reales.",
      color: "text-secondary"
    },
    {
      icon: Settings,
      title: "Herramientas internas para tu PyME",
      description: "ERP para venta de productos, tableros de resultados, sistemas de reservas y gestión de stock para ordenar tu operación.",
      color: "text-primary"
    },
    {
      icon: Rocket,
      title: "MVPs rápidos para Startups",
      description: "Prototipos funcionales en semanas, listos para validar.",
      color: "text-secondary"
    },
    {
      icon: GraduationCap,
      title: "EdTech probado en colegios",
      description: "Digitalizamos la comunicación con familias y automatizamos informes para docentes.",
      color: "text-primary"
    }
  ];

  return (
    <section id="servicios" className="py-20 bg-muted/50">
      <div className="container mx-auto px-6">
        <ScrollAnimationWrapper animationType="fade-in">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Servicios <span className="text-gradient-purple">integrales</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Ofrecemos soluciones completas que cubren todas las necesidades digitales de tu negocio
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