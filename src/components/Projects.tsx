import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, ShoppingCart, BarChart3, Calendar, GraduationCap, Package, ExternalLink, Building2, Palette, Scissors, Key, Zap, School, Store, Calculator } from "lucide-react";

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState("TODAS");

  const projects = [
    {
      icon: Building2,
      title: "Pallets Marcel SRL – Landing Page",
      description: "Landing institucional para fortalecer presencia digital y captar clientes del sector logístico.",
      category: "DESARROLLO WEB",
      status: "Publicado",
      link: "https://palletsmarcelsrl.ar"
    },
    {
      icon: Package,
      title: "RHM Aislaciones Avanzadas – Landing Page",
      description: "Sitio de presentación optimizado para mostrar servicios y generar consultas comerciales.",
      category: "DESARROLLO WEB",
      status: "Publicado",
      link: "https://rhmaislaciones.com"
    },
    {
      icon: Calculator,
      title: "Estudio Contable Chiaramonte & Sanchez – Web",
      description: "Página web institucional para comunicar servicios contables y facilitar el contacto con clientes.",
      category: "DESARROLLO WEB",
      status: "Publicado",
      link: "https://chiaramontesanchez.com.ar"
    },
    {
      icon: Palette,
      title: "Sur Interiorismo – Web Corporativa",
      description: "Plataforma moderna para exhibir proyectos de interiorismo con catálogo visual e integración de contacto.",
      category: "DESARROLLO WEB",
      status: "Publicado",
      link: "https://surinteriorismo.com"
    },
    {
      icon: Scissors,
      title: "Street Barber – Web Profesional",
      description: "Sitio completo con secciones de servicios, galería y contacto, orientado a clientes finales.",
      category: "DESARROLLO WEB",
      status: "Publicado",
      link: "https://streetbarber.com.ar"
    },
    {
      icon: Key,
      title: "Key Transaction – Landing Page",
      description: "Landing enfocada en transmitir propuesta de valor, captar leads y apoyar la comunicación de la marca.",
      category: "DESARROLLO WEB / CONSULTORÍA",
      status: "Publicado",
      link: "https://keytransaction.com.ar"
    },
    {
      icon: Zap,
      title: "ICE Ingeniería – Web Corporativa",
      description: "Sitio moderno con secciones técnicas y comerciales para posicionar a la empresa en el mercado industrial.",
      category: "DESARROLLO WEB",
      status: "Publicado",
      link: "https://iceargentina.com"
    },
    {
      icon: School,
      title: "New Zealand Pacific School",
      description: "Mejoras en comunicación interna con familias y automatización de informes docentes. Además, desarrollo y gestión de su sitio institucional.",
      category: "EDTECH",
      status: "80% de uso activo",
      link: "https://nzps.com.ar"
    },
    {
      icon: Package,
      title: "El Bagual – ERP",
      description: "Sistema de gestión integral para administración de stock, ventas y procesos internos de la empresa.",
      category: "HERRAMIENTAS INTERNAS",
      status: "Implementado"
    },
    {
      icon: Store,
      title: "Picconesi – Tienda Online",
      description: "Desarrollo de e-commerce con catálogo, pasarela de pagos y logística integrada para venta directa.",
      category: "E-COMMERCE",
      status: "Operativo",
      link: "https://picconesi.com.ar"
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

        {/* Filtros */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {["TODAS", "DESARROLLO WEB", "E-COMMERCE", "EDTECH", "HERRAMIENTAS INTERNAS"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeFilter === filter
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects
            .filter(project => 
              activeFilter === "TODAS" || 
              project.category.includes(activeFilter) ||
              (activeFilter === "DESARROLLO WEB" && project.category === "DESARROLLO WEB / CONSULTORÍA")
            )
            .map((project, index) => (
            <Card 
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover-scale hover-lift bg-card group animate-fade-in-up"
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
                  {project.link ? (
                    <a 
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-xs text-primary hover:text-primary/80 transition-colors cursor-pointer"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      {project.link.replace(/^https?:\/\//, '')}
                    </a>
                  ) : (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Ver detalles
                    </div>
                  )}
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