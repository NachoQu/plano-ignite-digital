import { Card, CardContent } from "@/components/ui/card";
import { Globe, ShoppingCart, BarChart3, Calendar, GraduationCap, Package, ExternalLink } from "lucide-react";

const Projects = () => {
  const projects = [
    {
      icon: Globe,
      title: "Más de 10 webs profesionales",
      description: "Sitios web modernos y optimizados para PYMEs y Startups que buscan aumentar su presencia digital y convertir visitas en clientes.",
      category: "Desarrollo Web",
      status: "10+ completados"
    },
    {
      icon: Package,
      title: "ERP para venta de productos",
      description: "Sistema completo que centraliza gestión de stock, ventas y clientes en una sola plataforma, optimizando procesos operativos.",
      category: "Herramientas Internas",
      status: "Implementado"
    },
    {
      icon: BarChart3,
      title: "App de estado de resultados",
      description: "Plataforma interna para visualizar KPIs en tiempo real, mejorando la toma de decisiones empresariales con datos actualizados.",
      category: "Business Intelligence",
      status: "En producción"
    },
    {
      icon: Calendar,
      title: "Sistema de reservas de salas",
      description: "Plataforma diseñada para optimizar recursos internos y gestión de espacios corporativos con calendario integrado.",
      category: "Gestión Interna",
      status: "Activo"
    },
    {
      icon: ShoppingCart,
      title: "E-commerce completo",
      description: "Tienda online desarrollada desde cero con catálogo, pasarela de pagos y logística integrada para venta directa.",
      category: "E-commerce",
      status: "Operativo"
    },
    {
      icon: GraduationCap,
      title: "New Zealand Pacific School",
      description: "Digitalización completa de comunicación con familias y automatización de informes docentes para centro educativo.",
      category: "EdTech",
      status: "80% uso activo"
    }
  ];

  return (
    <section id="proyectos" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Proyectos <span className="text-gradient-purple">finalizados</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Resultados reales que han transformado negocios y generado impacto medible en PYMEs y Startups
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card 
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover-scale bg-card group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <project.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-xs font-semibold text-secondary bg-secondary/10 px-3 py-1 rounded-full">
                    {project.status}
                  </div>
                </div>
                
                <div className="mb-3">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    {project.category}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {project.description}
                </p>

                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Ver detalles
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;