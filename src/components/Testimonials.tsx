import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, Star } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { useInView } from "react-intersection-observer";
import { ScrollAnimationWrapper } from "@/components/ScrollAnimationWrapper";

const Testimonials = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [maxHeight, setMaxHeight] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startScrollLeft, setStartScrollLeft] = useState(0);
  const { ref: statsRef, inView: statsInView } = useInView({ threshold: 0.3, triggerOnce: true });
  
  const projectsCount = useCountUp({ end: 10, isVisible: statsInView });
  const satisfactionCount = useCountUp({ end: 100, isVisible: statsInView });
  const hoursCount = useCountUp({ end: 300, isVisible: statsInView });

  const testimonials = [
    {
      quote: "Desde el inicio, el equipo de Plano entendió mi visión y creó un sitio web moderno y funcional. La comunicación fue excelente, cumplieron plazos y permitieron actualizaciones. Recomendados para quienes buscan calidad y profesionalismo. ¡Gracias, Plano!",
      author: "Sofía Ubertino Rosso",
      company: "SUR Interiorismo",
      rating: 5
    },
    {
      quote: "Trabajar con plano fue un gran acierto para resolver nuestras necesidades digitales. Su profesionalismo, compromiso y comunicación constante así como las soluciones personalizadas brindadas superaron nuestras expectativas. ¡Gracias Plano!",
      author: "Juan Manuel Tripi",
      company: "ICE - Ingeniería y Construcciones Eléctricas S.A.",
      rating: 5
    },
    {
      quote: "Plano digitalizó nuestra barbería con una web moderna e intuitiva. Ahora, nuestros clientes pueden reservar turnos fácilmente en ambas sucursales, mejorando la organización y la experiencia. ¡Gran trabajo y 100% recomendados!",
      author: "Lucas Ledesma",
      company: "Street Barber",
      rating: 5
    },
    {
      quote: "Estamos muy felices y satisfechas con el trabajo de PLANO WEB. Supieron interpretar exactamente lo que necesitábamos para nuestro estudio contable y crearon una web profesional, moderna y fácil de navegar. Además, siempre atentos y resolutivos en cada etapa del proceso. Gracias por potenciarnos y posicionarnos digitalmente en el mercado!",
      author: "Daniela Chiaramonte",
      company: "Chiaramonte & Sánchez",
      rating: 5
    }
  ];

  // Triplicamos los testimonios para scroll infinito suave
  const infiniteTestimonials = [...testimonials, ...testimonials, ...testimonials];

  // Calcular altura máxima de las cards
  useEffect(() => {
    const calculateMaxHeight = () => {
      const cards = document.querySelectorAll('.testimonial-card');
      let max = 0;
      cards.forEach(card => {
        const height = card.getBoundingClientRect().height;
        if (height > max) max = height;
      });
      setMaxHeight(max);
    };

    setTimeout(calculateMaxHeight, 100);
    window.addEventListener('resize', calculateMaxHeight);
    
    return () => window.removeEventListener('resize', calculateMaxHeight);
  }, []);

  // Auto-scroll suave con pausa en interacción del usuario
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let animationId: number;
    const speed = 0.8; // Velocidad más notoria

    const autoScroll = () => {
      if (!isUserInteracting && carousel) {
        carousel.scrollLeft += speed;
        
        // Loop infinito: cuando llegamos al final del primer set, volvemos al inicio
        if (carousel.scrollLeft >= carousel.scrollWidth / 3) {
          carousel.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(autoScroll);
    };

    // Iniciar animación
    animationId = requestAnimationFrame(autoScroll);
    return () => cancelAnimationFrame(animationId);
  }, [isUserInteracting]);

  // Pausar auto-scroll al pasar el cursor por encima
  const handleMouseEnter = () => {
    setIsUserInteracting(true);
  };

  const handleMouseLeave = () => {
    setIsUserInteracting(false);
  };

  // Manejar arrastre del mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsUserInteracting(true);
    setStartX(e.clientX);
    setStartScrollLeft(carouselRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    const x = e.clientX;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = startScrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setTimeout(() => setIsUserInteracting(false), 2000);
  };

  // Manejar toque en mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsUserInteracting(true);
    setStartX(e.touches[0].clientX);
    setStartScrollLeft(carouselRef.current?.scrollLeft || 0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!carouselRef.current) return;
    const x = e.touches[0].clientX;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = startScrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setTimeout(() => setIsUserInteracting(false), 2000);
  };

  return (
    <section id="testimonios" className="py-20 bg-muted/50">
      <div className="container mx-auto px-6">
        <ScrollAnimationWrapper animationType="fade-in">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Lo que dicen nuestros <span className="text-gradient-purple">clientes</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Testimonios reales de empresas que confiaron en Plano para impulsar su crecimiento digital
            </p>
          </div>
        </ScrollAnimationWrapper>

        {/* Carrusel de testimonios */}
        <div 
          className="relative max-w-7xl mx-auto mb-12 overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto scroll-smooth cursor-grab active:cursor-grabbing"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {infiniteTestimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 w-full max-w-4xl mx-auto"
                style={{ minWidth: '100%' }}
              >
                <Card 
                  className="testimonial-card border-0 shadow-lg bg-background card-hover"
                  style={{ height: maxHeight > 0 ? `${maxHeight}px` : 'auto' }}
                >
                  <CardContent className="p-6 md:p-8 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center mb-6">
                        <Quote className="h-12 w-12 text-primary/30 mr-4 flex-shrink-0" />
                        <div className="flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 text-secondary fill-current" />
                          ))}
                        </div>
                      </div>
                      
                      <blockquote className="text-foreground leading-relaxed mb-6 md:mb-8 italic text-base md:text-lg flex-grow">
                        "{testimonial.quote}"
                      </blockquote>
                    </div>
                    
                    <div className="border-t border-border/50 pt-4 md:pt-6 mt-auto">
                      <div className="font-semibold text-foreground text-lg md:text-xl">
                        {testimonial.author}
                      </div>
                      <div className="text-muted-foreground text-sm md:text-base">
                        {testimonial.company}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Trust indicators */}
        <ScrollAnimationWrapper animationType="scale" delay={200}>
          <div ref={statsRef} className="mt-16 text-center">
            <div className="bg-background rounded-2xl p-8 shadow-lg max-w-4xl mx-auto card-hover">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">+{projectsCount}</div>
                  <div className="text-sm text-muted-foreground">Proyectos Finalizados</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary mb-2">{satisfactionCount}%</div>
                  <div className="text-sm text-muted-foreground">Satisfacción</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">+{hoursCount}</div>
                  <div className="text-sm text-muted-foreground">Horas Ahorradas</div>
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimationWrapper>
      </div>
    </section>
  );
};

export default Testimonials;