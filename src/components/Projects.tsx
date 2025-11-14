import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, ShoppingCart, BarChart3, Calendar, GraduationCap, Package, ExternalLink, Building2, Palette, Scissors, Key, Zap, School, Store, Calculator } from "lucide-react";
import { ScrollAnimationWrapper } from "@/components/ScrollAnimationWrapper";
import { useTranslation } from "react-i18next";

const Projects = () => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState("TODAS");

  const projects = [
    {
      icon: Building2,
      title: t('projects.items.pallets.title'),
      description: t('projects.items.pallets.description'),
      category: t('projects.filters.web'),
      status: t('projects.status.published'),
      link: "https://palletsmarcelsrl.ar"
    },
    {
      icon: Package,
      title: t('projects.items.rhm.title'),
      description: t('projects.items.rhm.description'),
      category: t('projects.filters.web'),
      status: t('projects.status.published'),
      link: "https://rhmaislaciones.com"
    },
    {
      icon: Calculator,
      title: t('projects.items.chiaramonte.title'),
      description: t('projects.items.chiaramonte.description'),
      category: t('projects.filters.web'),
      status: t('projects.status.published'),
      link: "https://chiaramontesanchez.com.ar"
    },
    {
      icon: Palette,
      title: t('projects.items.sur.title'),
      description: t('projects.items.sur.description'),
      category: t('projects.filters.web'),
      status: t('projects.status.published'),
      link: "https://surinteriorismo.com"
    },
    {
      icon: Scissors,
      title: t('projects.items.streetbarber.title'),
      description: t('projects.items.streetbarber.description'),
      category: t('projects.filters.web'),
      status: t('projects.status.published'),
      link: "https://streetbarber.com.ar"
    },
    {
      icon: Key,
      title: t('projects.items.keytransaction.title'),
      description: t('projects.items.keytransaction.description'),
      category: t('projects.filters.web') + " / " + t('projects.filters.consulting'),
      status: t('projects.status.published'),
      link: "https://keytransaction.com.ar"
    },
    {
      icon: Zap,
      title: t('projects.items.ice.title'),
      description: t('projects.items.ice.description'),
      category: t('projects.filters.web'),
      status: t('projects.status.published'),
      link: "https://iceargentina.com"
    },
    {
      icon: School,
      title: t('projects.items.nzps.title'),
      description: t('projects.items.nzps.description'),
      category: t('projects.filters.edtech'),
      status: t('projects.status.active'),
      link: "https://nzps.com.ar"
    },
    {
      icon: Package,
      title: t('projects.items.bagual.title'),
      description: t('projects.items.bagual.description'),
      category: t('projects.filters.tools'),
      status: t('projects.status.implemented')
    },
    {
      icon: Store,
      title: t('projects.items.agrogy.title'),
      description: t('projects.items.agrogy.description'),
      category: t('projects.filters.web'),
      status: t('projects.status.published'),
      link: "https://www.agrogy.com"
    }
  ];

  return (
    <section id="proyectos" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <ScrollAnimationWrapper animationType="fade-in">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              {t('projects.title')} <span className="text-gradient-purple">{t('projects.titleHighlight')}</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('projects.subtitle')}
            </p>
          </div>
        </ScrollAnimationWrapper>

        {/* Filtros */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {[t('projects.filters.all'), t('projects.filters.web'), t('projects.filters.ecommerce'), t('projects.filters.edtech'), t('projects.filters.tools')].map((filter) => (
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
              activeFilter === t('projects.filters.all') || 
              project.category.includes(activeFilter)
            )
            .map((project, index) => (
            <ScrollAnimationWrapper
              key={index}
              animationType="scale"
              delay={index * 100}
            >
              <Card className="border-0 shadow-lg bg-card group card-hover h-full">
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
            </ScrollAnimationWrapper>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;