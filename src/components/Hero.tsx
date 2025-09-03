import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { useInView } from "react-intersection-observer";

const Hero = () => {
  const { ref: statsRef, inView: statsInView } = useInView({ threshold: 0.3, triggerOnce: true });
  
  const projectsCount = useCountUp({ end: 10, isVisible: statsInView });
  const satisfactionCount = useCountUp({ end: 100, isVisible: statsInView });
  const hoursCount = useCountUp({ end: 300, isVisible: statsInView });

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/542323550605?text=Hola! Quiero impulsar mi negocio con Plano", "_blank");
  };
  return <section id="inicio" className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden pt-20 pb-12 md:pt-16 md:pb-0">
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
        <div ref={statsRef} className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in" style={{
        animationDelay: "0.6s"
      }}>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">+{projectsCount}</div>
            <div className="text-sm text-muted-foreground">Proyectos Finalizados</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary">{satisfactionCount}%</div>
            <div className="text-sm text-muted-foreground">Satisfacción</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">+{hoursCount}</div>
            <div className="text-sm text-muted-foreground">Horas Ahorradas</div>
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;