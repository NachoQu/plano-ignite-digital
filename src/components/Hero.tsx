import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  const [counters, setCounters] = useState({ projects: 0, satisfaction: 0, hours: 0 });
  const [isVisible, setIsVisible] = useState(false);

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/542323550605?text=Hola! Quiero impulsar mi negocio con Plano", "_blank");
  };

  // Efecto para animar los contadores
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          animateCounters();
        }
      },
      { threshold: 0.5 }
    );

    const statsElement = document.getElementById('stats-section');
    if (statsElement) {
      observer.observe(statsElement);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  const animateCounters = () => {
    const duration = 2000; // 2 segundos
    const steps = 60;
    const stepDuration = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setCounters({
        projects: Math.floor(10 * progress),
        satisfaction: Math.floor(100 * progress),
        hours: Math.floor(300 * progress)
      });

      if (step >= steps) {
        clearInterval(timer);
        setCounters({ projects: 10, satisfaction: 100, hours: 300 });
      }
    }, stepDuration);
  };
  return <section id="inicio" className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden pt-16 pb-8 md:pb-0">
      {/* Background elements */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-10 w-24 h-24 bg-secondary/10 rounded-full blur-xl"></div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Logo */}
        

        {/* Main heading */}
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-up">
          <span className="text-gradient-purple">Desarrollo web</span>, branding y{" "}
          <span className="text-gradient-orange">herramientas internas</span>{" "}
          al servicio de tu PyME o Startup.
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed animate-fade-up" style={{
        animationDelay: "0.2s"
      }}>
          En Plano combinamos diseño, no-code e inteligencia artificial para crear marcas sólidas, 
          webs que generan clientes y soluciones digitales que ordenan tu negocio.
        </p>

        {/* CTA Button */}
        <div className="animate-fade-up" style={{
        animationDelay: "0.4s"
      }}>
          <Button onClick={handleWhatsAppClick} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-xl hover-scale group">
            Quiero impulsar mi negocio
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Stats or trust indicators */}
        <div id="stats-section" className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in" style={{
        animationDelay: "0.6s"
      }}>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-primary transition-all duration-500">+{counters.projects}</div>
            <div className="text-sm md:text-base text-muted-foreground mt-2">Proyectos Finalizados</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-secondary transition-all duration-500">{counters.satisfaction}%</div>
            <div className="text-sm md:text-base text-muted-foreground mt-2">Satisfacción</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-primary transition-all duration-500">+{counters.hours}</div>
            <div className="text-sm md:text-base text-muted-foreground mt-2">Horas Ahorradas</div>
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;