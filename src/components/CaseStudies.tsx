import { Card, CardContent } from "@/components/ui/card";
import { Globe, ShoppingCart, BarChart3, Calendar, GraduationCap, Package } from "lucide-react";

const CaseStudies = () => {
  const cases = [
    {
      icon: Globe,
      title: "Más de 10 webs profesionales",
      description: "Ayudando a PYMEs y Startups a aumentar su presencia digital con sitios que convierten.",
      stats: "10+ proyectos"
    },
    {
      icon: Package,
      title: "ERP para venta de productos",
      description: "Sistema implementado centralizando gestión de stock, ventas y clientes en una sola plataforma.",
      stats: "100% integrado"
    },
    {
      icon: BarChart3,
      title: "App de estado de resultados",
      description: "Desarrollo de plataforma interna para visualizar KPIs, mejorando la toma de decisiones empresariales.",
      stats: "Tiempo real"
    },
    {
      icon: Calendar,
      title: "Sistema de reservas de salas",
      description: "Plataforma creada para optimizar recursos internos y gestión de espacios corporativos.",
      stats: "Recursos optimizados"
    },
    {
      icon: ShoppingCart,
      title: "E-commerce completo",
      description: "Tienda online creada de 0 a 1, con catálogo, pasarela de pagos y logística integrada.",
      stats: "0 a 1"
    },
    {
      icon: GraduationCap,
      title: "New Zealand Pacific School",
      description: "Digitalizamos comunicación con familias y automatizamos informes docentes.",
      stats: "80% uso activo"
    }
  ];

  return (
    <section id="casos" className="py-20 bg-muted/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Casos de <span className="text-gradient-purple">éxito</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Proyectos reales que han transformado negocios y generado resultados concretos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cases.map((caseStudy, index) => (
            <Card 
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover-scale bg-background group"
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-xl bg-secondary/10 mr-4">
                    <caseStudy.icon className="h-6 w-6 text-secondary" />
                  </div>
                  <div className="text-sm font-semibold text-secondary bg-secondary/10 px-3 py-1 rounded-full">
                    {caseStudy.stats}
                  </div>
                </div>
                
                <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors">
                  {caseStudy.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {caseStudy.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;